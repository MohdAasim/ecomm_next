# Ecommerce Next.js Application

A modern ecommerce website built with Next.js, featuring user authentication, shopping cart functionality, and a comprehensive product management system.

🚀 **Live Demo**: [https://ecommnext-ten.vercel.app/](https://ecommnext-ten.vercel.app/)

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Toastify & SweetAlert2
- **Email**: Nodemailer
- **Testing**: Jest with React Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- Docker & Docker Compose (for containerized development)
- MySQL database

## 🚀 Getting Started

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohdAasim/ecomm_next
   cd ecomm_next
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.development .env.local
   ```

   Configure your environment variables in `.env.local`

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Development

For containerized development with consistent environment:

```bash
# Build and run with Docker Compose
docker compose up --build

# Run in detached mode
docker compose up -d --build

# Stop containers
docker compose down
```

## 📝 Available Scripts

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start development server                |
| `npm run build`        | Build for production                    |
| `npm run start`        | Start production server                 |
| `npm run docker`       | Start development server in Docker mode |
| `npm run lint`         | Run ESLint                              |
| `npm run lint:css`     | Lint CSS/SCSS files                     |
| `npm run lint:css:fix` | Fix CSS/SCSS linting issues             |
| `npm run test`         | Run Jest tests                          |
| `npm run format`       | Format code with Prettier               |
| `npm run format:check` | Check code formatting                   |

## 🏗️ Project Structure

```
ecomm_next/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   ├── context/            # React Context providers
│   └── ...
├── public/                 # Static assets
├── .husky/                # Git hooks
├── docker-compose.yml     # Docker configuration
├── Dockerfile.dev         # Development Docker image
├── Dockerfile.prod        # Production Docker image
└── ...
```

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Tests are configured with:

- Jest as the test runner
- React Testing Library for component testing
- jsdom for DOM environment simulation

## 📦 Key Features

- **User Authentication**: JWT-based authentication system
- **Shopping Cart**: Context-based cart management
- **Product Management**: CRUD operations for products
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Email Integration**: Automated email notifications
- **Database Integration**: MySQL with Sequelize ORM
- **Type Safety**: Full TypeScript implementation

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository** and create your feature branch

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Follow the code style**

   - Run `npm run lint` to check for linting errors
   - Run `npm run format` to format your code
   - Ensure all tests pass with `npm run test`

3. **Commit your changes**

   ```bash
   git commit -m "Add some amazing feature"
   ```

   Husky will automatically run pre-commit hooks to ensure code quality

4. **Push to your branch**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Code Quality Standards

- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is enforced
- **TypeScript**: Maintain type safety
- **Testing**: Write tests for new features
- **Documentation**: Update README and add JSDoc comments

### Commit Guidelines

- Use conventional commit messages
- Keep commits focused and atomic
- Write clear, descriptive commit messages

## 🚀 Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

**Production URL**: [https://ecommnext-ten.vercel.app/](https://ecommnext-ten.vercel.app/)

### Manual Build

```bash
npm run build
npm run start
```

## 🔧 Configuration

### Environment Variables

Create appropriate `.env` files for different environments:

- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.local` - Local overrides (not committed)

### Database Setup

1. Install MySQL
2. Create a database for the project
3. Configure connection in your environment variables
4. Run Sequelize migrations (if applicable)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)

## 🐛 Issues & Support

If you encounter any issues or need support:

1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include environment details and steps to reproduce

## 📄 License

This project is private and proprietary.

---

**Happy Coding! 🚀**
