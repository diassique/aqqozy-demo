import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: Request) {
  console.log('📨 Received contact form submission');
  console.log('Bot Token:', TELEGRAM_BOT_TOKEN ? '✅ Present' : '❌ Missing');
  console.log('Chat ID:', TELEGRAM_CHAT_ID ? '✅ Present' : '❌ Missing');
  
  try {
    const body = await req.json();
    const { name, phone, message } = body;
    
    console.log('📝 Form data received:', { name, phone, messageLength: message?.length });

    // Validate input
    if (!name || !phone || !message) {
      console.error('❌ Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Name, phone and message are required' },
        { status: 400 }
      );
    }

    // Format message for Telegram
    const formattedMessage = `
📬 New Contact Form Submission

👤 Name: ${name}
📞 Phone: ${phone}
💬 Message: ${message}
⏰ Time: ${new Date().toLocaleString()}
`;

    // Send to Telegram
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Telegram configuration missing:', {
        hasToken: !!TELEGRAM_BOT_TOKEN,
        hasChatId: !!TELEGRAM_CHAT_ID
      });
      throw new Error('Telegram configuration is missing');
    }

    try {
      console.log('🚀 Attempting to send message to Telegram...');
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      console.log('📡 Telegram API URL:', telegramUrl);
      
      const telegramResponse = await sendToTelegram(formattedMessage);
      const responseText = await telegramResponse.text();
      console.log('📬 Telegram API response:', {
        status: telegramResponse.status,
        ok: telegramResponse.ok,
        response: responseText
      });

      if (!telegramResponse.ok) {
        throw new Error(responseText);
      }
      
      console.log('✅ Message sent successfully to Telegram');
    } catch (telegramError) {
      console.error('❌ Telegram error details:', {
        error: telegramError.message,
        stack: telegramError.stack
      });
      return NextResponse.json(
        { error: 'Failed to send message to Telegram' },
        { status: 500 }
      );
    }

    console.log('✅ Contact form processed successfully');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Contact form error:', {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}

// Telegram send function
async function sendToTelegram(message: string) {
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  console.log('📤 Sending Telegram request with payload:', {
    chat_id: TELEGRAM_CHAT_ID,
    messageLength: message.length
  });

  return fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  });
} 