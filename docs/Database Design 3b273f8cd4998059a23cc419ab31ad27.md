# Database Design

# Project Information

| Item | Value |
| --- | --- |
| **Project** | Ruma |
| **Document Type** | Database Design |
| **Version** | 1.0 |
| **Status** | Draft |
| **Author** | Naufal Faiq Azryan |
| **Role** | Full Stack Software Engineer |
| **Repository** | `https://github.com/ryanazryan/ruma` |
| **Start Date** | 05 August 2026 |
| **Last Updated** | 28 August 2026 |

# Purpose

This Database Design document defines the structure, conventions, relationships, constraints, indexing strategy, and migration strategy of the **Ruma** database.

The document serves as a technical reference for backend development, schema evolution, database testing, and system maintenance.

The database design is maintained in alignment with the Ruma SRS, Architecture Design, API Documentation, Prisma schema, and implemented system behavior.

# Database Architecture

Ruma uses **PostgreSQL** as its primary relational database and **Prisma ORM** as the application data access layer.

The database is designed to support:

- Transactional commerce data
- User and authentication data
- Product catalog data
- Inventory data
- Order and payment data
- Future multi-brand and multi-supplier expansion

The database should remain independent from any specific product brand.

![image.png](Database%20Design/image.png)

# Database Conventions

| Item | Standard |
| --- | --- |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM |
| **Primary Key** | UUID |
| **Timezone** | UTC / database-managed timestamps |
| **Soft Delete** | `deleted_at` where applicable |
| **Timestamp** | `created_at`, `updated_at` |
| **Naming** | `snake_case` |
| **Encoding** | UTF-8 |

### Timezone note

I would change the old:

> `Asia/Makassar`
> 

to a more generic database standard unless the application explicitly requires that timezone for persistence.

For backend/database storage, use **UTC** for timestamps, while presentation can be localized to the user's or business timezone.

# Naming Conventions

| Object | Convention | Example |
| --- | --- | --- |
| **Table** | Plural `snake_case` | `verification_tokens` |
| **Column** | `snake_case` | `created_at` |
| **Foreign Key** | `<table>_id` | `user_id` |
| **Enum** | PascalCase | `UserRole` |
| **Index** | `idx_<table>_<column>` | `idx_sessions_user_id` |
| **Primary Key** | `<table>_pkey` | `users_pkey` |
| **Unique Constraint** | `<table>_<column>_key` | `users_email_key` |

# Data Type Standards

| Data Type | Standard |
| --- | --- |
| **Primary / Foreign Key** | UUID |
| **Short Text** | VARCHAR with explicit length where required |
| **Long Text** | TEXT |
| **Boolean** | BOOLEAN |
| **Timestamp** | TIMESTAMPTZ |
| **Enumerated Values** | PostgreSQL enum through Prisma |

Sensitive values such as passwords and credential hashes must use appropriate secure storage types and must never be stored as plain text.

# Entity Relationship Model

## Current Database Scope

The currently implemented database schema contains:

Users
Sessions
Verification Tokens

These entities currently support the implemented Authentication module.

Customer-related entities will be introduced incrementally as the Customer module is implemented.

Future entities will be introduced incrementally as additional Ruma modules are implemented.

## Current ERD

![image.png](Database%20Design/image%201.png)

## Entity Specifications

### Users

The `users` table stores account and identity information for Ruma users.

### Current Fields

| Field | Type | Nullable | Notes |
| --- | --- | --- | --- |
| `id` | UUID | No | Primary key |
| `full_name` | VARCHAR(100) | No | User full name |
| `email` | VARCHAR(255) | No | Unique user email |
| `password_hash` | TEXT | No | Secure password hash |
| `role` | UserRole | No | Current role enum |
| `account_status` | AccountStatus | No | Account state |
| `email_verified_at` | TIMESTAMPTZ | Yes | Email verification timestamp |
| `last_login_at` | TIMESTAMPTZ | Yes | Last successful login |
| `created_at` | TIMESTAMPTZ | No | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | No | Last update timestamp |
| `deleted_at` | TIMESTAMPTZ | Yes | Soft delete timestamp |

### Current Role

```
CUSTOMER
```

### Current Account Status

```
PENDING_VERIFICATION
ACTIVE
```

# Sessions

The `sessions` table stores authenticated user sessions.

Each session belongs to one user.

## Fields

| Field | Type | Nullable | Notes |
| --- | --- | --- | --- |
| `id` | UUID | No | Primary key |
| `user_id` | UUID | No | Foreign key to `users` |
| `token_lookup` | TEXT | No | Unique lookup identifier |
| `token_hash` | TEXT | No | Hashed session credential |
| `expires_at` | TIMESTAMPTZ | No | Session expiration |
| `revoked_at` | TIMESTAMPTZ | Yes | Revocation timestamp |
| `created_at` | TIMESTAMPTZ | No | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | No | Last update timestamp |

### Session Rules

- Each session belongs to exactly one user.
- A session with a populated `revoked_at` is revoked.
- A session past `expires_at` is expired.
- Session credentials are not stored as raw values.
- Session rotation may revoke a previous session and create a replacement session.

# Verification Tokens

The `verification_tokens` table stores temporary verification and password-reset credentials.

### Fields

| Field | Type | Nullable | Notes |
| --- | --- | --- | --- |
| `id` | UUID | No | Primary key |
| `user_id` | UUID | No | Foreign key to `users` |
| `token_lookup` | TEXT | No | Unique lookup identifier |
| `token_hash` | TEXT | No | Hashed token |
| `type` | VerificationTokenType | No | Token purpose |
| `expires_at` | TIMESTAMPTZ | No | Token expiration |
| `used_at` | TIMESTAMPTZ | Yes | Consumption timestamp |
| `created_at` | TIMESTAMPTZ | No | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | No | Last update timestamp |

### Token Types

```
EMAIL_VERIFICATION
PASSWORD_RESET
```

# Customer Profile

The Customer Profile domain stores customer-specific profile information associated with an authenticated user account.

The current Customer Profile implementation is based on the existing `users` entity for account identity information. Additional customer-specific attributes will be introduced only when required by the approved Customer requirements.

## Initial Customer Profile Scope

The Customer Profile feature supports:

- Viewing customer profile information
- Updating editable customer profile information
- Managing customer profile photo

## Data Ownership

- Each customer profile belongs to exactly one user account.
- Customer profile data must be accessed using the authenticated user's identity.
- A customer must not be able to access or modify another customer's profile data.

## Profile Photo

Profile photo storage requires a media reference associated with the customer account.

The final persistence strategy for the profile photo will be defined during implementation based on the selected Cloudinary integration approach.

# Index Strategy

The database uses indexes to improve lookup, filtering, joining, and uniqueness enforcement.

## Current Indexes

### Users

```
Primary Key: id
Unique: email
Index: role
Index: account_status
Index: deleted_at
```

### Sessions

```
Primary Key: id
Unique: token_lookup
Unique: token_hash
Index: user_id
Index: expires_at
Index: revoked_at
```

### Verification Tokens

```
Primary Key: id
Unique: token_lookup
Unique: token_hash
Index: user_id
Index: type
Index: expires_at
```

## Indexing Principles

- Primary keys are indexed automatically.
- Unique fields use unique indexes/constraints.
- Foreign keys should be indexed when needed for relationship lookups.
- Frequently queried fields should be indexed based on actual query patterns.
- Avoid unnecessary indexes on low-value fields.
- Query performance should be verified before introducing additional indexes.

# Constraints & Data Integrity

## Constraint Principles

Each relational entity should:

- Have a primary key.
- Define foreign key relationships where applicable.
- Enforce required values using `NOT NULL`.
- Enforce uniqueness where required.
- Use enums for controlled values where appropriate.
- Enforce critical integrity rules at the database level.

## Current Integrity Rules

- User email must be unique.
- Each session must reference an existing user.
- Each verification token must reference an existing user.
- Session lookup values must be unique.
- Verification token lookup values must be unique.
- Token hashes must be securely stored.
- Password hashes must not contain plain-text passwords.

# Delete Strategy

| Data Type | Strategy |
| --- | --- |
| **User / Master Data** | Soft delete where appropriate |
| **Authentication Sessions** | Revoke rather than restore as valid |
| **Verification Tokens** | Can be invalidated and cleaned up |
| **Transaction Data** | Preserve historical records |
| **Audit / Log Data** | Retain according to retention policy |

The final delete strategy for commerce entities will be defined when those modules are introduced.

# Migration Strategy

Ruma uses **Prisma Migrate** for schema evolution.

## Migration Principles

- Database structure changes must be performed through migrations.
- Production schema changes must not be applied manually.
- Migration history must be version-controlled.
- Migrations must be tested in development before production deployment.
- Previously deployed production migrations must not be edited.
- Schema changes should originate from `schema.prisma`.

![image.png](Database%20Design/image%202.png)

## Migration Tooling

| Item | Technology |
| --- | --- |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM |
| **Migration Tool** | Prisma Migrate |
| **Version Control** | Git |

# Database Security

The database layer must protect sensitive application data.

### Authentication Data

- Passwords are stored only as secure hashes.
- Session credentials are not stored in plain text.
- Verification and password-reset credentials are securely stored.
- Database credentials must be managed through environment configuration.

### Access Control

- Production database access must be restricted.
- Application access should use controlled database credentials.
- Direct public access to PostgreSQL must not be exposed.

# Scalability & Extensibility

The database must support future catalog expansion without structural dependence on specific brands.

The product model will conceptually follow:

![image.png](Database%20Design/image%203.png)

Future examples may include:

```
Moorlife
Cleo Oxygen
Tupperware
Tas Purun
Future Brands
Future Imported Products
```

These are **data values**, not hardcoded database structures.

Additional commerce entities will be introduced as their modules are implemented:

```
Product
Product Variant
Inventory
Cart
Cart Item
Order
Order Item
Payment
Shipment
Promotion
Review
Notification
```

Additional customer entities may include:

- Customer Profile
- Customer Address
- Wishlist Item

Additional commerce entities will be introduced as their modules are implemented:
...

# Current Database Status

| Area | Status |
| --- | --- |
| **Users** | ✅ Implemented |
| **Sessions** | ✅ Implemented |
| **Verification Tokens** | ✅ Implemented |
| **Customer Profile** | ⏳ Planned |
| **Customer Address** | ⏳ Planned |
| **Wishlist** | ⏳ Planned |
| **Product Catalog** | ⏳ Planned |
| **Inventory** | ⏳ Planned |
| **Shopping Cart** | ⏳ Planned |
| **Orders** | ⏳ Planned |
| **Payments** | ⏳ Planned |
| **Promotions** | ⏳ Planned |
| **Notifications** | ⏳ Planned |
| **Reporting** | ⏳ Planned |

# Related Documents

### Product & Business

- [Vision](Vision%203b273f8cd4998078b747dd9f26f4a904.md)
- [Product Requirement (PRD)](Product%20Requirement%20(PRD)%203b273f8cd49980aaa876eeb7623fa9fb.md)
- [Master Feature List](Product%20Requirement%20(PRD)/Master%20Feature%20List%203b273f8cd49980e78d8eeb2b2d9b6a8f.md)
- [Roadmap](Roadmap%203b273f8cd49980c393d3d8e24631d3bd.md)

### Engineering

- [Software Requirement (SRS)](Software%20Requirement%20(SRS)%203b273f8cd49980bbb8e5f324d0b5dfb1.md)
- [Architecture Design](Architecture%20Design%203b373f8cd499801ab4b3e2c029c24da5.md)
- [API Documentation](API%20Documentation%203b273f8cd49980d1b823e2a12377fe32.md)
- [Tech Stack](Tech%20Stack%203b273f8cd499806baf4cd1b9bf770e3d.md)
- [Development Guide](Development%20Guide%203b373f8cd49980afbcdbedacc9fc5607.md)

### Design

- [UI Inspiration](UI%20Inspiration%203b273f8cd4998074b97fff76c5618742.md)
- [Sitemap](Product%20Requirement%20(PRD)%203b273f8cd49980aaa876eeb7623fa9fb.md)
- [User Journey](Product%20Requirement%20(PRD)%203b273f8cd49980aaa876eeb7623fa9fb.md)