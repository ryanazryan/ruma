# Ruma Marketplace

Ruma Marketplace is a web-based e-commerce platform designed to provide a seamless customer shopping experience while supporting integrated marketplace operations.

The platform covers the core customer journey, including product discovery, catalogue browsing, product search and filtering, wishlist, cart management, checkout, shipping, payment, order management, membership, and customer account management.

On the operational side, Ruma supports marketplace management capabilities such as product management, inventory management, order management, payment verification, and user management.

## Project Status

🚧 **Under Development**

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- TypeScript
- Prisma ORM

### Database
- PostgreSQL
- Redis

### External Services
- Midtrans
- Biteship
- Cloudinary
- Resend

## Core Capabilities

### Customer
- Authentication
- Product catalogue
- Product search
- Product filtering and sorting
- Product details
- Wishlist
- Shopping cart
- Checkout
- Shipping calculation
- Payment
- Order management
- Membership
- Customer account

### Marketplace Operations
- Product management
- Inventory management
- Order management
- Payment verification
- User management
- Marketplace administration

## Repository Structure

```text
apps/
├── frontend/
└── backend/

packages/
docs/
docker/
.github/

Documentation

Project documentation is maintained under the docs/ directory and provides the reference for product requirements, business rules, system requirements, database design, API specifications, and development guidelines.

The main documentation areas include:

Master Feature List
Functional Requirements
Business Rules & State Machines
Software Requirements Specification
Database Design
API Documentation
Development Guide
Architecture

Ruma Marketplace follows a modular full-stack architecture designed to support maintainability, scalability, and future feature expansion.

Frontend
   │
   │ REST API
   ▼
NestJS Backend
   │
   ├── Prisma ORM
   │
   ▼
PostgreSQL
   │
   └── Redis

External Services
   ├── Midtrans
   ├── Biteship
   ├── Cloudinary
   └── Resend
Development

The project is structured as a monorepo containing the frontend application, backend application, shared packages, documentation, and development infrastructure.

apps/frontend   → Customer-facing web application
apps/backend    → REST API and business logic
packages/       → Shared packages
docs/           → Project documentation
docker/         → Development infrastructure
.github/        → Repository configuration and workflows
License

This project is currently under development and is intended for authorized use only.