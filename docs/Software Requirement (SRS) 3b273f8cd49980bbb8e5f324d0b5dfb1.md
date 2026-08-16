# Software Requirement (SRS)

# Project Information

| **Item** | **Value** |
| --- | --- |
| Project | Moorlife Marketplace |
| Document Type | Software Requirements Specification (SRS) |
| Version | 1.0 |
| Status | Draft |
| Author | Naufal Faiq Azryan |
| Role | Full Stack Software Engineer |
| Repository | - |
| Start Date | 05 August 2026 |
| Last Updated | 05 August 2026 |

# Purpose

Dokumen Software Requirements Specification (SRS) mendefinisikan kebutuhan perangkat lunak Moorlife Marketplace secara rinci sebagai acuan utama dalam proses desain, pengembangan, pengujian, dan implementasi sistem. Dokumen ini menjelaskan perilaku sistem, kebutuhan fungsional, kebutuhan non-fungsional, aturan bisnis, antarmuka eksternal, serta batasan teknis sehingga seluruh proses pengembangan memiliki spesifikasi yang konsisten dan dapat ditelusuri.

# Scope

Dokumen ini mencakup seluruh kebutuhan perangkat lunak untuk versi pertama Moorlife Marketplace, termasuk autentikasi pengguna, pengelolaan produk, pencarian produk, keranjang belanja, proses checkout, pembayaran, pengelolaan pesanan, inventaris, dashboard administrasi, pelaporan, serta integrasi dengan layanan pihak ketiga seperti payment gateway dan jasa ekspedisi.

# Definitions, Acronyms & Abbreviations

| **Term** | **Description** |
| --- | --- |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| SKU | Stock Keeping Unit |
| QRIS | Quick Response Code Indonesian Standard |
| VA | Virtual Account |
| UI | User Interface |
| UX | User Experience |
| MVP | Minimum Viable Product |
| ERP | Enterprise Resource Planning |
| REST | Representational State Transfer |
| RBAC | Role-Based Access Control |
| ORM | Object Relational Mapping |
| DTO | Data Transfer Object |
| UUID | Universally Unique Identifier |
| HTTPS | Hypertext Transfer Protocol Secure |

# Intended Audience

| **Audience** | **Purpose** |
| --- | --- |
| Software Engineer | Mengimplementasikan keseluruhan sistem sesuai spesifikasi. |
| Frontend Developer | Mengembangkan antarmuka pengguna berbasis web. |
| Backend Developer | Mengembangkan REST API, business logic, dan integrasi layanan eksternal. |
| UI/UX Designer | Mendesain antarmuka dan pengalaman pengguna. |
| QA Engineer | Menyusun test case dan melakukan pengujian sistem. |
| DevOps Engineer | Mengelola deployment, infrastruktur, dan CI/CD. |
| Product Owner | Memastikan implementasi sesuai kebutuhan bisnis. |

# System Overview

Moorlife Marketplace merupakan aplikasi e-commerce berbasis web yang memungkinkan pelanggan melakukan pembelian produk Moorlife secara online, sementara distributor dapat mengelola katalog produk, inventaris, pesanan, pembayaran, dan laporan penjualan melalui dashboard administrasi. Sistem dirancang menggunakan arsitektur modular agar mudah dikembangkan menjadi platform multi-distributor di masa depan.

# Overall System Architecture

| **Layer** | **Description** |
| --- | --- |
| Client Layer | Browser Desktop & Mobile |
| Presentation Layer | Next.js + React |
| Application Layer | NestJS REST API |
| Data Layer | PostgreSQL, Redis, Prisma ORM |
| External Services | Midtrans, Biteship, Cloudinary, Resend Email |

# System Context

System Context Diagram menggambarkan hubungan antara Moorlife Marketplace dengan aktor utama dan layanan eksternal yang berinteraksi dengan sistem. Diagram ini menunjukkan batas sistem (system boundary), pihak yang menggunakan sistem, serta integrasi dengan layanan pihak ketiga yang mendukung proses bisnis.

## System Context Diagram

![system-context-diagram.svg](Software%20Requirement%20(SRS)/system-context-diagram.svg)

## Overall System Architecture

![overall-system-architecture.svg](Software%20Requirement%20(SRS)/overall-system-architecture.svg)

# Functional Requirements

## Purpose

Functional Requirements mendefinisikan perilaku dan fungsi yang harus disediakan oleh Moorlife Marketplace agar memenuhi kebutuhan pengguna dan bisnis. Setiap requirement memiliki identitas unik (Requirement ID) dan terhubung dengan Feature ID pada Product Requirements Document (PRD), sehingga seluruh kebutuhan sistem dapat ditelusuri mulai dari analisis hingga implementasi.

## Requirement Classification

| **Type** | **Description** |
| --- | --- |
| Business Requirement | Kebutuhan yang berasal dari proses bisnis. |
| User Requirement | Kebutuhan yang berasal dari pengguna sistem. |
| System Requirement | Kebutuhan yang harus dipenuhi oleh sistem. |

## Requirement Priority

| **Priority** | **Description** |
| --- | --- |
| Must Have | Wajib tersedia pada versi saat ini. |
| Should Have | Sangat penting namun dapat ditunda. |
| Could Have | Fitur tambahan yang meningkatkan pengalaman |
| Won’t Have | Tidak akan dikembangkan pada versi saat ini. |

[Functional Requirements](Software%20Requirement%20(SRS)/Functional%20Requirements%203b373f8cd4998033a1d2ff28f94c8fa7.csv)