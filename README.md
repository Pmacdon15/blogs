# Pat's Blogs

A premium, modern blog platform built with Next.js 16, Neon (PostgreSQL), and Clerk for authentication.
Pat's blogs could be your blogs with a simple .env file

## 🚀 Features

- **Rich Text Editing:** Drag-and-drop sections for text, images, and headers.
- **Image Uploads:** Powered by Vercel Blob.
- **Dynamic Routing:** Fast, SEO-friendly blog pages.
- **Authentication:** Secure login and owner-only editing via Clerk.
- **Responsive Design:** Clean, dark-mode-first UI that works on all devices.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Neon (Serverless PostgreSQL)
- **Auth:** Clerk
- **Storage:** Vercel Blob
- **Styling:** Tailwind CSS + Radix UI (Base UI)
- **Icons:** Lucide React

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pmacdon15/blogs.git
cd blogs
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Set up environment variables

Copy the `.env.sample` file to `.env.local` and fill in your credentials.

```bash
cp .env.sample .env.local
```

You will need:
- A [Neon](https://neon.tech) database URL.
- [Clerk](https://clerk.com) publishable and secret keys.
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) read/write token.

### 4. Run the development server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📝 License

This project is licensed under the **MIT License** - you are free to do whatever you want with this code.

Copyright (c) 2026 Patrick Macdonald

---
Built by [Patrick Macdonald](mailto:patrick@patmac.ca)
