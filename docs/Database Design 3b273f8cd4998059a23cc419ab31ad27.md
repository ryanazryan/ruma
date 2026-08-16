# Database Design

# Project Information

| Item | Value |
| --- | --- |
| Project | Moorlife Marketplace |
| Document Type | Database Design |
| Version | 1.0 |
| Status | Draft |
| Author | Naufal Faiq Azryan |

# Purpose

Dokumen Database Design mendefinisikan struktur basis data Moorlife Marketplace sebagai acuan implementasi, pengelolaan data, dan pengembangan sistem. Dokumen ini mencakup konvensi penamaan, standar tipe data, relasi antar entitas, spesifikasi tabel, strategi indeks, serta batasan integritas data.

# Database Conventions

| Item | Standard |
| --- | --- |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Primary Key | UUID |
| Timezone | Asia/Makassar |
| Soft Delete | deleted_at |
| Timestamp | created_at, updated_at |
| Naming | snake_case |
| Charset | UTF-8 |

# Naming Conventions

| Object | Convention |
| --- | --- |
| Table | snake_case plural |
| Column | snake_case |
| Foreign Key | table_id |
| Enum | PascalCase |
| Index | idx_table_column |

# Data Types Standard

| Type | PostgreSQL |
| --- | --- |
| ID | UUID |
| Email | VARCHAR(255) |
| Password | TEXT |
| Token | TEXT |
| Boolean | BOOLEAN |
| Date | TIMESTAMPTZ |

# Entity Relationship Diagram (ERD) Current Module

![current-erd.svg](Database%20Design/current-erd.svg)

## ERD Scope

ERD yang ditampilkan saat ini hanya mencakup **Modul Authentication**, yang terdiri dari:

- Users
- Verification Tokens

Entitas lain seperti **Products, Categories, Shopping Cart, Orders, Payments, Inventory, Promotions, Notifications,** dan **Reporting** akan ditambahkan secara bertahap seiring dengan proses analisis kebutuhan, perancangan database, dan pengembangan pada masing-masing modul.

Setelah seluruh modul inti Moorlife Marketplace selesai dirancang, seluruh entitas akan digabungkan ke dalam **Master Entity Relationship Diagram (Master ERD)** sebagai representasi lengkap struktur basis data sistem.

# Table Specifications

[users](Database%20Design/users%203b373f8cd4998071a069f27992fc9f65.md)

[verification_tokens](Database%20Design/verification_tokens%203b373f8cd49980a29589d0116bfe0343.md)

# Index Strategy

## Purpose

Bagian ini mendefinisikan strategi penggunaan indeks pada basis data Moorlife Marketplace untuk meningkatkan performa proses pencarian, penyaringan, pengurutan, dan relasi antar tabel. Seluruh indeks dirancang untuk mengoptimalkan operasi yang sering dilakukan tanpa memberikan beban penulisan data yang berlebihan.

## Indexing Principles

- Primary Key wajib memiliki indeks bawaan.
- Seluruh Foreign Key harus memiliki indeks.
- Kolom yang sering digunakan untuk pencarian (`WHERE`) harus memiliki indeks.
- Kolom yang digunakan untuk `JOIN` harus memiliki indeks.
- Kolom yang memiliki nilai unik menggunakan **Unique Index**.
- Hindari membuat indeks pada kolom yang jarang digunakan untuk query.
- Evaluasi penggunaan indeks dilakukan secara berkala berdasarkan performa query di lingkungan produksi.

## Index Types

| Index Type | Purpose |
| --- | --- |
| Primary Key Index | Menjamin keunikan data dan mempercepat pencarian berdasarkan Primary Key. |
| Unique Index | Menjamin nilai kolom tetap unik, seperti email dan token. |
| Foreign Key Index | Mempercepat proses relasi antar tabel. |
| Composite Index | Digunakan pada kombinasi beberapa kolom yang sering diakses bersamaan. |
| Partial Index | Digunakan pada kondisi tertentu untuk mengurangi ukuran indeks dan meningkatkan efisiensi query. |

## Index Naming Convention

| Index Type | Convention | Example |
| --- | --- | --- |
| Primary Key | `{table}_pkey` | `users_pkey` |
| Unique Index | `{table}_{column}_key` | `users_email_key` |
| Standard Index | `idx_{table}_{column}` | `idx_users_role` |
| Composite Index | `idx_{table}_{column1}_{column2}` | `idx_orders_customer_status` |

## Current Indexes

| Table | Index |
| --- | --- |
| users | Primary Key (`id`) |
| users | Unique Index (`email`) |
| users | Index (`role`) |
| users | Index (`account_status`) |
| users | Index (`deleted_at`) |
| verification_tokens | Primary Key (`id`) |
| verification_tokens | Unique Index (`token_hash`) |
| verification_tokens | Index (`user_id`) |
| verification_tokens | Index (`type`) |
| verification_tokens | Index (`expires_at`) |

## Performance Considerations

- Indeks hanya dibuat pada kolom yang memiliki kebutuhan query yang jelas.
- Hindari indeks berlebihan karena dapat memperlambat operasi `INSERT`, `UPDATE`, dan `DELETE`.
- Query yang lambat harus dianalisis menggunakan **EXPLAIN ANALYZE** sebelum menambahkan indeks baru.
- Strategi indeks harus dievaluasi kembali setiap kali terdapat perubahan pola penggunaan sistem.

## Future Enhancements

- Menambahkan Composite Index pada tabel transaksi seperti `orders`, `payments`, dan `inventory` sesuai kebutuhan query.
- Menggunakan Partial Index untuk data aktif (`deleted_at IS NULL`) apabila volume data meningkat.
- Melakukan optimasi indeks berdasarkan hasil monitoring performa database di lingkungan produksi.
- Meninjau kembali strategi indeks secara berkala seiring bertambahnya jumlah pengguna dan data.

# Constraints

## Purpose

Bagian ini mendefinisikan standar penggunaan *database constraints* pada seluruh basis data Moorlife Marketplace untuk menjaga integritas, konsistensi, dan validitas data. Seluruh tabel yang dikembangkan pada sistem wajib mengikuti standar constraint yang telah ditetapkan dalam dokumen ini.

## Constraint Principles

Seluruh tabel dalam database Moorlife Marketplace harus menerapkan prinsip-prinsip berikut:

- Setiap tabel wajib memiliki Primary Key.
- Setiap relasi antar tabel wajib menggunakan Foreign Key.
- Seluruh data penting wajib menggunakan NOT NULL apabila nilai tersebut harus selalu tersedia.
- Kolom yang memerlukan keunikan wajib menggunakan Unique Constraint.
- Nilai yang memiliki pilihan terbatas wajib menggunakan Enum.
- Seluruh constraint harus diterapkan pada tingkat database, bukan hanya pada aplikasi.

## Constraint Types

| Constraint Type | Purpose |
| --- | --- |
| Primary Key | Menjamin setiap record memiliki identitas yang unik. |
| Foreign Key | Menjaga integritas relasi antar tabel. |
| Unique Constraint | Mencegah data duplikat pada kolom tertentu. |
| NOT NULL | Memastikan kolom wajib selalu memiliki nilai. |
| Enum Constraint | Membatasi nilai hanya pada pilihan yang telah ditentukan. |
| Default Value | Memberikan nilai awal secara otomatis ketika data dibuat. |

## Referential Integrity

Untuk menjaga konsistensi data, seluruh relasi antar tabel harus memenuhi aturan berikut:

- Setiap Foreign Key harus mengacu pada Primary Key tabel tujuan.
- Tidak diperbolehkan terdapat data yatim (*orphan record*) akibat relasi yang tidak valid.
- Seluruh relasi harus dikelola menggunakan Foreign Key Constraint.
- Perubahan struktur relasi harus dilakukan melalui migration agar konsistensi tetap terjaga.

## Delete Strategy

| Data Type | Strategy |
| --- | --- |
| Master Data | Soft Delete |
| Transaction Data | Tidak dihapus secara fisik |
| Verification Token | Hard Delete atau Scheduled Cleanup setelah tidak diperlukan |
| Log & Audit | Tidak dihapus kecuali sesuai kebijakan retensi data |

## Update Strategy

- Primary Key tidak boleh diubah setelah data dibuat.
- Foreign Key hanya dapat diubah apabila tetap menjaga integritas relasi.
- Kolom `updated_at` harus diperbarui secara otomatis setiap kali terjadi perubahan data.
- Kolom audit harus tetap mempertahankan riwayat perubahan yang diperlukan.

## Data Integrity Rules

- Email pengguna harus unik di seluruh sistem.
- Password hanya boleh disimpan dalam bentuk hash.
- Token verifikasi harus unik dan hanya dapat digunakan satu kali.
- Seluruh Foreign Key harus mengacu pada data yang masih valid.
- Data yang menggunakan Soft Delete tidak boleh ditampilkan pada proses bisnis normal.

## Validation Responsibility

| Layer | Responsibility |
| --- | --- |
| Frontend | Validasi format input pengguna. |
| Backend | Validasi aturan bisnis dan logika aplikasi. |
| Database | Validasi integritas data menggunakan constraint. |

## Future Enhancements

- Menambahkan Check Constraint untuk validasi nilai tertentu apabila diperlukan.
- Menambahkan kebijakan referential action (`ON DELETE` dan `ON UPDATE`) yang lebih spesifik sesuai kebutuhan tiap modul.
- Mengintegrasikan audit trail untuk melacak perubahan data penting.
- Melakukan evaluasi constraint secara berkala seiring berkembangnya struktur database.

# Migration Strategy

## Purpose

Bagian ini mendefinisikan strategi pengelolaan perubahan struktur basis data (database schema) pada Moorlife Marketplace. Seluruh perubahan terhadap tabel, relasi, indeks, maupun constraint harus dilakukan melalui mekanisme migration agar setiap perubahan dapat dilacak, diuji, dan diterapkan secara konsisten pada seluruh environment.

## Migration Principles

- Seluruh perubahan struktur database wajib menggunakan migration.
- Perubahan schema tidak diperbolehkan dilakukan langsung pada database produksi.
- Setiap migration harus memiliki riwayat perubahan (*version history*) yang jelas.
- Migration harus dapat dijalankan secara berurutan dan dapat direproduksi pada environment lain.
- Seluruh migration harus disimpan dalam sistem version control (Git).

## Migration Tool

| Item | Technology |
| --- | --- |
| ORM | Prisma ORM |
| Migration Tool | Prisma Migrate |
| Database | PostgreSQL |
| Version Control | Git |

## Migration Workflow

![migration-workflow.png](Database%20Design/migration-workflow.png)

## Migration Naming Convention

| Convention | Example |
| --- | --- |
| create_table | create_users |
| add_column | add_last_login_at_to_users |
| modify_column | modify_email_length |
| drop_column | drop_unused_column |
| create_index | create_users_email_index |
| add_foreign_key | add_order_customer_fk |

## Version Control Strategy

- Seluruh migration disimpan dalam repository Git.
- Migration tidak boleh diubah setelah diterapkan pada environment production.
- Setiap perubahan schema harus dibuat sebagai migration baru.
- Review terhadap migration dilakukan sebelum proses deployment.

## Deployment Strategy

- Migration dijalankan terlebih dahulu sebelum deployment aplikasi.
- Deployment hanya dilakukan apabila migration berhasil dieksekusi tanpa error.
- Backup database harus tersedia sebelum menjalankan migration pada environment production.
- Migration pada production harus dilakukan secara terjadwal untuk meminimalkan risiko gangguan layanan.

## Rollback Strategy

Apabila migration gagal atau menimbulkan masalah pada production, langkah-langkah berikut harus dilakukan:

1. Hentikan proses deployment.
2. Identifikasi penyebab kegagalan migration.
3. Pulihkan database menggunakan backup apabila diperlukan.
4. Buat migration baru untuk memperbaiki perubahan sebelumnya.
5. Lakukan pengujian kembali sebelum deployment ulang.

> **Catatan:** Prisma Migrate tidak mendukung rollback otomatis seperti beberapa migration tool lainnya. Oleh karena itu, setiap perubahan schema harus direncanakan dengan matang dan didukung oleh mekanisme backup database.
> 

## Best Practices

- Satu migration hanya berisi satu perubahan logis.
- Hindari menggabungkan banyak perubahan besar dalam satu migration.
- Selalu lakukan pengujian migration pada environment development sebelum diterapkan ke production.
- Jangan mengubah file migration yang sudah pernah dijalankan pada production.
- Seluruh perubahan schema harus berasal dari pembaruan `schema.prisma`.

## Future Enhancements

- Otomatisasi proses migration melalui CI/CD Pipeline.
- Validasi migration menggunakan automated testing sebelum deployment.
- Integrasi notifikasi deployment apabila migration berhasil atau gagal.
- Dokumentasi riwayat migration sebagai bagian dari release management.