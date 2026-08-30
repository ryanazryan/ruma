# Product Requirement (PRD)

# Ruma — Product Requirements Document

## Project Information

| Item | Value |
| --- | --- |
| **Project** | Ruma |
| **Document Type** | Product Requirements Document |
| **Version** | 1.0 |
| **Status** | Draft |
| **Author** | Naufal Faiq Azryan |
| **Role** | Full Stack Software Engineer |
| **Repository** | - |
| **Start Date** | 04 August 2026 |
| **Last Updated** | 27 August 2026 |

# Purpose

This Product Requirements Document defines the product requirements, core capabilities, target users, product scope, user experience, and release strategy for **Ruma**.

The PRD serves as the primary product-level reference for planning, design, development, testing, and future evolution of the platform.

Ruma is designed as a **scalable multi-brand lifestyle marketplace**. The product must support the current catalog while providing a flexible foundation for future brands, suppliers, categories, and products.

Detailed functional behavior is documented separately in the **Software Requirements Specification (SRS)** and Functional Requirements.

# Product Overview

**Ruma** is a multi-brand lifestyle marketplace designed to provide customers with a convenient and centralized way to discover, purchase, and manage products from diverse brands, suppliers, and categories.

The platform initially focuses on household, kitchen, lifestyle, and selected local products. Initial examples may include products from:

- Moorlife
- Cleo
- Tupperware
- Tas Purun
- Other household and lifestyle brands

Ruma is not structurally limited to these products or brands. The product catalog is designed to support future expansion without requiring fundamental changes to the marketplace architecture.

Ruma also provides administrative and operational capabilities for managing products, inventory, orders, payments, promotions, users, and business reporting.

# Product Vision

> **To become a trusted and scalable lifestyle marketplace that connects customers with diverse products, brands, and suppliers through a convenient, transparent, and integrated digital shopping experience.**
> 

Ruma is intended to evolve from a core commerce platform into a broader lifestyle commerce ecosystem.

# Product Goals

## Business Goals

- Establish a centralized digital commerce platform.
- Reduce reliance on manual ordering through personal chat or messaging platforms.
- Centralize product, inventory, order, payment, and customer information.
- Improve operational efficiency for marketplace administrators and operational teams.
- Provide a professional and convenient shopping experience.
- Support multiple brands and suppliers through a common marketplace structure.
- Provide a scalable foundation for future product and business expansion.

## Customer Goals

Customers should be able to:

- Discover products easily.
- Search and filter products efficiently.
- Access complete product information.
- Manage their account and shipping addresses.
- Add products to a shopping cart.
- Complete checkout conveniently.
- Pay using supported online payment methods.
- Track their orders.
- View their transaction history.
- Review and rate products where supported.
- Manage their wishlist.
- Receive relevant account, payment, and order notifications.

## Operational Goals

Authorized users should be able to:

- Manage products and product information.
- Manage brands and suppliers.
- Manage inventory.
- Process customer orders.
- Monitor payments.
- Manage promotional campaigns.
- Monitor marketplace activity.
- Access operational and business reports.
- Manage users and system settings.

## Technical Goals

Ruma should provide:

- Responsive web experience for desktop and mobile browsers.
- Secure authentication and session management.
- Maintainable and modular architecture.
- Scalable product and catalog structure.
- Secure handling of customer data.
- Fast product discovery and search.
- Integration capabilities for third-party payment and shipping services.
- Extensibility for future marketplace capabilities.

# Product Principles

## Multi-Brand by Design

Ruma must not be structurally dependent on a single brand.

Products from Moorlife, Cleo, Tupperware, Tas Purun, or future brands must use the same product architecture.

## Scalable Catalog

The marketplace must support the addition of:

- New brands
- New suppliers
- New categories
- New products

without requiring fundamental changes to the core marketplace architecture.

## Customer-Centric Experience

Product discovery, checkout, payment, and order tracking should remain simple and intuitive.

## Operational Efficiency

The platform should centralize repetitive operational activities and reduce unnecessary manual work.

## Extensibility

The system should provide a foundation for future features such as mobile applications, member management, referral programs, rewards, and AI-powered services.

# **Target Users & User Roles**

| Role | Primary Responsibility |
| --- | --- |
| **Customer** | Browse products, manage account, purchase products, and manage orders. |
| **Administrator** | Manage users, products, brands, suppliers, inventory, orders, promotions, and system configuration. |
| **Warehouse / Fulfillment** | Support inventory, packing, and fulfillment operations. |
| **Finance** | Monitor and process payment-related operations and financial reporting. |
| **Owner / Business Management** | Monitor business performance and operational metrics. |
| **Supplier / Brand Partner** | Provide products or product information to the marketplace through the marketplace's operational processes. |

# User Journey

The following user journeys define the high-level experience for major user roles.

[Customer Flow](Product%20Requirement%20(PRD)/Customer%20Flow%203b273f8cd49980d98fa2d6a0b884bac0.md)

[Warehouse Flow](Product%20Requirement%20(PRD)/Warehouse%20Flow%203b273f8cd49980cbbce2e9cc683ab6cb.md)

[Finance Flow](Product%20Requirement%20(PRD)/Finance%20Flow%203b273f8cd49980739163f6e4f0df1537.md)

[Owner / Management Flow](Product%20Requirement%20(PRD)/Owner%20Management%20Flow%203b273f8cd4998047bc1fc2c9088a1bf5.md)

**Documentation note:** the existing `Distributor Flow` should be reviewed and renamed or reframed if the final Ruma operating model does not use “Distributor” as a core role. The PRD itself uses the more general concept of Administration, Operations, and Supplier/Brand Partner.

# Product Structure

Ruma is organized into the following core product modules:

Ruma
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

The **Master Feature List** defines the individual capabilities contained within these modules.

# Product Modules

## AUTH — Authentication

### Purpose

Provide secure user authentication, session management, and password management.

### Core Capabilities

- User Registration
- Email Verification
- User Login
- Session Authentication
- User Logout
- Password Recovery
- Password Reset
- Session Refresh
- Change Password
- Role Management
- Permission Management

### MVP Status

**Implemented:** core authentication and password-management capabilities.

### Future

Role and permission management remain planned for a later release.

## CUST — Customer

### Purpose

Provide account-level capabilities for customers.

### Core Capabilities

- Customer Profile
- Address Book
- Wishlist
- Order History
- Notification Center

### MVP

- Customer Profile
- Address Book
- Wishlist
- Order History
- Notification Center

## PROD — Product Catalog

### Purpose

Provide product discovery and catalog management capabilities for a scalable multi-brand catalog.

### Customer Capabilities

- Product List
- Product Detail
- Product Categories
- Product Search
- Product Filter
- Product Sorting
- Product Gallery
- Product Reviews
- Product Rating
- Related Products
- Best Seller
- New Arrival

### Catalog Management Capabilities

- Brand Management
- Supplier Management

### Product Model Principle

Products should be associated with reusable marketplace entities such as:

![image.png](Product%20Requirement%20(PRD)/image.png)

## SHOP — Shopping

### Purpose

Manage the customer's shopping cart and product selection process.

### Core Capabilities

- Add to Cart
- Update Quantity
- Remove Item
- Select Item
- Shipping Estimation
- Apply Voucher

## CHKOUT — Checkout

### Purpose

Guide customers through the process of completing an order.

### Core Capabilities

- Shipping Address
- Courier Selection
- Shipping Service
- Payment Method
- Order Summary
- Place Order

### Checkout Flow

```
Shopping Cart
    ↓
Shipping Address
    ↓
Courier Selection
    ↓
Shipping Service
    ↓
Payment Method
    ↓
Order Summary
    ↓
Place Order
```

## PAY — Payment

### Purpose

Handle payment processing and payment status management.

### Core Capabilities

- QRIS Payment
- Virtual Account Payment
- Payment Callback
- Payment Status
- Invoice

### Future Capability

- Manual Bank Transfer

## ORDER — Order Management

### Purpose

Manage the lifecycle of customer orders from creation to completion.

### Core Capabilities

- Order History
- Order Detail
- Order Tracking
- Cancel Order
- Confirm Received

### Order Lifecycle

```
Order Created
     ↓
Payment
     ↓
Processing
     ↓
Shipped
     ↓
Delivered
     ↓
Confirmed Received
     ↓
Completed
```

## INV — Inventory

### Purpose

Manage product stock and inventory visibility.

### Core Capabilities

- Stock Management
- Stock Adjustment
- Low Stock Alert
- Stock History

Inventory management must work consistently across all supported brands, suppliers, and product categories.

## PROMO — Promotion

### Purpose

Manage promotional content and promotional campaigns.

### Core Capabilities

- Banner Management
- Voucher Management
- Product Discount
- Flash Sale

Promotional capabilities should be independent from individual brands and reusable across eligible products.

## NOTIF — Notification

### Purpose

Provide customers and authorized users with relevant transactional and account notifications.

### Core Capabilities

- Email Notification
- Order Notification
- Payment Notification
- WhatsApp Notification

### Release Strategy

- Email Notification — MVP
- Order Notification — MVP
- Payment Notification — MVP
- WhatsApp Notification — v1.1

## REPORT — Reporting

### Purpose

Provide business and operational reporting.

### Core Capabilities

- Sales Report
- Revenue Report
- Product Report
- Customer Report

Reporting should provide operational visibility without requiring the full capabilities of a business intelligence platform.

## ADMIN — Administration

### Purpose

Provide centralized administrative and operational control for the marketplace.

### Core Capabilities

- Admin Dashboard
- User Management
- Activity Log
- System Settings

### Authorization

Administrative capabilities are restricted through the authentication and authorization system.

Role and permission definitions are managed through:

```
AUTH-008 — Role Management
AUTH-009 — Permission Management
```

# MVP Scope

Ruma v1.0 MVP focuses on the **core end-to-end commerce experience**.

## Included in MVP

### Authentication

- Registration
- Email Verification
- Login
- Credential Validation
- Session Authentication
- Maintain Authentication
- Establish Session
- Logout
- Destroy Session
- Forgot Password
- Password Reset
- Session Refresh
- Change Password

### Customer

- Customer Profile
- Address Book
- Wishlist
- Order History
- Notification Center

### Product

- Product List
- Product Detail
- Product Categories
- Product Search
- Product Filter
- Product Sorting
- Product Gallery
- Product Reviews
- Product Rating
- Related Products
- Brand Management
- Supplier Management

### Shopping

- Add to Cart
- Update Quantity
- Remove Item
- Select Item
- Shipping Estimation

### Checkout

- Shipping Address
- Courier Selection
- Shipping Service
- Payment Method
- Order Summary
- Place Order

### Payment

- QRIS
- Virtual Account
- Payment Callback
- Payment Status
- Invoice

### Order

- Order History
- Order Detail
- Order Tracking
- Cancel Order
- Confirm Received

### Inventory

- Stock Management
- Stock Adjustment
- Low Stock Alert
- Stock History

### Promotion

- Banner Management

### Notification

- Email Notification
- Order Notification
- Payment Notification

### Reporting

- Sales Report
- Revenue Report

### Administration

- Admin Dashboard
- User Management
- Activity Log
- System Settings

# Post-MVP Releases

## v1.1 — Customer & Commerce Enhancement

Planned capabilities include:

- Best Seller
- New Arrival
- Voucher Management
- Product Discount
- Manual Bank Transfer
- Product Report
- Customer Report
- WhatsApp Notification

The objective of v1.1 is to strengthen customer engagement and operational capabilities after the core marketplace is established.

# v1.2 — Operational Optimization

Planned improvements include:

- Advanced inventory workflows
- Enhanced reporting
- Expanded promotional capabilities
- Operational improvements
- Performance and usability improvements

# v2.0 — Advanced Marketplace Capabilities

Planned capabilities include:

- Role Management
- Permission Management
- Flash Sale
- Advanced administrative workflows
- Additional marketplace management capabilities
- Broader support for business operations

# Future Direction

Beyond v2.0, Ruma may expand into a broader commerce ecosystem.

Potential capabilities include:

- Member Management
- Referral Program
- Reward Program
- Loyalty features
- Business event support
- Mobile applications
- AI-powered shopping assistance
- AI product recommendation
- Advanced analytics

These features are not part of the current MVP.

# Search & Discovery Requirements

The product discovery experience should allow customers to find relevant products quickly.

Customers should be able to:

- Browse products.
- Search by product name or relevant keywords.
- Filter by category.
- Filter by brand.
- Filter by supplier where applicable.
- Filter by price.
- Sort products.
- View product details.
- Discover related products.

The search and filtering structure must remain compatible with future catalog expansion.

# Multi-Brand & Supplier Model

Ruma is intentionally designed to separate the **platform**, **brand**, **supplier**, and **product** concepts.

[Multi-Brand Supplier Diagram](Product%20Requirement%20(PRD)/Multi-Brand%20Supplier%20Diagram%203ca73f8cd499800d92f3cd88fb8500b4.md)

A new product source should be introduced through data and administration workflows rather than through code changes to the core marketplace architecture.

For example:

```
New Japanese Supplier
        ↓
New Brand (if applicable)
        ↓
New Category (if applicable)
        ↓
New Product
        ↓
Existing Ruma Commerce Flow
```

The same:

```
Cart
Checkout
Payment
Order
Inventory
Notification
Reporting
```

must work regardless of the product's brand or source.

# Flow

[Core Customer Flow](Product%20Requirement%20(PRD)/Core%20Customer%20Flow%203c973f8cd49980c5b18ad8917a74098c.md)

[Administration Flow](Product%20Requirement%20(PRD)/Administration%20Flow%203ca73f8cd49980dab2dfcdb0ffe7f22b.md)

[Order Lifecycle](Product%20Requirement%20(PRD)/Order%20Lifecycle%203ca73f8cd499808ea3bdd30fa8ed5fa2.md)

# Sitemap

Ruma will use multiple functional areas based on user responsibilities.

### High-Level Sitemap

The high-level sitemap should reflect the finalized product modules and role-based access structure.

### Detailed Sitemap

The detailed sitemap is organized by functional area:

[Public Website](Product%20Requirement%20(PRD)/Public%20Website%203ca73f8cd4998061a0f6c1d02c36dd2b.md)

[Customer Portal](Product%20Requirement%20(PRD)/Customer%20Portal%203ca73f8cd4998048a90cda8d7808dd24.md)

[Admin Portal](Product%20Requirement%20(PRD)/Admin%20Portal%203ca73f8cd499802488cce50f71126bda.md)

[Warehouse Portal](Product%20Requirement%20(PRD)/Warehouse%20Portal%203ca73f8cd4998069b939f60d6731f9f1.md)

[Finance Portal](Product%20Requirement%20(PRD)/Finance%20Portal%203ca73f8cd4998047bc51d02f5e5c8159.md)

[Owner / Management Portal](Product%20Requirement%20(PRD)/Owner%20Management%20Portal%203ca73f8cd49980369b64d8d1003244a8.md)

[Future Supplier/ Brand Partner Portal](Product%20Requirement%20(PRD)/Future%20Supplier%20Brand%20Partner%20Portal%203ca73f8cd49980e5830acb9b78f71583.md)

# Non-Functional Product Expectations

At the product level, Ruma should provide:

### Security

- Secure authentication.
- Secure password handling.
- Secure session management.
- Protection of customer data.
- Role-based access control.

### Performance

- Responsive product browsing.
- Efficient product search and filtering.
- Reasonable response times for core commerce actions.

### Usability

- Clear navigation.
- Consistent interaction patterns.
- Responsive layouts.
- Clear feedback for success, error, loading, and empty states.

### Maintainability

- Modular architecture.
- Clear separation between domains.
- Reusable product and commerce structures.
- Extensible catalog model.

# Out of Scope

The following capabilities are outside the scope of Ruma v1.0:

- Mobile application
- AI Assistant
- Live shopping
- Live streaming
- Video commerce
- Multi-vendor marketplace
- Multi-warehouse
- Affiliate system
- Member commission
- Event BOS
- Loyalty points
- Gamification
- Subscription
- Customer service chat
- Return and refund management
- ERP integration
- Accounting integration
- Multi-language
- Multi-currency
- Offline POS
- Business Intelligence

These capabilities may be considered for future releases based on business priorities.

# Product Roadmap

| Release | Goal | Key Deliverables | Status |
| --- | --- | --- | --- |
| **MVP / v1.0** | Core Multi-Brand Marketplace | Authentication, catalog, shopping, checkout, payment, orders, inventory, basic promotion, notifications, reporting, administration | In Development |
| **v1.1** | Customer & Commerce Enhancement | Best Seller, New Arrival, vouchers, product discounts, WhatsApp notification, additional reports, manual bank transfer | Planned |
| **v1.2** | Operational Optimization | Inventory improvements, reporting improvements, advanced promotion capabilities | Planned |
| **v2.0** | Advanced Marketplace | Role management, permission management, flash sale, advanced administration | Planned |
| **v3.0+** | Ecosystem Expansion | Mobile apps, member ecosystem, referral/rewards, AI capabilities | Future |

# Success Criteria

Ruma v1.0 will be considered successful when:

- Customers can create and manage accounts.
- Customers can securely authenticate.
- Customers can discover products from multiple brands.
- Customers can manage their shopping cart.
- Customers can complete checkout.
- Customers can complete supported payment flows.
- Customers can view and track orders.
- Customers can manage their addresses.
- Administrators can manage core catalog and operational data.
- Inventory can be monitored and adjusted.
- Core transactional notifications are delivered.
- Basic business reports are available.
- The product catalog can expand with new brands, suppliers, categories, and products without fundamental architectural changes.

# Master Feature List

The complete feature-level breakdown is maintained separately in the **Master Feature List**.

The Master Feature List is the source of truth for:

- Feature IDs
- Feature names
- Feature descriptions
- Priority
- Release assignment

The PRD provides the product-level context, while the Master Feature List provides the structured feature inventory.

[Master Feature List](Product%20Requirement%20(PRD)/Master%20Feature%20List%203b273f8cd49980e78d8eeb2b2d9b6a8f.csv)