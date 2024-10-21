# POS SaaS Application

This project is a Point-of-Sale (POS) system built as a Software-as-a-Service (SaaS) application. It utilizes Next.js for the frontend and NestJS for the backend, creating a robust and scalable environment for merchants to manage their sales, products, and inventories.

![POS System Overview](path/to/your/image.png) <!-- Replace with the actual path to your image -->

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Frontend (Next.js)](#frontend-nextjs)
  - [Backend (NestJS)](#backend-nestjs)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This POS application allows merchants to easily manage their sales, customers, products, and inventory. It also includes features like handling due dates, creating invoices, and tracking purchase history.

## Features
- **User Authentication**: Secure login for merchants and users.
- **Inventory Management**: Manage products, stock levels, and supply chain.
- **Sales Tracking**: Record and track sales and payments.
- **Multi-Tenant Support**: SaaS model with support for multiple merchants.
- **Due Date Management**: Track invoices and payment deadlines.
- **Data Visualization**: Visual representation of sales and inventory data.

## Technologies

### Frontend
- **Next.js**: A React-based framework for building modern web applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ShadCN**: UI components library used for building the table and other UI elements.
- **React Query**: State management for data fetching.

### Backend
- **NestJS**: A progressive Node.js framework for building efficient server-side applications.
- **TypeORM**: An ORM used for managing database entities.
- **PostgreSQL**: The primary database for storing application data.
- **Jenkins**: CI/CD pipeline for automated deployment.

## Getting Started

### Prerequisites
- **Node.js** (version 16 or later)
- **Docker** and **Docker Compose** (for containerization)
- **PostgreSQL** (if running the database locally)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/pos-saas.git
    cd pos-saas
   ```

2. **Install dependencies**

   - For the backend:
     ```bash
     cd backend
     npm install
     ```

   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Environment Variables**

   Ensure you have the required environment variables set up for both the frontend and backend. Create a `.env` file in both the backend and frontend directories, and configure it with the appropriate settings (e.g., database connection, API keys).

4. **Database Setup**

   If you're running PostgreSQL locally, create a new database for the backend and update the backend's `.env` file with the database connection details.

   ```bash
   # Example PostgreSQL command to create a database
   psql -U postgres -c "CREATE DATABASE pos_saas_db;"
   ```

5. **Run Migrations**

   Run the database migrations to set up the required tables and relationships.
   ```bash
   cd backend
   npm run migration:run
   ```

