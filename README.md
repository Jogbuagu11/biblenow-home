# BibleNOW Web App

A modern, responsive web application for the BibleNOW Christian social platform, built with Next.js, TypeScript, and Tailwind CSS. This web app shares the same Supabase backend as the Flutter mobile app.

## 🚀 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme switching with user preference
- **Real-time Updates**: Live streaming and real-time notifications
- **Social Features**: Follow users, join groups, create posts
- **Authentication**: Secure user authentication with Supabase Auth
- **Modern UI**: Clean, accessible interface with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (shared with Flutter app)
- **Authentication**: Supabase Auth
- **Icons**: Heroicons
- **Deployment**: Vercel

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── providers.tsx   # Context providers
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── pages/         # Page components
│   │   ├── sections/      # Section components
│   │   └── ui/            # UI components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── shared/                # Shared logic with Flutter app
│   ├── services/          # Shared Supabase services
│   └── types/             # Shared TypeScript types
├── public/                # Static assets
└── ...config files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase project (shared with Flutter app)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bible_now-main/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

The app is designed with a mobile-first approach:

- **Desktop (1024px+)**: Full sidebar navigation, multi-column layout
- **Tablet (768px-1023px)**: Collapsible sidebar, adapted grid layouts
- **Mobile (<768px)**: Bottom navigation, single-column layout

## 🎨 Design System

### Colors
- **Primary**: Orange (#f26d1a) - Main brand color
- **Secondary**: Blue (#0ea5e9) - Accent color
- **Dark Theme**: Custom dark palette for better accessibility

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800, 900

### Components
- Consistent button styles (primary, secondary, outline)
- Card components with hover effects
- Avatar components in multiple sizes
- Badge components for status indicators

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** - Vercel will automatically deploy on every push

### Production URL

The production web app domain is:

- `https://biblenow.io`

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔗 Shared Backend

This web app shares the same Supabase backend as the Flutter mobile app:

- **Database**: Same tables and schema
- **Authentication**: Same user accounts
- **Real-time**: Shared real-time subscriptions
- **Edge Functions**: Same Supabase Edge Functions

## 📊 Features Comparison

| Feature | Web App | Flutter App |
|---------|---------|-------------|
| Authentication | ✅ | ✅ |
| Live Streaming | ✅ | ✅ |
| Social Features | ✅ | ✅ |
| Dark Theme | ✅ | ✅ |
| Responsive | ✅ | ✅ |
| Push Notifications | ❌ | ✅ |
| Offline Support | ❌ | ✅ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**BibleNOW** - Connect, share, and grow in faith together 🙏
