# Ruma

Ruma is a scalable multi-brand lifestyle marketplace designed to support product discovery, shopping, checkout, payments, order management, inventory, and marketplace operations.

The platform is designed to support products from multiple brands, suppliers, and categories while providing an extensible foundation for future business and commerce capabilities.

## Project Status

🚧 Under Development

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

### Database & Infrastructure

- PostgreSQL
- Redis
- Docker

### External Services

- Midtrans
- Biteship
- Cloudinary
- Resend

## Core Modules

- Authentication
- Customer
- Product
- Shopping
- Checkout
- Payment
- Order
- Inventory
- Promotion
- Notification
- Reporting
- Administration

## Architecture

Ruma uses a modular monolith architecture with a separate web frontend and backend REST API.

```text
Web Browser
    │
    ▼
Next.js / React
    │
    ▼
NestJS REST API
    │
    ├── Authentication
    ├── Customer
    ├── Product
    ├── Shopping
    ├── Checkout
    ├── Payment
    ├── Order
    ├── Inventory
    ├── Promotion
    ├── Notification
    ├── Reporting
    └── Administration
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL