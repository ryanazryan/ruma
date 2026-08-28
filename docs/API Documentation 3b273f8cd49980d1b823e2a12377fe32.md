# API Documentation

# Project Information

| Item | Value |
| --- | --- |
| **Project** | Ruma |
| **Document Type** | API Documentation |
| **Version** | 1.0 |
| **API Style** | REST API |
| **Data Format** | JSON |
| **Authentication** | Session-Based Authentication |
| **Status** | Draft |

# Purpose

This document defines the REST API standards and endpoint specifications for **Ruma**.

It serves as a technical reference for frontend development, backend development, QA testing, external service integration, and API maintenance.

The API documentation is aligned with the Ruma system architecture, Software Requirements Specification (SRS), Master Feature List, and implemented application behavior.

Detailed business behavior is defined in the Functional Requirements.

# API Standards

## Base URL

The development API is currently accessed through:

| Environment | URL |
| --- | --- |
| **Development** | `http://localhost:3001` |
| **Staging** | Not configured |
| **Production** | Not configured |

Production and staging URLs will be defined when the corresponding environments are available.

## HTTP Methods

| Method | Purpose |
| --- | --- |
| **GET** | Retrieve data or resources. |
| **POST** | Create data or execute an operation. |
| **PUT** | Replace an existing resource. |
| **PATCH** | Partially update an existing resource. |
| **DELETE** | Remove a resource. |

## HTTP Status Codes

| Code | Meaning |
| --- | --- |
| **200** | OK |
| **201** | Created |
| **204** | No Content |
| **400** | Bad Request |
| **401** | Unauthorized |
| **403** | Forbidden |
| **404** | Not Found |
| **409** | Conflict |
| **422** | Unprocessable Entity |
| **500** | Internal Server Error |
|  |  |

# Request Standards

## Content Type

JSON is used for standard API requests.

```
Content-Type: application/json
```

## Request Body

Request payloads must follow the DTO and validation rules defined by the corresponding endpoint.

Example:

```
{
  "email":"customer@example.com",
  "password":"example-password"
}
```

## Authentication Credentials

Ruma uses **session-based authentication**.

Protected requests use the session cookie:

```
Cookie: session=<session_token>
```

The API does **not** use:

```
Authorization: Bearer <access_token>
```

for the current authentication architecture.

# Response Standards

## Success Response

Ruma uses the following general success response structure:

```
{
  "success":true,
  "message":"Operation completed successfully.",
  "data": {}
}
```

## Error Response

```
{
  "success":false,
  "message":"Operation failed.",
  "errors": []
}
```

# API Versioning

The API uses versioning at the application/API level.

The intended version format is:

```
/api/v1
```

However, the current development environment should follow the actual backend global prefix configuration.

Breaking API changes should be introduced through a new API version rather than silently changing existing endpoint contracts.

# Authentication Architecture

Ruma uses **session-based authentication**.

## Authentication Flow

![image.png](API%20Documentation/image.png)

## Session Cookie

The session cookie is configured with security controls appropriate for the environment.

Current implementation:

- `HttpOnly`
- `Secure` in production
- `SameSite: Lax`
- `Path: /`

## Session Validation

Protected endpoints must reject:

- Missing session cookie
- Invalid session credentials
- Expired sessions
- Revoked sessions
- Sessions associated with unavailable users

## Session Refresh

Ruma supports session rotation through:

```
POST /auth/refresh
```

A successful refresh invalidates the previous session according to the session rotation implementation and issues a new session credential.

# Authentication API

> **Status: Implemented**
> 

## Endpoint Overview

| API ID | Method | Endpoint | Description | Authentication | Status |
| --- | --- | --- | --- | --- | --- |
| **AUTH-API-001** | POST | `/auth/register` | Register a new account | Public | Implemented |
| **AUTH-API-002** | GET | `/auth/verify-email` | Verify user email | Public | Implemented |
| **AUTH-API-003** | POST | `/auth/verify-email/resend` | Resend verification email | Public | Implemented |
| **AUTH-API-004** | POST | `/auth/login` | Authenticate user and create session | Public | Implemented |
| **AUTH-API-005** | GET | `/auth/me` | Retrieve authenticated user | Session | Implemented |
| **AUTH-API-006** | POST | `/auth/refresh` | Rotate active session | Session | Implemented |
| **AUTH-API-007** | POST | `/auth/logout` | Revoke active session | Session | Implemented |
| **AUTH-API-008** | POST | `/auth/forgot-password` | Request password recovery | Public | Implemented |
| **AUTH-API-009** | POST | `/auth/reset-password` | Reset password using recovery token | Public | Implemented |
| **AUTH-API-010** | POST | `/auth/change-password` | Change password for authenticated user | Session | Implemented |

# Authentication Endpoint Specifications

## Register

### Endpoint

```
POST /auth/register
```

### Authentication

```
Public
```

### Purpose

Creates a new customer account and initiates email verification.

### Request

```
{
  "fullName":"John Doe",
  "email":"john@example.com",
  "password":"securepassword",
  "confirmPassword":"securepassword"
}
```

### Success Response

```
{
  "success":true,
  "message":"Registration successful.",
  "data":null
}
```

The exact success message may follow the implementation response contract.

### Possible Errors

```
400 Bad Request
409 Conflict
422 Unprocessable Entity
```

Examples:

```
{
  "success":false,
  "message":"Email already exists.",
  "errors": []
}
```

```
{
  "success":false,
  "message":"Password confirmation does not match.",
  "errors": []
}
```

## Verify Email

### Endpoint

```
GET /auth/verify-email?token=<verification_token>
```

### Authentication

```
Public
```

### Purpose

Verifies a user's email using a valid verification token.

### Success Response

```
{
  "success":true,
  "message":"Email verified successfully.",
  "data":null
}
```

### Possible Errors

```
400 Bad Request
```

Examples:

- Missing token
- Invalid token
- Expired token
- Previously used token
- Account already verified

## Resend Verification Email

### Endpoint

```
POST /auth/verify-email/resend
```

### Authentication

```
Public
```

### Request

```
{
  "email":"john@example.com"
}
```

### Purpose

Requests a new email verification message for an account that has not been verified.

### Security

The endpoint is rate-limited to reduce abuse.

## Login

### Endpoint

```
POST /auth/login
```

### Authentication

```
Public
```

### Request

```
{
  "email":"john@example.com",
  "password":"securepassword"
}
```

### Success

The server creates a session and sets the session cookie.

```
Set-Cookie: session=<session_token>
```

Response:

```
{
  "success":true,
  "message":"Login successful.",
  "data": {
    "user": {
      "id":"user-id",
      "fullName":"John Doe",
      "email":"john@example.com",
      "role":"CUSTOMER"
    }
  }
}
```

### Possible Errors

```
401 Unauthorized
403 Forbidden
422 Unprocessable Entity
```

Examples:

```
{
  "success":false,
  "message":"Invalid email or password.",
  "errors": []
}
```

```
{
  "success":false,
  "message":"Please verify your email before logging in.",
  "errors": []
}
```

# Get Current User

## Endpoint

```
GET /auth/me
```

### Authentication

```
Session Cookie
```

### Purpose

Returns the currently authenticated user.

### Success Response

```
{
  "success":true,
  "message":"Authenticated user.",
  "data": {
    "user": {
      "id":"user-id",
      "fullName":"John Doe",
      "email":"john@example.com",
      "role":"CUSTOMER"
    }
  }
}
```

### Unauthorized Response

```
{
  "success":false,
  "message":"Authentication required.",
  "errors": []
}
```

# Refresh Session

## Endpoint

```
POST /auth/refresh
```

### Authentication

```
Session Cookie
```

### Purpose

Rotates an active authentication session without requiring the user to log in again.

### Request

No request body is required.

The client sends the current session cookie.

### Success

The server replaces the authentication cookie.

```
Set-Cookie: session=<new_session_token>
```

Response:

```
{
  "success":true,
  "message":"Session refreshed successfully.",
  "data":null
}
```

### Possible Errors

```
401 Unauthorized
```

Examples:

- Session not found
- Session expired
- Session revoked
- Invalid session credential
- User no longer exists

# Logout

## Endpoint

```
POST /auth/logout
```

### Authentication

```
Session Cookie
```

### Purpose

Revokes the current authentication session and clears the authentication cookie.

### Success

```
{
  "success":true,
  "message":"Logout successful.",
  "data":null
}
```

The response also clears the session cookie.

# Forgot Password

## Endpoint

```
POST /auth/forgot-password
```

### Authentication

```
Public
```

### Request

```
{
  "email":"john@example.com"
}
```

### Purpose

Requests a password reset email.

### Security Behavior

The API should not expose whether a specific email address exists.

### Success Response

```
{
  "success":true,
  "message":"If the account exists, a password reset email has been sent.",
  "data":null
}
```

### Rate Limiting

This endpoint is rate-limited.

# Reset Password

## Endpoint

```
POST /auth/reset-password
```

### Authentication

```
Public + Password Reset Token
```

### Request

```
{
  "token":"password-reset-token",
  "newPassword":"new-secure-password",
  "confirmPassword":"new-secure-password"
}
```

### Purpose

Allows a user to set a new password using a valid password reset token.

### Success Response

```
{
  "success":true,
  "message":"Password reset successfully.",
  "data":null
}
```

### Possible Errors

```
400 Bad Request
422 Unprocessable Entity
```

Examples:

- Invalid token
- Expired token
- Used token
- Password confirmation mismatch

Password reset tokens must not be reusable after successful consumption.

# Change Password

## Endpoint

```
POST /auth/change-password
```

### Authentication

```
Session Cookie
```

### Purpose

Allows an authenticated customer to change their current password.

### Request

```
{
  "currentPassword":"current-password",
  "newPassword":"new-password",
  "confirmPassword":"new-password"
}
```

### Success Response

```
{
  "success":true,
  "message":"Password changed successfully.",
  "data":null
}
```

### Possible Errors

```
401 Unauthorized
422 Unprocessable Entity
```

Example:

```
{
  "success":false,
  "message":"Current password is incorrect.",
  "errors": []
}
```

The password must be stored using the configured secure password hashing mechanism.

# Customer API

> **Status: Planned**
> 

The Customer API will support:

```
Customer Profile
Address Book
Wishlist
Order History
Notification Center
```

Endpoints will be documented when the corresponding module is implemented.

# Product API

> **Status: Planned**
> 

The Product API will support:

Product List
Product Detail
Product Categories
Product Search
Product Filter
Product Sorting
Product Gallery
Product Reviews
Product Rating
Related Products
Best Seller
New Arrival
Brand Management
Supplier Management

The catalog API must remain brand-agnostic.

Example:

```
GET /products
GET /products/:id
GET /products?brand=...
GET /products?supplier=...
GET /products?category=...
```

Exact endpoint contracts will be documented when the Product module is implemented.

# Shopping Cart API

> **Status: Planned**
> 

Planned capabilities:

```
Add to Cart
Update Quantity
Remove Item
Select Item
Shipping Estimation
Apply Voucher
```

# Checkout API

> **Status: Planned**
> 

Planned capabilities:

```
Shipping Address
Courier Selection
Shipping Service
Payment Method
Order Summary
Place Order
```

# Payment API

> **Status: Planned**
> 

Planned capabilities:

```
QRIS Payment
Virtual Account Payment
Payment Callback
Payment Status
Invoice
```

The Payment API will integrate with the configured payment gateway.

# Order API

> **Status: Planned**
> 

Planned capabilities:

```
Order History
Order Detail
Order Tracking
Cancel Order
Confirm Received
```

# Inventory API

> **Status: Planned**
> 

Planned capabilities:

```
Stock Management
Stock Adjustment
Low Stock Alert
Stock History
```

# Promotion API

> **Status: Planned**
> 

Planned capabilities:

```
Banner Management
Voucher Management
Product Discount
Flash Sale
```

# Notification API

> **Status: Planned**
> 

Planned capabilities:

```
Email Notification
Order Notification
Payment Notification
WhatsApp Notification
```

# Reporting API

> **Status: Planned**
> 

Planned capabilities:

```
Sales Report
Revenue Report
Product Report
Customer Report
```

# Administration API

> **Status: Planned**
> 

Planned capabilities:

```
Admin Dashboard
User Management
Activity Log
System Settings
```

Role and permission capabilities are associated with the Authentication/Authorization domain:

```
AUTH-008 — Role Management
AUTH-009 — Permission Management
```

# Security Standards

## Authentication

- Session-based authentication is used for protected endpoints.
- Session credentials are provided through cookies.
- Expired sessions must be rejected.
- Revoked sessions must be rejected.
- Invalid session credentials must be rejected.

## Password Security

- Passwords must never be stored in plain text.
- Password hashing uses a secure password hashing mechanism.
- Passwords must never be included in API responses.
- Password reset tokens must not be reusable.

## Token Security

Verification and password reset tokens must use cryptographically secure random values.

Sensitive token values must not be stored as plain text where the security architecture requires hashing.

## Cookie Security

Authentication cookies should use:

```
HttpOnly
Secure (production)
SameSite
Path
```

according to the environment and deployment requirements.

## Rate Limiting

Rate limiting must be applied to sensitive endpoints, including:

```
/auth/register
/auth/login
/auth/verify-email/resend
/auth/forgot-password
/auth/reset-password
```

Additional endpoints may be rate-limited when required.

# Validation Standards

Input validation must be performed on the backend.

Examples include:

### Email

- Required
- Valid email format

### Password

- Required
- Minimum length according to authentication requirements

### Password Confirmation

- Must match the relevant password field

### Session

- Must exist for protected endpoints
- Must be valid
- Must not be expired
- Must not be revoked

Detailed validation rules are defined in the corresponding Functional Requirements.

# Error Handling

The API uses a consistent error structure.

```
{
  "success":false,
  "message":"Operation failed.",
  "errors": []
}
```

## Error Principles

- Errors must not expose secrets.
- Internal implementation details must not be returned to clients.
- Authentication failures should return `401`.
- Authorization failures should return `403`.
- Validation failures should return `422` where appropriate.
- Conflicts should return `409` where appropriate.
- Unexpected server failures should return `500`.

# API Development Workflow

The API development process follows:

![image.png](API%20Documentation/image%201.png)

# API Design Principles

Ruma APIs should follow these principles:

### Consistency

Endpoints should use predictable naming and response structures.

### Resource-Oriented Design

Where appropriate, endpoints should represent resources rather than implementation details.

### Stateless HTTP Requests

Each request should contain the information required by the API, while authentication state is maintained through the server-managed session.

### Separation of Concerns

Business logic should remain in application services rather than being embedded directly in controllers.

### External Service Isolation

Third-party services should be accessed through dedicated application services or adapters.

# API Documentation Status

| Module | Status |
| --- | --- |
| **Authentication** | ✅ Implemented |
| **Customer** | 🟡 Planned |
| **Product** | 🟡 Planned |
| **Shopping** | 🟡 Planned |
| **Checkout** | 🟡 Planned |
| **Payment** | 🟡 Planned |
| **Order** | 🟡 Planned |
| **Inventory** | 🟡 Planned |
| **Promotion** | 🟡 Planned |
| **Notification** | 🟡 Planned |
| **Reporting** | 🟡 Planned |
| **Administration** | 🟡 Planned |

# Related Documents

### Product & Business

- [Vision](Vision%203b273f8cd4998078b747dd9f26f4a904.md)
- [Product Requirement (PRD)](Product%20Requirement%20(PRD)%203b273f8cd49980aaa876eeb7623fa9fb.md)
- [Master Feature List](Product%20Requirement%20(PRD)/Master%20Feature%20List%203b273f8cd49980e78d8eeb2b2d9b6a8f.md)
- [Roadmap](Roadmap%203b273f8cd49980c393d3d8e24631d3bd.md)

### Engineering

- [Software Requirement (SRS)](Software%20Requirement%20(SRS)%203b273f8cd49980bbb8e5f324d0b5dfb1.md)
- [Architecture Design](Architecture%20Design%203b373f8cd499801ab4b3e2c029c24da5.md)
- [Database Design](Database%20Design%203b273f8cd4998059a23cc419ab31ad27.md)
- [API Documentation](API%20Documentation%203b273f8cd49980d1b823e2a12377fe32.md)
- [Tech Stack](Tech%20Stack%203b273f8cd499806baf4cd1b9bf770e3d.md)
- [Development Guide](Development%20Guide%203b373f8cd49980afbcdbedacc9fc5607.md)

### Design

- [UI Inspiration](UI%20Inspiration%203b273f8cd4998074b97fff76c5618742.md)
- [Sitemap](Product%20Requirement%20(PRD)%203b273f8cd49980aaa876eeb7623fa9fb.md)
- [User Journey](Product%20Requirement%20(PRD)%203b273f8cd49980aaa876eeb7623fa9fb.md)