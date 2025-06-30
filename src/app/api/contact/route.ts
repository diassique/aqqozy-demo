import { NextResponse } from 'next/server';

// Загрузка и валидация переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Валидация переменных окружения при запуске
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ Отсутствуют обязательные переменные окружения:', {
    TELEGRAM_BOT_TOKEN: !!TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: !!TELEGRAM_CHAT_ID,
  });
}

// Общие заголовки для всех ответов
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Метод не разрешен. Этот эндпоинт принимает только POST запросы.',
      status: 'error'
    },
    { 
      status: 405,
      headers
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers
  });
}

export async function POST(req: Request) {
  console.log('📨 Получена заявка из контактной формы');
  console.log('Проверка окружения:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    hasToken: !!TELEGRAM_BOT_TOKEN,
    hasChatId: !!TELEGRAM_CHAT_ID,
  });
  
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Отсутствует конфигурация Telegram. Проверьте переменные окружения.');
    }

    const body = await req.json();
    const { name, phone, message, timestamp } = body;
    
    console.log('📝 Получены данные формы:', { name, phone, messageLength: message?.length, timestamp });

    // Валидация входных данных
    if (!name || !phone || !message) {
      console.error('❌ Ошибка валидации - отсутствуют обязательные поля');
      return NextResponse.json(
        { error: 'Имя, телефон и сообщение обязательны для заполнения' },
        { 
          status: 400,
          headers
        }
      );
    }

    // Форматирование сообщения для Telegram
    const formattedMessage = `
🔔 <b>НОВАЯ ЗАЯВКА С САЙТА</b> 🔔

👤 <b>Контактное лицо:</b>
<i>${name}</i>

📞 <b>Номер телефона:</b>
<code>${phone}</code>

💬 <b>Сообщение от клиента:</b>
<blockquote>${message}</blockquote>

⏰ <b>Время получения:</b>
<i>${timestamp || new Date().toLocaleString('ru-RU')}</i>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ <b>Требуется обработка заявки!</b>`;

    try {
      console.log('🚀 Попытка отправки сообщения в Telegram...');
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: formattedMessage,
          parse_mode: 'HTML',
        }),
      });

      const responseText = await telegramResponse.text();
      console.log('📬 Ответ Telegram API:', {
        status: telegramResponse.status,
        ok: telegramResponse.ok,
        response: responseText
      });

      if (!telegramResponse.ok) {
        throw new Error(responseText);
      }
      
      console.log('✅ Сообщение успешно отправлено в Telegram');
      return NextResponse.json(
        { success: true }, 
        { 
          status: 200,
          headers
        }
      );
    } catch (telegramError) {
      console.error('❌ Ошибка Telegram:', {
        error: telegramError.message,
        stack: telegramError.stack
      });
      return NextResponse.json(
        { error: 'Не удалось отправить сообщение в Telegram. Попробуйте позже.' },
        { 
          status: 500,
          headers
        }
      );
    }
  } catch (error) {
    console.error('❌ Ошибка контактной формы:', {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Не удалось обработать контактную форму' },
      { 
        status: 500,
        headers
      }
    );
  }
} 