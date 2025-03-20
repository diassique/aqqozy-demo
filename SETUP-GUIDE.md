# Contact Form Setup Guide

This guide explains how to set up the contact form to collect leads via email and Telegram.

## Environment Variables

You need to configure the following environment variables in your `.env` file:

```
# For Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# For Email (Gmail example)
ADMIN_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password_here
EMAIL_SERVICE=gmail
```

## Setting up Telegram Bot

1. **Create a Telegram Bot**:
   - Open Telegram and search for "BotFather"
   - Start a chat with BotFather
   - Send the command `/newbot`
   - Follow the instructions to name your bot
   - Once created, BotFather will give you a **token** - copy this to your `.env` file as `TELEGRAM_BOT_TOKEN`

2. **Get your Chat ID**:
   - You can create a group for notifications or use your personal chat
   - For personal chat:
     - Search for "userinfobot" on Telegram
     - Start a chat, and it will give you your ID
   - For a group chat:
     - Add the bot to your group
     - Make a request to: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
     - Find the "chat" object in the response, which contains the `id` field
   - Copy the Chat ID to your `.env` file as `TELEGRAM_CHAT_ID`

## Setting up Email

For Gmail (similar steps apply to other email providers):

1. **Set up App Password**:
   - Go to your Google Account
   - Select "Security" 
   - Under "Signing in to Google," select "2-Step Verification" (must be enabled)
   - At the bottom, select "App passwords"
   - Generate a new app password for "Mail" and "Other (Custom name)" - name it for your app
   - Copy the 16-character password to your `.env` file as `EMAIL_PASSWORD`

2. **Alternative Email Services**:
   - You can use other email services by changing the `EMAIL_SERVICE` variable:
     - For Outlook/Hotmail: `EMAIL_SERVICE=hotmail`
     - For Yahoo: `EMAIL_SERVICE=yahoo`
     - For custom SMTP: You'll need to modify the nodemailer configuration

## Advanced Configuration (Optional)

You can further customize the email sending by editing the `sendEmail` function in `src/app/api/contact/route.ts`:

- To send HTML emails instead of plain text
- To add CC or BCC recipients
- To customize the from name

## Testing

After configuration:

1. Restart your Next.js development server
2. Open your website and submit the contact form
3. Check both your email and Telegram for the notification

## Troubleshooting

- **Telegram Not Working**: Verify your bot token and chat ID
- **Email Not Sending**: 
  - If using Gmail, ensure 2FA is enabled and you're using an app password
  - Check for error messages in your server logs
  - Verify your email and password are correct
  - For Gmail users: Make sure "Less secure app access" is enabled if not using an app password

## Production Deployment

When deploying to production:

1. Set the environment variables in your hosting platform
2. Use secrets management for sensitive tokens/passwords
3. Consider rate limiting the API endpoint to prevent abuse 