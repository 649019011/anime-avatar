# Anime Avatar 🤖✨

AI-powered photo to anime avatar converter. Transform your photo into stunning anime style in seconds.

![Anime Avatar](https://img.shields.io/badge/AI-Anime%20Avatar-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📸 Upload any photo and transform it into anime style
- 🎌 5 unique anime art styles (Standard, Manga, Ghibli, Cyberpunk, Soft Cel-shading)
- ⚡ Fast AI-powered generation using Replicate
- 💰 Pay-per-use pricing (no subscription needed)
- 📱 Mobile-friendly responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- [Replicate API Token](https://replicate.com/account/api-tokens)

### Installation

```bash
# Clone the repository
git clone https://github.com/649019011/anime-avatar.git
cd anime-avatar

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local and add your REPLICATE_API_TOKEN
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating anime avatars!

### Production Build

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Model**: [Replicate](https://replicate.com/) - anything-v4.0
- **Styling**: CSS Modules + CSS Variables
- **Deployment**: Vercel / Cloudflare Pages

## 📁 Project Structure

```
anime-avatar/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts    # AI generation API
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx           # Main page
│   └── lib/                    # Utilities
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── next.config.js
```

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `REPLICATE_API_TOKEN` | Your Replicate API token |

Get your token at: https://replicate.com/account/api-tokens

## 💰 Pricing

- **Single generation**: $0.20
- **5 Credits pack**: $0.90
- **10 Credits pack**: $1.70

AI cost per image: ~$0.0012

## 📄 License

MIT License - feel free to use for your own projects!

---

Made with 💜 by Anime Avatar Team
