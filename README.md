# Tech Pulse - Tech Blog Platform

A full-stack tech blog platform built with Node.js, Express, MongoDB, and React. Create, share, and discover tech articles with features like categories, tags, likes, bookmarks, and more.

## 🚀 Features

- **Blog Management**: Create, read, update, and delete blog posts
- **Authentication**: User registration and login with JWT
- **Categories & Tags**: Organize blogs with categories and tags
- **Social Features**: Like and bookmark articles
- **Image Upload**: Upload images using Cloudinary
- **Trending Blogs**: Discover trending articles based on engagement
- **Product Showcase**: Feature products within blog posts
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Rich Text Editor**: Create rich formatted content using Editor.js/Tiptap

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Router**: React Router v7
- **HTTP Client**: Axios
- **Text Editors**: Tiptap & Editor.js
- **Icons**: Lucide React

## 📁 Project Structure

```
tech_blog/
├── backend/
│   ├── config/          # Database and Cloudinary configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── seed/            # Database seeding
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API service calls
    │   ├── hooks/        # Custom React hooks
    │   ├── utils/        # Utility functions
    │   ├── App.jsx       # Main app component
    │   └── main.jsx      # Entry point
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🛠 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tech_pulse
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🚀 Running the Application

### Backend
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Development Build
```bash
cd frontend
npm run build
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs` - Create blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (protected)

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag (protected)

### Likes
- `POST /api/blogs/:id/like` - Like a blog (protected)
- `DELETE /api/blogs/:id/like` - Unlike a blog (protected)

### Bookmarks
- `POST /api/bookmarks` - Save a blog (protected)
- `DELETE /api/bookmarks/:id` - Remove bookmark (protected)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (protected)

### Upload
- `POST /api/upload` - Upload image to Cloudinary (protected)

## 🔐 Environment Variables

### Backend
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Environment (development/production)

### Frontend
- `VITE_API_BASE_URL` - Backend API URL

## 📖 Usage Examples

### Creating a Blog Post
1. Login or register an account
2. Navigate to "Create" page
3. Fill in title, description, content, and images
4. Select categories and tags
5. Publish the blog

### Bookmarking Articles
- Click the bookmark icon on any blog post to save it to your reading list
- View saved articles in the "Saved Blogs" section

### Discovering Content
- Browse by categories in the category section
- View trending articles on the home page
- Search and filter by tags

## 🔄 Database Models

- **User** - User accounts with authentication
- **Blog** - Blog post content
- **Category** - Blog categories
- **Tag** - Blog tags
- **Like** - User likes on blogs
- **Bookmark** - User saved blogs
- **Product** - Products featured in blogs
- **Image** - Uploaded images
- **BlogView** - Blog view tracking

## 🚀 Deployment

### Deploy to Vercel

#### Frontend Deployment
1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables:
   - `VITE_API_BASE_URL` - Your backend API URL
7. Click "Deploy"

#### Backend Deployment (Render/Heroku/Railway)
1. For services like Render or Railway, push to GitHub
2. Connect your repository
3. Add environment variables for MongoDB, Cloudinary, and JWT
4. Deploy

For full deployment guide, see [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@techpulse.com or open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] User comments and discussions
- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Admin dashboard
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] SEO optimization
- [ ] Related blog recommendations

---

Made with ❤️ by Tech Pulse Team
