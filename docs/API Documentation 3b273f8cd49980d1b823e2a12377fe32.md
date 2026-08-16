# API Documentation

# Project Information

| Item | Value |
| --- | --- |
| Project | Moorlife Marketplace |
| Document Type | API Documentation |
| Version | 1.0 |
| API Style | REST API |
| Data Format | JSON |
| Authentication | JWT Access Token & Refresh Token |
| Status | Draft |

# Purpose

Dokumen API Documentation mendefinisikan spesifikasi seluruh endpoint REST API yang digunakan pada Moorlife Marketplace. Dokumen ini menjadi acuan bagi Frontend Developer, Backend Developer, QA Engineer, dan integrasi dengan layanan pihak ketiga. Seluruh endpoint didokumentasikan secara konsisten agar implementasi, pengujian, dan pemeliharaan sistem dapat dilakukan dengan mudah.

# API Standards

## Base URL

| Environment | URL |
| --- | --- |
| Development | `http://localhost:3000/api/v1` |
| Staging | `https://staging-api.moorlife.com/api/v1` |
| Production | `https://api.moorlife.com/api/v1` |

## HTTP Methods

| Method | Purpose |
| --- | --- |
| GET | Mengambil data. |
| POST | Membuat data baru atau menjalankan proses tertentu. |
| PUT | Memperbarui seluruh data. |
| PATCH | Memperbarui sebagian data. |
| DELETE | Menghapus data. |

## HTTP Status Codes

| Code | Description |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

## Request Format

- Seluruh request menggunakan format **JSON**.
- Header `Content-Type` wajib menggunakan `application/json`.
- Endpoint yang memerlukan autentikasi wajib menyertakan `Authorization: Bearer <access_token>`.

## Response Format

### Success Response

```
{
  "success":true,
  "message":"Operation completed successfully.",
  "data": {}
}
```

### Error Response

```
{
  "success":false,
  "message":"Validation failed.",
  "errors": []
}
```

## API Versioning

- Seluruh endpoint menggunakan versioning pada URL.
- Format versi menggunakan `/api/v1`.
- Perubahan yang tidak kompatibel (*breaking changes*) akan dirilis pada versi API berikutnya.

## Authentication

- JWT Access Token digunakan untuk autentikasi.
- Refresh Token digunakan untuk memperoleh Access Token baru.
- Password tidak pernah dikirim kembali melalui API.
- Seluruh komunikasi API wajib menggunakan HTTPS pada environment production.

# Authentication Module

> Modul ini berisi seluruh endpoint yang berkaitan dengan autentikasi dan manajemen akun pengguna.
> 

### Endpoint List

| API ID | Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- | --- |
| AUTH-API-001 | POST | `/auth/register` | Registrasi akun baru | Public |
| AUTH-API-002 | GET | `/auth/verify-email` | Verifikasi email pengguna | Public |
| AUTH-API-003 | POST | `/auth/verify-email/resend` | Kirim ulang email verifikasi | Public |
| AUTH-API-004 | POST | `/auth/login` | Login pengguna | Public |
| AUTH-API-005 | POST | `/auth/refresh-token` | Memperbarui Access Token | Refresh Token |
| AUTH-API-006 | POST | `/auth/logout` | Logout pengguna | Access Token |

# Customer Module

> **Belum diimplementasikan.**
> 

# Product Module

> **Belum diimplementasikan.**
> 

# Shopping Cart Module

> **Belum diimplementasikan.**
> 

# Checkout Module

> **Belum diimplementasikan.**
> 

# Payment Module

> **Belum diimplementasikan.**
> 

# Order Module

> **Belum diimplementasikan.**
> 

# Reporting Module

> **Belum diimplementasikan.**
> 

# Security Standards

- Seluruh endpoint yang memerlukan autentikasi wajib menggunakan JWT.
- Validasi input dilakukan pada Backend.
- Password disimpan menggunakan Argon2 Hash.
- Token verifikasi disimpan dalam bentuk hash.
- Seluruh komunikasi API menggunakan HTTPS pada environment production.
- Rate Limiting diterapkan untuk endpoint sensitif seperti Login, Register, dan Forgot Password.

# Error Handling

- Seluruh error menggunakan format response yang konsisten.
- Informasi error tidak boleh membocorkan data sensitif.
- Validation Error dikembalikan menggunakan HTTP 422.
- Authentication Error menggunakan HTTP 401.
- Authorization Error menggunakan HTTP 403.
- Seluruh error penting dicatat pada sistem logging.

# API Development Workflow

![api-development-workflow.png](API%20Documentation/api-development-workflow.png)