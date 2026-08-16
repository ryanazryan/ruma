# verification_tokens

# Overview

Tabel **verification_tokens** menyimpan token verifikasi yang digunakan untuk proses autentikasi berbasis token satu kali pakai (one-time token). Tabel ini mendukung berbagai kebutuhan verifikasi seperti verifikasi email, reset password, dan perubahan alamat email.

Setiap token dikaitkan dengan satu pengguna melalui relasi ke tabel **users**. Token disimpan dalam bentuk hash untuk meningkatkan keamanan serta memiliki masa berlaku (expiration time) dan status penggunaan.

# Column Specifications

| Column | Data Type | Nullable | Default Value | Constraints | Description |
| --- | --- | --- | --- | --- | --- |
| id | UUID | No | Generated UUID | Primary Key | Unique identifier untuk setiap token. |
| user_id | UUID | No | - | Foreign Key → users.id | Referensi ke pengguna yang memiliki token. |
| token_hash | TEXT | No | - | Unique | Token yang telah di-hash sebelum disimpan ke database. |
| type | verification_token_type | No | EMAIL_VERIFICATION | Enum | Jenis token verifikasi. |
| expires_at | TIMESTAMPTZ | No | - | - | Waktu kedaluwarsa token. |
| used_at | TIMESTAMPTZ | Yes | NULL | - | Waktu token pertama kali digunakan. |
| created_at | TIMESTAMPTZ | No | CURRENT_TIMESTAMP | - | Waktu token dibuat. |
| updated_at | TIMESTAMPTZ | No | CURRENT_TIMESTAMP | - | Waktu terakhir data diperbarui. |

# Indexes

| Index Name | Type | Columns | Purpose |
| --- | --- | --- | --- |
| verification_tokens_pkey | Primary Key | id | Identitas utama setiap token. |
| verification_tokens_token_hash_key | Unique | token_hash | Memastikan token tidak duplikat dan mempercepat proses validasi. |
| idx_verification_tokens_user_id | Index | user_id | Mempercepat pencarian token berdasarkan pengguna. |
| idx_verification_tokens_type | Index | type | Mempercepat pencarian berdasarkan jenis token. |
| idx_verification_tokens_expires_at | Index | expires_at | Mempercepat proses pembersihan token yang telah kedaluwarsa. |

# Constraints

| Constraint | Description |
| --- | --- |
| Primary Key | `id` harus unik untuk setiap token. |
| Foreign Key | `user_id` harus mengacu pada `users.id`. |
| Unique Constraint | `token_hash` harus unik. |
| NOT NULL | `user_id`, `token_hash`, `type`, `expires_at`, `created_at`, dan `updated_at` wajib memiliki nilai. |
| Enum Constraint | Nilai `type` hanya boleh berasal dari Enum `verification_token_type`. |

# Relationships

| Related Table | Relationship | Description |
| --- | --- | --- |
| users | Many-to-One | Banyak token dapat dimiliki oleh satu pengguna. |

# Business Rules

| Rule ID | Business Rule |
| --- | --- |
| BR-TOKEN-001 | Setiap token hanya dimiliki oleh satu pengguna. |
| BR-TOKEN-002 | Token harus disimpan dalam bentuk hash. |
| BR-TOKEN-003 | Token hanya dapat digunakan satu kali. |
| BR-TOKEN-004 | Token yang telah melewati `expires_at` dianggap tidak valid. |
| BR-TOKEN-005 | Setelah token digunakan, `used_at` harus diisi dan token tidak dapat digunakan kembali. |
| BR-TOKEN-006 | Token digunakan sesuai dengan jenis (`type`) yang ditentukan. |

# Security Considerations

- Token tidak boleh disimpan dalam bentuk plaintext.
- Token harus dibuat menggunakan Cryptographically Secure Random Number Generator (CSPRNG).
- Validasi token dilakukan dengan membandingkan nilai hash.
- Token yang telah digunakan tidak boleh dapat digunakan kembali.
- Token yang telah kedaluwarsa harus ditolak oleh sistem.
- Token kedaluwarsa sebaiknya dibersihkan secara berkala melalui scheduled job atau background worker.

# Future Enhancements

- Menambahkan dukungan untuk Magic Link Login.
- Menambahkan dukungan untuk Multi-Factor Authentication (MFA).
- Menambahkan verifikasi nomor telepon (Phone Verification).
- Menambahkan token untuk undangan pengguna (Invitation Token).
- Menambahkan audit log untuk seluruh aktivitas penggunaan token.
- Menambahkan mekanisme rotasi token otomatis untuk meningkatkan keamanan.