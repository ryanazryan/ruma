# Software Requirement (SRS)

# Project Information

| Item | Value |
| --- | --- |
| **Project** | Ruma |
| **Document Type** | Software Requirements Specification (SRS) |
| **Version** | 1.0 |
| **Status** | Draft |
| **Author** | Naufal Faiq Azryan |
| **Role** | Full Stack Software Engineer |
| **Repository** | - |
| **Start Date** | 05 August 2026 |
| **Last Updated** | 28 August 2026 |

# Purpose

This Software Requirements Specification (SRS) defines the software requirements for **Ruma** in detail.

The document serves as a technical reference for system design, development, testing, integration, and maintenance.

It defines the required system behavior, functional requirements, non-functional requirements, business rules, external integrations, security requirements, validation rules, and system constraints.

Detailed requirements are identified by unique Requirement IDs and are traceable to the Feature IDs defined in the Product Requirements Document (PRD) and Master Feature List.

# Scope

This SRS covers the software requirements for **Ruma v1.0**, a scalable multi-brand lifestyle marketplace.

The system includes:

- Authentication and session management
- Customer account management
- Product catalog and discovery
- Shopping cart
- Checkout
- Payment processing
- Order management
- Inventory management
- Promotion management
- Notification
- Reporting
- Administration
- Integration with external payment, shipping, media-storage, and email services

The system is designed to support products from multiple brands, suppliers, categories, and future product sources without requiring fundamental changes to the core marketplace architecture.

# Definitions, Acronyms & Abbreviations

| Term | Description |
| --- | --- |
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete |
| **SKU** | Stock Keeping Unit |
| **QRIS** | Quick Response Code Indonesian Standard |
| **VA** | Virtual Account |
| **UI** | User Interface |
| **UX** | User Experience |
| **MVP** | Minimum Viable Product |
| **REST** | Representational State Transfer |
| **RBAC** | Role-Based Access Control |
| **ORM** | Object Relational Mapping |
| **DTO** | Data Transfer Object |
| **UUID** | Universally Unique Identifier |
| **HTTPS** | Hypertext Transfer Protocol Secure |
| **TTL** | Time To Live |

**Note:** JWT is intentionally not included because the current Ruma authentication implementation uses session-based authentication rather than JWT-based authentication.

# Intended Audience

| Audience | Purpose |
| --- | --- |
| **Software Engineer** | Implement and maintain the system according to the specification. |
| **Frontend Developer** | Develop the web interface and integrate with backend APIs. |
| **Backend Developer** | Implement REST APIs, business logic, authentication, and external integrations. |
| **UI/UX Designer** | Design interfaces and user experiences according to product requirements. |
| **QA Engineer** | Design and execute functional and non-functional test cases. |
| **DevOps Engineer** | Manage deployment, infrastructure, monitoring, and CI/CD. |
| **Product Owner** | Ensure the implementation remains aligned with business requirements. |

# System Overview

Ruma is a web-based multi-brand lifestyle marketplace that allows customers to discover and purchase products from multiple brands and suppliers.

The platform provides centralized commerce capabilities including catalog management, shopping, checkout, payment, order management, inventory, notifications, and reporting.

The system also provides administrative capabilities for managing users, products, brands, suppliers, inventory, orders, promotions, and system configuration.

Ruma is designed to remain extensible as new brands, suppliers, product categories, and product sources are added.

# System Architecture

## Architecture Layers

| Layer | Technology / Responsibility |
| --- | --- |
| **Client Layer** | Desktop and mobile web browsers |
| **Presentation Layer** | Next.js, React, Tailwind CSS |
| **Application Layer** | NestJS REST API |
| **Data Access Layer** | Prisma ORM |
| **Data Layer** | PostgreSQL, Redis |
| **External Services** | Midtrans, Biteship, Cloudinary, Resend |

# System Context

Ruma interacts with several user roles and external services.

## System Context Diagram

![image.png](Software%20Requirement%20(SRS)/image.png)

## Overall System Architecture

![image.png](Software%20Requirement%20(SRS)/image%201.png)

# Functional Requirements

## Purpose

Functional Requirements define the specific system behavior required by Ruma.

Each requirement has a unique **Requirement ID** and is associated with a **Feature ID** from the Master Feature List.

Functional requirements are documented separately in the:

**Functional Requirements database/document.**

The Functional Requirements document is the detailed source for:

- Requirement behavior
- Actors
- Preconditions
- Main flows
- Alternative flows
- Postconditions
- Business rules
- Validation rules
- Acceptance criteria
- Related API endpoints

## Requirement Classification

| Type | Description |
| --- | --- |
| **Business Requirement** | Requirement originating from a business process or objective. |
| **User Requirement** | Requirement describing what users need to accomplish. |
| **System Requirement** | Requirement describing what the software must provide or enforce. |

## Requirement Priority

| Priority | Description |
| --- | --- |
| **Must Have** | Required for the planned release. |
| **Should Have** | Important but may be deferred. |
| **Could Have** | Additional capability that improves the product. |
| **Won't Have** | Explicitly excluded from the planned release. |

# Functional Requirement Modules

The Functional Requirements are organized according to the finalized Master Feature List:

AUTH
CUST
PROD
SHOP
CHKOUT
PAY
ORDER
INV
PROMO
NOTIF
REPORT
ADMIN

[Functional Requirements](Software%20Requirement%20(SRS)/Functional%20Requirements%203b373f8cd4998033a1d2ff28f94c8fa7.csv)

### Authentication

The authentication system must support:

- User registration
- Email verification
- User login
- Session authentication
- Session maintenance
- Session establishment
- User logout
- Session destruction
- Password recovery
- Password reset
- Session refresh
- Change password
- Role management
- Permission management

### Customer

The system must support:

- Customer profile
- Address book
- Wishlist
- Order history
- Notification center

### Product

The system must support:

- Product list
- Product detail
- Product categories
- Product search
- Product filtering
- Product sorting
- Product gallery
- Product reviews
- Product ratings
- Related products
- Best sellers
- New arrivals
- Brand management
- Supplier management

### Shopping

The system must support:

- Add to cart
- Update quantity
- Remove item
- Select item
- Shipping estimation
- Apply voucher

### Checkout

The system must support:

- Shipping address
- Courier selection
- Shipping service
- Payment method
- Order summary
- Place order

### Payment

The system must support:

- QRIS payment
- Virtual Account payment
- Payment callback
- Payment status
- Invoice

### Order

The system must support:

- Order history
- Order detail
- Order tracking
- Order cancellation
- Confirm received

### Inventory

The system must support:

- Stock management
- Stock adjustment
- Low stock alerts
- Stock history

### Promotion

The system must support:

- Banner management
- Voucher management
- Product discounts
- Flash sale

### Notification

The system must support:

- Email notifications
- Order notifications
- Payment notifications
- WhatsApp notifications

### Reporting

The system must support:

- Sales reports
- Revenue reports
- Product reports
- Customer reports

### Administration

The system must support:

- Admin dashboard
- User management
- Activity logging
- System settings

# Non-Functional Requirements

## Security

The system shall:

- Protect sensitive user data.
- Hash passwords using a secure password hashing algorithm.
- Protect authentication sessions.
- Prevent reuse of revoked sessions.
- Validate user input.
- Enforce authorization for protected resources.
- Use HTTPS in production.
- Avoid exposing sensitive credentials in API responses or logs.

## Performance

The system should:

- Provide responsive product browsing.
- Perform search and filtering efficiently.
- Avoid unnecessary database queries.
- Use caching where appropriate.
- Maintain acceptable response times for core commerce operations.

## Scalability

The system shall:

- Support increasing numbers of users and products.
- Support additional brands and suppliers.
- Support new product categories.
- Support future commerce capabilities.
- Avoid hardcoded brand-specific business logic.

## Maintainability

The system should:

- Follow modular architecture.
- Separate domain responsibilities.
- Use reusable services and components.
- Maintain clear API contracts.
- Maintain traceability between features and functional requirements.

## Usability

The system should:

- Provide clear navigation.
- Provide consistent interface behavior.
- Support responsive layouts.
- Provide meaningful error messages.
- Provide loading, success, and empty states.

# Data Requirements

Users
Sessions
Brands
Suppliers
Categories
Products
Inventory
Cart
Orders
Payments
Shipping
Promotions
Notifications
Reports
System Activities

## External System & Integration Requirements

| External Service | Purpose |
| --- | --- |
| **Midtrans** | Payment processing |
| **Biteship** | Shipping cost, courier, and tracking integration |
| **Cloudinary** | Product and user media storage |
| **Resend** | Transactional email delivery |
| **PostgreSQL** | Primary relational database |
| **Redis** | Cache and session-related supporting data |

External integrations must be isolated behind application-level services to reduce coupling between the core marketplace logic and third-party providers.

# API Requirements

The backend shall expose RESTful APIs for:

- Authentication
- Customer account management
- Product catalog
- Shopping cart
- Checkout
- Payment
- Orders
- Inventory
- Promotions
- Notifications
- Reporting
- Administration

API specifications are maintained separately in the [API Documentation](API%20Documentation%203b273f8cd49980d1b823e2a12377fe32.md) .

API responses should use a consistent response structure across modules.

# Error Handling

The system shall:

- Return appropriate HTTP status codes.
- Provide consistent error response structures.
- Validate request payloads before processing.
- Reject unauthorized requests.
- Reject invalid authentication sessions.
- Reject invalid or expired tokens.
- Prevent sensitive internal errors from being exposed to clients.
- Record relevant system errors for troubleshooting where appropriate.

# Business Rules

Ruma shall follow these core rules:

### Catalog

- Products must be associated with valid catalog entities.
- Brands must not be hardcoded into the application.
- New brands and suppliers must be addable through system data and administration workflows.

### Authentication

- Passwords must never be stored as plain text.
- Revoked sessions must not become valid again.
- Password reset tokens must not be reusable after successful consumption.

### Commerce

- Orders must reference valid products.
- Orders must preserve the product and pricing information required for historical records.
- Inventory changes must be controlled and traceable.

### Promotion

- Promotional rules must only apply when eligibility requirements are satisfied.

### Authorization

- Protected administrative operations must require appropriate authorization.

# System Constraints

The MVP has the following constraints:

- Web platform only.
- No mobile application.
- No multi-vendor marketplace.
- No multi-warehouse architecture.
- No multi-language support.
- No multi-currency support.
- No ERP integration.
- No accounting integration.
- No business intelligence platform.
- External payment and shipping capabilities depend on third-party service availability.

# Traceability

Requirements must remain traceable across documentation.

Vision
↓
PRD
↓
Master Feature List
↓
Functional Requirements
↓
Architecture
↓
Database Design
↓
API Documentation
↓
Implementation
↓
Testing

**Example:**

AUTH-007 Change Password
↓
FR-AUTH-014 Change Password
↓
AuthService.changePassword()
↓
POST /auth/change-password
↓
Functional Testing

This is especially important because **AUTH is already implemented**, while the remaining modules will be implemented incrementally.

# Acceptance & Verification

A requirement is considered verified when:

1. The implementation satisfies the defined functional behavior.
2. Validation rules are enforced.
3. Expected success scenarios work.
4. Alternative/error scenarios work.
5. Relevant security controls are enforced.
6. The implementation passes automated checks where applicable.
7. The behavior can be verified through the documented API or user interface.

Testing evidence should be associated with the corresponding Feature ID or Requirement ID.

# Related Documents

### Product & Business

- Vision
- Product Requirements Document (PRD)
- Master Feature List
- Roadmap

### Engineering

- Software Requirements Specification (SRS)
- Architecture Design
- Database Design
- API Documentation
- Tech Stack
- Development Guide

### Design

- UI Inspiration
- Detailed Sitemap
- User Flows

# Document Status

| Area | Status |
| --- | --- |
| Product Definition | ✅ Defined |
| Vision | ✅ Defined |
| Master Feature List | ✅ Defined |
| Authentication Requirements | ✅ Implemented |
| Core SRS Structure | 🟡 Draft |
| Product/Commerce Requirements | 🟡 Draft |
| Architecture | 🟡 To be finalized |
| Database Design | 🟡 To be reviewed |
| API Documentation | 🟡 To be reviewed |
| UI/UX | ⏳ Planned |