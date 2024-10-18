# Prime Hub
![Landing Page Image](src/public/landing.png)

## Overview

Prime Hub is an advanced e-commerce platform designed to provide a seamless shopping experience. It features a robust backend developed from scratch, paired with a modern frontend built using React. The platform supports multiple user roles, comprehensive product management, and secure payment processing via Stripe, making it ideal for diverse e-commerce needs.

## Features

### User Authentication and Authorization

- **User Registration:** Allows users to create accounts.
- **Role Management:** Supports Admin, Seller, and Shopper roles.
- **Secure Authentication:** Utilizes JWT for secure access.

### Admin Capabilities

- **User Management:** Add, delete, and manage user roles.

### Seller Features

- **Product Listings:** Sellers can list products for sale with detailed descriptions.
- **Product Updates:** Update and delete product listings as needed.

### Shopper Experience

- **Product Browsing:** Easy navigation through available products.
- **Shopping Cart:** Add items to the cart and proceed to checkout.
- **Secure Payments:** Process payments securely using Stripe.

### Product Management

- **CRUD Operations:** Full create, read, update, and delete capabilities for products.
- **Image Management:** Upload and store product images using Cloudinary.


**Note:** To delete a user, ensure that all products associated with the user are deleted first.

## Technologies Used

### Backend

- **Node.js** For building the server.
- **PostgreSQL:** Database management, facilitated through **Prisma ORM**.
- **JWT:** For secure authentication.

### Frontend

- **React** with **Next.js:** For server-side rendering and enhanced routing capabilities.
- **Redux Toolkit:** For global state management.
- **Tailwind CSS:** For responsive and modern UI design.

### External Services

- **Cloudinary:** For efficient image storage and management.
- **Stripe:** For secure payment processing. Not full implemented yet

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or later.
    - To check your Node.js version, run:
        
        ```bash
        node -v
        ```
        
- **npm**: Version 9.x or later (comes with Node.js).
    - To check your npm version, run:
        
        ```bash
        npm -v
        ```
        
- **PostgreSQL**: Version 15.x or later.
    - To check your PostgreSQL version, run:
        
        ```bash
        psql --version
        ```
        
- **Prisma CLI**: Version 5.x or later (for database migrations).
    - To check your Prisma version, run:
        
        ```bash
        npx prisma -v
        ```
Ensure all prerequisites are installed and set up correctly before proceeding with the project setup.


### 1. Clone the Repository

```bash
git clone <https://github.com/chiemezie1/prime_hub_ecommerce.git>
cd prime_hub_ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following structure:

```plaintext

DATABASE_URL="postgresql://postgres_user:password@localhost:5432/your_database"
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

```

Replace placeholder values with your actual credentials. It is recommended to use [Supabase](https://supabase.com/) for the database and [Cloudinary](https://console.cloudinary.com/) for image storage.

### 4. Set Up the Database

Run the following command to apply Prisma migrations and initialize your database:

```bash
npx prisma migrate dev
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- **/src**: Main source code directory.
- **/app**: Contains Next.js app router and page components.
- **/components**: Reusable React components.
- **/components/Layout**: Contains the home page code, including the cart.
- **/redux**: Redux store, slices, and services.
- **/types**: TypeScript type definitions.
- **/utils**: Helper functions and utility code.
- **/prisma**: Contains Prisma schema and migration files.

## API Endpoints

- **/api/auth**: Routes for user authentication (register, login, logout).
- **/api/users**: User management routes (CRUD operations for users).
- **/api/products**: Product management routes (CRUD operations for products).
- **/api/update-orders**: Routes to create and manage orders.
- **/api/profile**: User profile management.
- **/api/upload**: Upload product images.
- **/api/stripe**: Handle Stripe payment integration.

## Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License

This project is licensed under the **MIT License**. See the LICENSE file for more details.