# InkSpire 📝

A modern, full-stack blogging platform built with cutting-edge web technologies. InkSpire provides a seamless writing and reading experience with robust authentication, AI-powered features, social interactions, and a beautiful user interface.

## ✨ Features

### Core Functionality
- **📖 Blog Management**: Create, edit, and publish blog posts with a rich text editor (React Quill)
- **🔍 Search & Filter**: Powerful search functionality with sorting options (newest, oldest, title A-Z/Z-A)
- **👤 Personal Dashboard**: Manage your posts and profile from a centralized dashboard
- **🖼️ Image Upload**: Drag-and-drop image upload functionality with Cloudflare R2 storage
- **📱 Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **🎨 Dark Mode**: Beautiful "Stranger Things" inspired dark theme with smooth transitions

### AI-Powered Features
- **🤖 AI Summarizer**: Generate concise summaries from URLs or text content
  - URL summarization with metadata extraction
  - Text-based summarization
  - Engaging loading states during processing
  - Content moderation to filter abusive text
- **✨ AI Title Suggestions**: Get intelligent blog title suggestions powered by AI

### Social Interactions
- **💬 Comments**: Threaded comment system for engaging discussions
- **👍 Reactions**: Like/Dislike functionality for blogs
- **👥 User Profiles**: View author profiles and their published content
- **📊 Activity Tracking**: Track engagement metrics

### Security & Authentication
- **🔐 JWT Authentication**: Secure user authentication using JSON Web Tokens
- **🔒 Password Encryption**: Industry-standard bcrypt encryption for user passwords
- **🛡️ Protected Routes**: Role-based access control for sensitive operations
- **🔐 Secure File Upload**: Authenticated image uploads with validation

### Performance & Deployment
- **⚡ Edge Computing**: Backend deployed on Cloudflare Workers for ultra-low latency
- **🚀 Optimized Frontend**: Built with Vite for lightning-fast development and production builds
- **🌐 CDN Integration**: Cloudflare R2 for global image delivery
- **📦 Type Safety**: End-to-end type safety with TypeScript and shared Zod schemas

## 🛠️ Tech Stack

### Frontend
- **Vite**: Next-generation frontend tooling
- **React 18** + **TypeScript**: Modern UI development
- **Tailwind CSS v4**: Utility-first styling with latest features
- **React Router v7**: Client-side routing
- **React Quill**: Rich text editor for blog creation
- **Framer Motion**: Smooth animations and transitions
- **Axios**: HTTP client for API requests
- **DOMPurify**: XSS protection for user-generated content
- **Lucide Icons** + **Hero Icons**: Beautiful icon sets

### Backend
- **Hono**: Ultrafast web framework for Cloudflare Workers
- **Cloudflare Workers**: Serverless edge computing platform
- **Cloudflare R2**: Object storage for images
- **JWT**: Secure token-based authentication
- **Bcrypt.js**: Password hashing and encryption
- **Prisma**: Type-safe ORM with Accelerate for connection pooling

### Database
- **PostgreSQL**: Robust relational database
- **Prisma Accelerate**: Global database caching and connection pooling

### Common
- **Shared Zod Package** (`@rishi438/zod`): Centralized validation schemas for frontend and backend

## 🚀 Live Demo

Visit the live application: [https://ink-spire-rho.vercel.app/blogs](https://ink-spire-rho.vercel.app/blogs)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cloudflare account (for backend deployment)
- PostgreSQL database (or Cloudflare D1)

### Backend Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd blog/backend

# Install dependencies
npm install

# Set up environment variables
# Create .env file with the following:
DATABASE_URL="your-prisma-accelerate-url"
JWT_SECRET="your-jwt-secret-key"
SALT_ROUNDS=10

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Deploy to Cloudflare Workers
npm run deploy
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
# Create .env file with the following:
VITE_API_URL="your-cloudflare-workers-url"

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="your-prisma-accelerate-connection-url"
JWT_SECRET="your-jwt-secret-key"
SALT_ROUNDS=10
```

### Backend (wrangler.jsonc)
```jsonc
{
  "vars": {
    "DATABASE_URL": "your-database-url",
    "JWT_SECRET": "your-jwt-secret"
  },
  "r2_buckets": [
    {
      "binding": "MY_BUCKET",
      "bucket_name": "your-r2-bucket-name"
    }
  ],
  "ai": {
    "binding": "AI"
  }
}
```

### Frontend (.env)
```env
VITE_API_URL="https://your-worker.workers.dev"
```

## 📱 Features in Detail

### Authentication Flow
1. User registration with email and password
2. Password hashing using bcrypt (10 rounds)
3. JWT token generation upon successful login
4. Token stored in localStorage with automatic expiration handling
5. Protected routes with automatic redirect to login
6. Token-based authentication for all protected API calls

### Blog Operations
- **Create**: Rich text editor with formatting options, image upload support
- **Edit**: Full editing capabilities for blog authors
- **Delete**: Authors can delete their own posts
- **View**: Beautiful blog reading experience with syntax highlighting
- **Search**: Real-time search across titles and content
- **Sort**: Multiple sorting options (newest, oldest, alphabetical)
- **Filter**: Category-based filtering (backend support ready)

### AI Features
- **URL Summarization**: Paste any URL to get an AI-generated summary
- **Text Summarization**: Summarize custom text content
- **Title Suggestions**: Get creative title suggestions when creating blogs
- **Content Moderation**: Automatic filtering of inappropriate content
- **Loading States**: Engaging animations during AI processing

### Social Features
- **Comments**: Add, view, and manage comments on blog posts
- **Reactions**: Like/dislike blogs with visual feedback
- **User Profiles**: View author information and their published blogs
- **Activity Metrics**: Track views, likes, and engagement

### Image Upload
- **Drag & Drop**: Intuitive drag-and-drop interface
- **Progress Indicator**: Real-time upload progress
- **Validation**: File type and size validation
- **CDN Delivery**: Images served globally via Cloudflare R2
- **Disabled State**: Publish button disabled during upload

### Theme System
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Stranger Things Theme**: Unique dark mode inspired by the series
- **Persistent Preference**: Theme choice saved in localStorage
- **System-wide**: Consistent theming across all components

## 🏗️ Architecture

```
InkSpire
├── frontend/                 # Vite + React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Appbar.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   ├── Comments.tsx
│   │   │   ├── FullBlog.tsx
│   │   │   ├── Reaction.tsx
│   │   │   ├── SideBar.tsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Blogs.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── Publish.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AISummarize.tsx
│   │   │   ├── Signin.tsx
│   │   │   └── Signup.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── index.tsx    # useBlogs, useBlog hooks
│   │   │   └── ...
│   │   ├── context/         # React Context
│   │   │   └── ThemeContext.tsx
│   │   └── config.ts        # API configuration
│   └── package.json
│
├── backend/                 # Hono + Cloudflare Workers
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── user.ts      # Auth routes
│   │   │   ├── blog.ts      # Blog CRUD
│   │   │   ├── comment.ts   # Comment routes
│   │   │   ├── reaction.ts  # Like/Dislike
│   │   │   ├── upload.ts    # Image upload
│   │   │   └── ai.ts        # AI features
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Main app entry
│   ├── prisma/              # Database schema
│   ├── wrangler.jsonc       # Cloudflare configuration
│   └── package.json
│
└── common/                  # Shared code (optional)
    └── @rishi438/zod        # Shared Zod schemas
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth with expiration (7 days)
- **Password Hashing**: Bcrypt with 10 salt rounds
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Zod schema validation on frontend and backend
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: DOMPurify sanitization for user content
- **Content Moderation**: AI-powered filtering of abusive content
- **Authenticated Uploads**: Image uploads require valid JWT
- **Environment Secrets**: Sensitive data in environment variables

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - Register new user
- `POST /api/v1/user/signin` - User login
- `GET /api/v1/user/me` - Get current user (authenticated)

### Blogs
- `GET /api/v1/blog/bulk` - Get all blogs with pagination
- `GET /api/v1/blog/:id` - Get single blog with author details
- `POST /api/v1/blog` - Create blog (authenticated)
- `PUT /api/v1/blog` - Update blog (authenticated, author only)
- `DELETE /api/v1/blog/:id` - Delete blog (authenticated, author only)

### Comments
- `GET /api/v1/comment/:blogId` - Get all comments for a blog
- `POST /api/v1/comment` - Add comment (authenticated)

### Reactions
- `POST /api/v1/reaction/like` - Like a blog (authenticated)
- `POST /api/v1/reaction/dislike` - Dislike a blog (authenticated)

### Upload
- `POST /api/v1/upload` - Upload image to R2 (authenticated)

### AI Features
- `POST /api/v1/ai/summarize` - Summarize URL or text
- `POST /api/v1/ai/suggest-title` - Generate blog title suggestions

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface inspired by Medium
- **Animations**: Smooth transitions using Framer Motion
- **Loading States**: Skeleton screens and spinners for better UX
- **Tooltips**: Helpful tooltips for better user guidance
- **Responsive**: Mobile-optimized layouts and touch-friendly interactions
- **Accessibility**: Semantic HTML and ARIA labels
- **Error Handling**: User-friendly error messages

## 🚦 Development Workflow

### Running Locally

**Backend:**
```bash
cd backend
npm run dev  # Starts on http://localhost:8787
```

**Frontend:**
```bash
cd frontend
npm run dev  # Starts on http://localhost:5173
```

### Building for Production

**Frontend:**
```bash
npm run build  # Creates optimized production build
npm run preview  # Preview production build
```

**Backend:**
```bash
npm run deploy  # Deploy to Cloudflare Workers
```

### Linting
```bash
npm run lint  # Run ESLint
```

## 📊 Database Schema

The application uses Prisma with the following main models:
- **User**: User accounts with authentication
- **Blog**: Blog posts with rich content
- **Comment**: Comment threads on blogs
- **Reaction**: Likes/dislikes on blogs

See `backend/prisma/schema.prisma` for complete schema.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Rishi Raj**

## 🙏 Acknowledgments

- Built with [Hono](https://hono.dev/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/)
- Frontend powered by [Vite](https://vitejs.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- AI capabilities via Cloudflare Workers AI

## 🐛 Known Issues

- Category filtering requires backend implementation
- Mobile navigation can be improved
- Image optimization could be added

## 🗺️ Roadmap

- [ ] Add bookmark functionality
- [ ] Implement follow/unfollow users
- [ ] Email notifications for comments
- [ ] Advanced analytics dashboard
- [ ] Rich text formatting improvements
- [ ] Image editing capabilities
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Progressive Web App (PWA) support

---

⭐ If you found this project helpful, please give it a star!

**Built with ❤️ by Rishi Raj**
