# EmailJS Contact Form Setup Guide

Your contact form is now ready to receive emails at **chukswilliams373@gmail.com**. Follow these steps to complete the setup:

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click "Sign Up Free"
3. Create an account (you can use your Gmail account)
4. Verify your email address

## Step 2: Connect Gmail Service

1. Log in to your EmailJS Dashboard
2. Go to **Email Services** (left sidebar)
3. Click **"Add Service"**
4. Select **"Gmail"** from the list
5. Click **"Connect Account"**
6. Authorize EmailJS to use your Gmail account (chukswilliams373@gmail.com)
7. Copy your **Service ID** (looks like: `service_abc123xyz`)

## Step 3: Create an Email Template

1. Go to **Email Templates** (left sidebar)
2. Click **"Create New Template"**
3. Set Template Name: `contact_form` (or your preferred name)
4. Use this template structure:

```
To Email: chukswilliams373@gmail.com
Subject: New Contact Form Submission from {{from_name}}

Message:
---
From: {{from_name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}
---
```

5. Make sure to use the exact variable names: `{{from_name}}`, `{{email}}`, `{{subject}}`, `{{message}}`
6. Click **"Save"**
7. Copy your **Template ID** (looks like: `template_abc123xyz`)

## Step 4: Get Your Public Key

1. Go to **Account** (top right, user menu)
2. Click **"API Keys"**
3. Copy your **Public Key** (looks like: `abcdef123456...`)

## Step 5: Update Your Contact Form

1. Open `assets/js/contact.js` in your project
2. Replace the following variables at the top with your credentials:

```javascript
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";     // Your Public Key
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";     // Your Service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";   // Your Template ID
```

Example:
```javascript
const EMAILJS_PUBLIC_KEY = "abcdef123456xyz789";
const EMAILJS_SERVICE_ID = "service_abc123xyz";
const EMAILJS_TEMPLATE_ID = "template_abc123xyz";
```

## Step 6: Test Your Form

1. Open your `contact.html` page in a browser
2. Fill out the contact form with test data
3. Click "Send Message"
4. Check your email (chukswilliams373@gmail.com) for the test message

## Troubleshooting

### Email not sending?
- Make sure all three credentials are correctly copied
- Check browser console (F12) for error messages
- Verify Gmail account is connected in EmailJS dashboard
- Check spam/promotions folder in Gmail

### Error "service_ID is not valid"?
- Re-verify your Service ID is correctly copied
- Make sure Gmail service is active in Email Services

### Email template variables not working?
- Ensure variable names match exactly: `{{from_name}}`, `{{email}}`, `{{subject}}`, `{{message}}`
- Save the template after making changes

## How It Works

1. User fills out contact form and clicks "Send Message"
2. JavaScript collects form data and validates it
3. EmailJS sends the message using your Gmail account
4. Email arrives in chukswilliams373@gmail.com inbox
5. You receive notifications for new messages

## Features

✅ Form validation (required fields and email format)
✅ Loading state on submit button
✅ Success/error messages displayed to user
✅ Auto-clears form after successful submission
✅ Responsive design works on all devices
✅ Free tier supports up to 200 emails/month

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Dashboard](https://dashboard.emailjs.com)
- Contact form is located in: `contact.html`
- Form JavaScript is in: `assets/js/contact.js`
- Form styling is in: `assets/css/main.css`
