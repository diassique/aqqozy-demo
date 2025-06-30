'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { X, Send, User, Phone, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/contact`
  : '/api/contact';

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    console.log('📝 Submitting form with data:', { 
      name, 
      phone, 
      messageLength: message.length,
      apiUrl: API_URL
    });
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          message,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse API response:', parseError);
        throw new Error('Server response was not in the expected format');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setIsSubmitting(false);
      setSubmitted(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Form submission error:', error.message);
      setIsSubmitting(false);
      setError(
        error.message === 'Failed to fetch' 
          ? 'Network error. Please check your internet connection and try again.'
          : error.message || 'Failed to submit form. Please try again.'
      );
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      let formattedValue = '';
      
      if (value.length > 0) {
        formattedValue = '+' + value.substring(0, 1);
      }
      if (value.length > 1) {
        formattedValue += ' (' + value.substring(1, 4);
      }
      if (value.length > 4) {
        formattedValue += ') ' + value.substring(4, 7);
      }
      if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 9);
      }
      if (value.length > 9) {
        formattedValue += '-' + value.substring(9, 11);
      }
      
      setPhone(formattedValue);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>

                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-tight text-gray-900 mb-2"
                >
                  Связаться с нами
                </Dialog.Title>
                
                <p className="text-sm text-gray-500 mb-6">
                  Заполните форму, и мы свяжемся с вами в ближайшее время
                </p>

                {submitted ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Спасибо за обращение!</h4>
                    <p className="text-gray-500">Мы свяжемся с вами в ближайшее время.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Ваше имя
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-[#fa5a20] focus:border-[#fa5a20] sm:text-sm"
                          placeholder="Иван Иванов"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Номер телефона
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={handlePhoneChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-[#fa5a20] focus:border-[#fa5a20] sm:text-sm"
                          placeholder="+7 (___) ___-__-__"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Сообщение
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-[#fa5a20] focus:border-[#fa5a20] sm:text-sm"
                          placeholder="Опишите ваш вопрос или запрос..."
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white ${
                          isSubmitting ? 'bg-[#f0855e] cursor-not-allowed' : 'bg-[#fa5a20] hover:bg-[#e75825] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fa5a20]'
                        } transition-colors duration-300`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Отправка...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Отправить сообщение
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Нажимая кнопку «Отправить сообщение», вы соглашаетесь с нашей{' '}
                      <span className="text-[#fa5a20] hover:underline cursor-pointer">
                        политикой конфиденциальности
                      </span>
                    </p>
                  </form>
                )}
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 