# HTML Email Sender with Inline CSS Conversion

A Next.js application that converts HTML content with `<style>` tags to inline CSS and sends emails via SendGrid.

## Features

- 📧 Send emails via SendGrid API
- 🎨 Automatic conversion of `<style>` tags to inline CSS using [juice](https://github.com/Automattic/juice)
- 🖥️ Single-page interface built with shadcn/ui components
- 🌙 Dark mode support
- ⚡ Built with Next.js 15 and TypeScript

## Prerequisites

- Node.js 18+ installed
- A SendGrid account and API key ([Get one here](https://sendgrid.com/))

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure SendGrid API Key:**

   Create a `.env.local` file in the root directory:

   ```bash
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SENDGRID_FROM_EMAIL=your_verified_sender@example.com
   ```

   > **Important:**
   >
   > - Get your API key from [SendGrid Settings > API Keys](https://app.sendgrid.com/settings/api_keys)
   > - The `SENDGRID_FROM_EMAIL` must be a verified sender in your SendGrid account
   > - Never commit `.env.local` to version control (it's already in `.gitignore`)

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open the application:**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter the recipient's email address
2. Add an email subject
3. Paste your HTML content with `<style>` tags in the textarea
4. Click "Send Email"

The application will automatically:

- Extract CSS from `<style>` tags
- Convert it to inline styles
- Send the email via SendGrid

### Example HTML Input

```html
<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #4caf50;
    color: white;
  }
</style>
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
  </tr>
  <tr>
    <td>John Doe</td>
    <td>john@example.com</td>
  </tr>
</table>
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Email Service:** SendGrid
- **CSS Inliner:** juice
- **Language:** TypeScript

## Project Structure

```
├── app/
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts          # SendGrid API endpoint
│   ├── page.tsx                   # Main UI page
│   └── globals.css                # Global styles
├── components/
│   └── ui/                        # shadcn/ui components
├── lib/
│   └── utils.ts                   # Utility functions
└── .env.local                     # Environment variables (create this)
```

## API Endpoint

**POST** `/api/send-email`

Request body:

```json
{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "htmlContent": "<style>...</style><html>...</html>"
}
```

Response (success):

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Troubleshooting

- **"SendGrid API key is not configured"**: Make sure `.env.local` exists with `SENDGRID_API_KEY`
- **"Failed to send email"**: Check that your SendGrid API key is valid and the sender email is verified
- **Styles not applying**: Ensure your CSS is inside `<style>` tags in the HTML content

## License

MIT
