# 🏥 Pharmacy Management System API

A comprehensive RESTful API built with Express.js, TypeScript, and Prisma for managing pharmacy operations including inventory, prescriptions, sales, customers, and suppliers.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Core Modules](#core-modules)
- [Authentication & Authorization](#authentication--authorization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 User Management

- User registration and authentication (Pharmacists, Managers, Cashiers)
- Role-based access control (RBAC)
- JWT-based authentication
- Password reset and email verification

### 💊 Inventory Management

- Medicine catalog with detailed information
- Stock tracking and low stock alerts
- Batch tracking with expiry dates
- Automated reorder points
- Barcode support

### 📝 Prescription Management

- Digital prescription processing
- Prescription validation and verification
- Doctor and patient information management
- Prescription history tracking

### 🛒 Sales Management

- Point of sale (POS) functionality
- Invoice generation and management
- Sales reporting and analytics
- Payment processing integration
- Customer purchase history

### 👥 Customer Management

- Customer registration and profiles
- Purchase history tracking
- Loyalty program support
- Customer notifications

### 🏭 Supplier Management

- Supplier information and contacts
- Purchase order management
- Supplier performance tracking
- Automated ordering system

### 📊 Reporting & Analytics

- Sales reports (daily, weekly, monthly)
- Inventory reports
- Financial reports
- Expiry reports
- Low stock reports

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Passport.js
- **Caching**: Redis
- **File Storage**: AWS S3 / Local Storage
- **Queue**: Bull (Redis-based)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Monitoring**: Winston (Logging), Prometheus (Metrics)
- **Containerization**: Docker

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)
- Docker (optional, for containerized deployment)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abdullahmia/SyncMeds-api
   cd SyncMeds-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install development dependencies**
   ```bash
   npm install --dev
   # or
   yarn install --dev
   ```

## ⚙️ Environment Setup

1. **Copy environment file**

   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**

   ```env
   # Application
   NODE_ENV=development
   PORT=3000
   API_VERSION=v1

   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/pharmacy_db"

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_REFRESH_EXPIRES_IN=30d

   # Redis
   REDIS_URL=redis://localhost:6379
   REDIS_PASSWORD=

   # Email (for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password

   # File Storage (AWS S3)
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=pharmacy-files

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## 🗄️ Database Setup

1. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

2. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   ```

3. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

### Production Mode

```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Using Docker

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Swagger Documentation

Once the server is running, visit:

- **Development**: `https://callback-cats-3295.postman.co/workspace/BACKEND-JOURNEY~380b5553-d906-4bdb-9c92-fabe484c2d82/collection/39624125-54ad123b-4bd3-4e59-b590-af8434407151?action=share&creator=39624125&active-environment=39624125-c5d53d77-6cbd-4e7a-94fa-5e69ec5a8511`

## 📁 Project Structure

```
src/
├── modules/                 # Feature modules
│   ├── user/               # User management
│   ├── auth/               # Authentication
│   ├── medicine/           # Medicine catalog
│   ├── inventory/          # Stock management
│   ├── prescription/       # Prescription handling
│   ├── sale/               # Sales operations
│   ├── customer/           # Customer management
│   ├── supplier/           # Supplier management
│   └── report/             # Reporting & analytics
├── core/                   # Core infrastructure
├── shared/                 # Shared utilities
├── api/                    # API versioning
└── tests/                  # Test utilities
```

## 🏗 Core Modules

### Health Checks

- `GET /health` - Basic health check

### Metrics

- Prometheus metrics available at `/metrics`
- Custom business metrics tracking
- Performance monitoring

### Logging

- Structured logging with Winston
- Log levels: error, warn, info, debug
- Log rotation and archival

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation as needed
- Follow the existing code style
- Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs)
2. Search [existing issues](https://github.com/your-username/pharmacy-management-api/issues)
3. Create a [new issue](https://github.com/your-username/pharmacy-management-api/issues/new)
4. Contact the development team

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Built with love for the pharmacy community
- Inspired by modern pharmacy management needs

---

**Made with ❤️ for better pharmacy management**
