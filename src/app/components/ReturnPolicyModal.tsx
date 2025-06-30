'use client';

import { Fragment } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';

interface ReturnPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReturnPolicyModal: React.FC<ReturnPolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full text-left"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Условия возврата и обмена
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="prose prose-gray max-w-none text-gray-600">
                  <p>
                    Компания осуществляет возврат и обмен этого товара в
                    соответствии с требованиями законодательства.
                  </p>
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">
                    Сроки возврата
                  </h4>
                  <p>
                    Возврат возможен в течение <strong>14 дней</strong> после
                    получения (для товаров надлежащего качества).
                  </p>
                  <p>
                    Обратная доставка товаров осуществляется по договоренности.
                  </p>
                  <p className="mt-4">
                    Согласно действующему законодательству вы можете вернуть товар
                    надлежащего качества или обменять его, если:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      товар не был в употреблении и не имеет следов использования
                      потребителем: царапин, сколов, потёртостей, пятен и т. п.;
                    </li>
                    <li>
                      товар полностью укомплектован и сохранена фабричная упаковка;
                    </li>
                    <li>сохранены все ярлыки и заводская маркировка;</li>
                    <li>
                      товар сохраняет товарный вид и свои потребительские свойства.
                    </li>
                  </ul>
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReturnPolicyModal; 