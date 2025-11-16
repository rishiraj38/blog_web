# InkSpire 📝

A modern, full-stack blogging platform built with cutting-edge web technologies. InkSpire provides a seamless writing and reading experience with robust authentication, social features, and a beautiful user interface.

## ✨ Features

### Core Functionality
- **📖 Blog Management**: Create, edit, and publish blog posts with a rich text editor
- **🔍 Search**: Powerful search functionality to discover content
- **👤 Personal Dashboard**: Manage your posts and profile from a centralized dashboard
- **💬 Social Interactions**: 
  - Comment on posts
  - Like/Dislike system
  - Engage with the community

### Security & Authentication
- **🔐 JWT Authentication**: Secure user authentication using JSON Web Tokens
- **🔒 Password Encryption**: Industry-standard bcrypt encryption for user passwords
- **🛡️ Protected Routes**: Role-based access control for sensitive operations

### Performance & Deployment
- **⚡ Edge Computing**: Backend deployed on Cloudflare Workers for ultra-low latency
- **🚀 Optimized Frontend**: Built with Vite for lightning-fast development and production builds
- **📱 Responsive Design**: Mobile-first approach ensures great experience across all devices

## 🛠️ Tech Stack

### Frontend
- **Vite**: Next-generation frontend tooling
- **React/TypeScript**: Modern UI development
- **Tailwind CSS**: Utility-first styling

### Backend
- **Hono**: Ultrafast web framework for Cloudflare Workers
- **Cloudflare Workers**: Serverless edge computing platform
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing and encryption

### Database
- **PostgreSQL** (via Cloudflare D1 or similar)
- **Prisma ORM**: Type-safe database client

## 🚀 Live Demo

Visit the live application: [https://ink-spire-rho.vercel.app/blogs](https://ink-spire-rho.vercel.app/blogs)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cloudflare account (for backend deployment)

### Backend Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd inkspire/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your database URL and JWT secret

# Run database migrations
npm run db:migrate

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
cp .env.example .env
# Add your backend API URL

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret-key"
SALT_ROUNDS=10
```

### Frontend (.env)
```env
VITE_API_URL="your-cloudflare-workers-url"
```

## 📱 Features in Detail

### Authentication Flow
1. User registration with email and password
2. Password hashing using bcrypt
3. JWT token generation upon successful login
4. Token-based authentication for protected routes
5. Automatic token refresh mechanism

### Blog Operations
- Create new blog posts with rich text formatting
- Edit existing posts
- Delete posts (author only)
- View all published posts
- Search posts by title and content

### Social Features
- Comment threads on blog posts
- Like/Dislike functionality
- User profiles
- Activity tracking

## 🏗️ Architecture

```
InkSpire
├── frontend/                 # Vite + React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Helper functions
│   │   └── api/             # API client
│   └── public/              # Static assets
│
└── backend/                 # Hono + Cloudflare Workers
    ├── src/
    │   ├── routes/          # API routes
    │   ├── middleware/      # Auth & validation
    │   ├── controllers/     # Business logic
    │   └── utils/           # Helper functions
    └── wrangler.toml        # Cloudflare configuration
```

## 🔐 Security Features

- JWT-based authentication with expiration
- Bcrypt password hashing (10 rounds)
- CORS configuration
- Input validation and sanitization
- SQL injection prevention via ORM
- XSS protection

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (authenticated)
- `PUT /api/blogs/:id` - Update blog (authenticated)
- `DELETE /api/blogs/:id` - Delete blog (authenticated)

### Interactions
- `POST /api/blogs/:id/like` - Like a blog
- `POST /api/blogs/:id/dislike` - Dislike a blog
- `POST /api/blogs/:id/comments` - Add comment
- `GET /api/blogs/:id/comments` - Get comments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Rishi Raj

## 🙏 Acknowledgments

- Built with [Hono](https://hono.dev/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/)
- Frontend powered by [Vite](https://vitejs.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

---

⭐ If you found this project helpful, please give it a star!
