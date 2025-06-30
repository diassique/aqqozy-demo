import { NextResponse } from 'next/server';

// Load and validate environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Validate environment variables on startup
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ Required environment variables are missing:', {
    TELEGRAM_BOT_TOKEN: !!TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: !!TELEGRAM_CHAT_ID,
  });
}

// Common headers for all responses
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed. This endpoint only accepts POST requests.',
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
  console.log('📨 Received contact form submission');
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    hasToken: !!TELEGRAM_BOT_TOKEN,
    hasChatId: !!TELEGRAM_CHAT_ID,
  });
  
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram configuration is missing. Please check environment variables.');
    }

    const body = await req.json();
    const { name, phone, message } = body;
    
    console.log('📝 Form data received:', { name, phone, messageLength: message?.length });

    // Validate input
    if (!name || !phone || !message) {
      console.error('❌ Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Name, phone and message are required' },
        { 
          status: 400,
          headers
        }
      );
    }

    // Format message for Telegram
    const formattedMessage = `
📬 New Contact Form Submission

👤 Name: ${name}
📞 Phone: ${phone}
💬 Message: ${message}
⏰ Time: ${new Date().toLocaleString()}
🌐 Environment: ${process.env.VERCEL_ENV || process.env.NODE_ENV}
`;

    try {
      console.log('🚀 Attempting to send message to Telegram...');
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
      console.log('📬 Telegram API response:', {
        status: telegramResponse.status,
        ok: telegramResponse.ok,
        response: responseText
      });

      if (!telegramResponse.ok) {
        throw new Error(responseText);
      }
      
      console.log('✅ Message sent successfully to Telegram');
      return NextResponse.json(
        { success: true }, 
        { 
          status: 200,
          headers
        }
      );
    } catch (telegramError) {
      console.error('❌ Telegram error details:', {
        error: telegramError.message,
        stack: telegramError.stack
      });
      return NextResponse.json(
        { error: 'Failed to send message to Telegram. Please try again later.' },
        { 
          status: 500,
          headers
        }
      );
    }
  } catch (error) {
    console.error('❌ Contact form error:', {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to process contact form' },
      { 
        status: 500,
        headers
      }
    );
  }
} 