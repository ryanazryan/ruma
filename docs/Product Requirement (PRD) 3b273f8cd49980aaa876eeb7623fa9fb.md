# Product Requirement (PRD)

# Project Information

| Item | Value |
| --- | --- |
| Project | Moorlife Marketplace |
| Document Type | Product Requirements Document |
| Version | 1.0 |
| Status | Draft |
| Author | Naufal Faiq Azryan |
| Role | Full Stack Software Engineer |
| Repository | - |
| Start Date | 04 August 2026 |
| Last Updated | 04 August 2026 |

# Purpose

Dokumen ini bertujuan untuk mendefinisikan kebutuhan produk, fitur utama, ruang lingkup pengembangan, serta pengalaman pengguna pada Moorlife Marketplace. PRD menjadi acuan dalam proses desain, pengembangan, pengujian, dan implementasi sehingga seluruh fitur yang dibangun sesuai dengan kebutuhan bisnis distributor serta memberikan pengalaman terbaik bagi pelanggan.

# Product Overview

> Moorlife Marketplace adalah platform e-commerce berbasis web yang dirancang untuk membantu distributor Moorlife mengelola penjualan produk secara digital. Platform ini memungkinkan pelanggan mencari produk, melakukan pembelian, memilih metode pembayaran, serta memantau status pesanan melalui satu sistem yang terintegrasi.
> 

> Selain memberikan pengalaman berbelanja yang lebih nyaman bagi pelanggan, platform ini juga membantu distributor dalam mengelola katalog produk, stok, pesanan, pembayaran, promosi, serta laporan penjualan secara lebih efisien.
> 

> Versi pertama dikembangkan untuk mendukung operasional satu distributor. Namun arsitektur sistem dirancang agar dapat dikembangkan menjadi platform yang mendukung banyak distributor di masa depan.
> 

# Product Objectives

## Business Objectives

- Membantu distributor Moorlife melakukan penjualan produk secara online.
- Mengurangi proses pemesanan manual melalui WhatsApp atau media sosial.
- Mempermudah pengelolaan produk, pesanan, pembayaran, dan pengiriman dalam satu sistem.
- Memberikan pengalaman belanja yang lebih profesional kepada pelanggan.
- Membangun fondasi sistem yang dapat dikembangkan untuk melayani banyak distributor di masa depan.

## User Objectives

- Mencari produk dengan mudah
- Mendapatkan informasi produk yang lengkap
- Melakukan checkout secara tepat.
- Melakukan pembayaran secara aman.
- Melacak status pesanan secara real-time.
- Melihat riwayat pembelian

**Untuk Distributor** 

- Mengelola katalog produk.
- Mengelola stok.
- Mengelola pesanan.
- Memverifikasi pembayaran.
- Melihat laporan penjualan.

## **Technical Objectives**

- Responsive di desktop dan mobile.
- Mudah dikembangkan (scalable architecture).
- Aman dalam penyimpanan data pengguna.
- Performa cepat untuk pencarian produk.
- Mudah dipelihara (maintainable).
- Mendukung integrasi layanan pihak ketiga seperti payment gateway dan ekspedisi

# **Target Users & User Roles**

| Role | Description |  |
| --- | --- | --- |
| Customer | Membeli produk secara online |  |
| Distributor | Mengelola toko, produk, stok, pesanan dan promosi |  |
| Warehouse | Mengelola proses packing dan pengiriman |  |
| Finance | Memverifikasi pembayaran dan melihat laporan transaksi |  |
| Owner | Memantau performa bisnis dan laporan penjualan |  |

# User Journey

[Customer Flow](Product%20Requirement%20(PRD)/Customer%20Flow%203b273f8cd49980d98fa2d6a0b884bac0.md)

[Distributor Flow](Product%20Requirement%20(PRD)/Distributor%20Flow%203b273f8cd49980a2a24fede78c9461be.md)

[Warehouse Flow](Product%20Requirement%20(PRD)/Warehouse%20Flow%203b273f8cd49980cbbce2e9cc683ab6cb.md)

[Finance Flow](Product%20Requirement%20(PRD)/Finance%20Flow%203b273f8cd49980739163f6e4f0df1537.md)

[Owner Flow](Product%20Requirement%20(PRD)/Owner%20Flow%203b273f8cd4998047bc1fc2c9088a1bf5.md)

# Sitemap

## High Level Sitemap

![high-level-sitemap.png](Product%20Requirement%20(PRD)/high-level-sitemap.png)

## Detail Sitemap

[Public Website](Product%20Requirement%20(PRD)/Public%20Website%203b273f8cd499803c95c8efb38f300e2c.md)

[Customer Portal](Product%20Requirement%20(PRD)/Customer%20Portal%203b273f8cd49980728d58c5f68692cd21.md)

[Warehouse Portal](Product%20Requirement%20(PRD)/Warehouse%20Portal%203b273f8cd4998098b326c57689f8ada8.md)

[Finance Portal](Product%20Requirement%20(PRD)/Finance%20Portal%203b273f8cd499807f9779f3f86b501aae.md)

[Distributor Portal](Product%20Requirement%20(PRD)/Distributor%20Portal%203b273f8cd49980079ce5d4caa30fb83a.md)

[Owner Portal](Product%20Requirement%20(PRD)/Owner%20Portal%203b273f8cd49980c9ba8cff0ffc18bd69.md)

# Product Modules

## AUTH - Authentication Module

### **Purpose**

Mengelola autentikasi dan otorisasi pengguna.

### **Scope**

- Login
- Register
- Forgot Password
- Reset Password
- Logout
- Session Management
- Role Management
- Permission Management

## CUST - Customer Module

### Purpose

Mengelola data dan aktivitas pelanggan.

### Scope

- Customer Profile
- Address Book
- Wishlist
- Order History
- Notifications

## PROD - Product Catalog Module

### Purpose

Mengelola seluruh katalog produk.

### Scope

- Product List
- Product Detail
- Categories
- Search
- Filter
- Sorting
- Product Reviews
- Best Seller
- New Arrival

## SHOP -Shopping Module

### Purpose

Mengelola proses belanja pelanggan.

### Scope

- Shopping Cart
- Quantity Management
- Remove Item
- Voucher
- Shipping Cost Estimation

## CHKOUT - Checkout Module

### Purpose

Mengelola proses checkout hingga order dibuat.

### Scope

- Shipping Address
- Courier Selection
- Shipping Service
- Payment Method
- Order Summary

## PAY - Payment Module

### Purpose

Mengelola seluruh proses pembayaran.

### Scope

- QRIS
- Virtual Account
- Bank Transfer Payment Gateway Integration
- Payment Callback
- Payment Status
- Invoice

## ORDER - Order Management Module

### Purpose

Mengelola seluruh siklus hidup pesanan.

### Scope

- Order History
- Order Detail
- Order Status
- Cancel Order
- Tracking
- Confirm Received

## INV - Inventory Module

### Purpose

Mengelola stok barang.

### Scope

- Stock Management
- Stock Adjustment
- Low Stock Alert
- Stock History

## PROMO - Promotion Module

### Purpose

Mengelola promosi.

### Scope

- Banner
- Voucher
- Discount
- Flash Sale

## REPORT - Reporting Module

### Purpose

Menyediakan laporan bisnis.

### Scope

- Sales Report
- Revenue Report
- Customer Report
- Product Report

## NOTIF - Notification Module

### Purpose

Mengelola Notifikasi kepada pengguna

### Scope

- Email Notification
- WhatsApp Notification
- Order Notification
- Payment Notification

## ADMIN - Administration Module

### Purpose

Mengelola notifikasi kepada pengguna.

### Scope

- Email Notification
- WhatsApp Notification
- Order Notification
- Payment Notification

# Feature List

## Purpose

Bagian ini mendokumentasikan seluruh fitur yang akan dikembangkan pada Moorlife Marketplace. Setiap fitur dikelompokkan berdasarkan Product Module dan memiliki identitas unik (Feature ID) untuk memudahkan pelacakan selama proses analisis, pengembangan, pengujian, hingga pemeliharaan sistem.

## Feature Status

| **Status** | **Description** |
| --- | --- |
| Planned | Fitur telah direncanakan namun belum dikembangkan |
| In Progress | Fitur sedang dalam proses pengembangan |
| Completed | FItur sudah selesai dikembangkan dan siap digunakan |
| Deprecated | Fitur tidak lagi digunakan atau telah digantikan |

## Priority Level

| **Priority** | **Description** |
| --- | --- |
| High | Fitur wajib tersedia pada MVP |
| Medium | Fitur penting, namun dapat dikembangkan setelah MVP |
| Low | Fitur tambahan yang meningkatkan pengalaman pengguna |

## Release Version

| **Version** | **Description** |
| --- | --- |
| MVP | Fitur yang termasuk dalam rilis pertama aplikasi |
| v1.1 | Fitur tambahan setelah MVP |
| v2.0 | Fitur untuk pengembangan jangka panjang. |

## Master Feature List

[Master Feature List](Product%20Requirement%20(PRD)/Master%20Feature%20List%203b273f8cd49980e78d8eeb2b2d9b6a8f.csv)

# Product Roadmap

## Purpose

Product Roadmap mendefinisikan arah pengembangan Moorlife Marketplace secara bertahap berdasarkan prioritas bisnis, kebutuhan pengguna, dan kesiapan teknis. Roadmap ini menjadi panduan dalam merencanakan evolusi produk dari Marketplace MVP hingga menjadi platform digital yang mendukung banyak distributor Moorlife.

## Development Strategy

Moorlife Marketplace dikembangkan menggunakan pendekatan **Incremental & Iterative Development**, yaitu membangun sistem secara bertahap dimulai dari fitur inti (Minimum Viable Product/MVP), kemudian menambahkan fitur baru berdasarkan kebutuhan pengguna, evaluasi operasional, dan perkembangan bisnis.

## Product Roadmap Table

| **Version** | **Goal** | **Key Deliverables** | **Status** |
| --- | --- | --- | --- |
| MVP (v1.0) | Marketplace Foundation | Marketplace dasar untuk satu distributor dengan proses pembelian end-to-end | Planned |
| v1.1 | Customer Experience | Wishlist, Product Review, Voucher, Product Recommendation, WhatsApp Notification | Planned |
| v1.2 | Business Optimization | Advanced Promotion, Inventory Improvement, Reporting Enhancement | Planned |
| v2.0 | Multi Distributor Platform | Multi Distributor, Role Management, Distributor Dashboard | Planned |
| v2.1 | Business Growth | Loyalty Point, Referral Program, Affiliate System | Planned |
| v3.0 | Mobile Ecosystem | Android App, iOS App, Push Notification | Planned |
| v4.0 | Intelligent Platform | AI Assistant, AI Product Recommendation, Sales Analytics, Business Intelligence | Planned |