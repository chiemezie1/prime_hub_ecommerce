# E-Commerce Platform

## Overview

This project is an advanced e-commerce platform designed to fulfill the requirements of a complex bounty challenge. It features a robust backend developed from scratch, along with a React-based frontend utilizing Redux for state management. The platform supports multiple user roles, product management, and secure payment processing via Stripe.

## Features

### User Authentication and Authorization

- Register new users.
- User roles: Admin, Seller, and Shopper.
- JWT-based authentication for secure access.

### Admin Capabilities

- Add new users.
- Delete existing users.
- Manage and assign user roles.

### Seller Features

- List products for sale.
- Set product prices and manage stock quantities.
- Update and delete product listings.

### Shopper Experience

- Browse available products.
- Add items to the cart and complete purchases.
- Secure payment processing using Stripe.

### Product Management

- Full CRUD operations for product management.
- Image upload and storage using Cloudinary.
- Product search and filter functionality.

### Order Processing

- Create and manage orders.
- Track order status and view order history.

#### Note
To delect a user you first delete all products associated with the user before deleting the user itself.

## Technologies Used

### Backend

- **Node.js** with **Express.js** for building the server.
- **PostgreSQL** as the database, managed through **Prisma ORM**.
- **JSON Web Tokens (JWT)** for secure authentication.

### Frontend

- **React** with **Next.js** for server-side rendering and routing.
- **Redux Toolkit** for global state management.
- **Tailwind CSS** for fast and responsive UI design.

### External Services

- **Cloudinary** for image storage and management.
- **Stripe** for secure payment processing.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <https://github.com/your-username/e-commerce-platform.git>
cd e-commerce-platform

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following structure:

```bash
DATABASE_URL="postgresql://postgres_user:password@localhost:5432/your_database"
DIRECT_URL="postgresql://postgres_user:password@localhost:5432/your_database"
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

```

Replace the placeholder values with your actual credentials.

### 4. Set Up the Database

Run the following command to apply the Prisma migrations and initialize your database:

```bash
bash
Copy code
npx prisma migrate dev

```

### 5. Run the Development Server

```bash
bash
Copy code
npm run dev

```

The application will be available at `http://localhost:3000`.

## Project Structure

- **/src**: Main source code directory.
- **/app**: Contains Next.js app router and page components.
- **/components**: Reusable React components.
- **/redux**: Redux store, slices, and services.
- **/types**: TypeScript type definitions.
- **/utils**: Helper functions and utility code.
- **/prisma**: Contains Prisma schema and migration files.

## API Endpoints

- **/api/auth**: Routes for user authentication (register, login, logout).
- **/api/users**: User management routes (CRUD operations for users).
- **/api/products**: Product management routes (CRUD operations for products).
- **/api/orders**: Routes to create and manage orders.
- **/api/stripe**: Routes to handle Stripe payment integration.

## Testing

To run the test suite and ensure code quality:

```bash
bash
Copy code
npm run test

```

## Deployment

The project is pre-configured for seamless deployment on **Vercel**:

1. Connect your GitHub repository to Vercel.
2. Deploy the main branch, and Vercel will handle the rest.

## Contributing

Contributions are highly welcome! Please feel free to open issues, submit pull requests, or provide feedback.

## License

This project is licensed under the **MIT License**. See the LICENSE file for more details.