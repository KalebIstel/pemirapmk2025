# Dokumentasi Teknis - Sistem Pemilu Mahasiswa Online

## 📋 Ringkasan Sistem

Sistem Pemilihan Umum Mahasiswa Online adalah aplikasi full-stack dengan:
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** ReactPHP (event-driven, non-blocking I/O)
- **Database:** MySQL (via XAMPP)
- **Design:** Palet Coklat-Beige-Putih-Hitam

---

## 🎨 Design System

### Palet Warna
```css
/* Warna Utama */
--primary: hsl(25, 45%, 35%)        /* Coklat utama */
--secondary: hsl(40, 30%, 85%)      /* Beige */
--background: hsl(0, 0%, 100%)      /* Putih */
--foreground: hsl(0, 0%, 10%)       /* Hampir hitam */

/* Chart Colors */
--chart-1: hsl(25, 55%, 45%)        /* Kandidat 1 */
--chart-2: hsl(35, 50%, 60%)        /* Kandidat 2 */
```

### Penerapan
- **Header/Footer:** Background `primary` (coklat)
- **Card/Panel:** Background `card` (beige muda)
- **Tombol Utama:** `primary` variant
- **Background Halaman:** Putih bersih
- **Teks:** Hitam untuk kontras optimal

---

## 🗄️ Arsitektur Database

### Tabel Utama

#### 1. `admin`
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- password (hashed)
- created_at
```

#### 2. `kandidat`
```sql
- id (PRIMARY KEY)
- nama
- nomor_urut (UNIQUE)
- visi, misi
- foto_url
```

#### 3. `pemilih`
```sql
- id (PRIMARY KEY)
- nim (UNIQUE, INDEX)
- nama
- fakultas, program_studi
- token (UNIQUE, INDEX) -- Token sekali pakai
- sudah_memilih (BOOLEAN, INDEX)
- waktu_memilih
```

#### 4. `suara`
```sql
- id (PRIMARY KEY)
- pemilih_id (FOREIGN KEY -> pemilih.id)
- kandidat_id (FOREIGN KEY -> kandidat.id)
- waktu_vote
- UNIQUE(pemilih_id) -- Satu pemilih = satu suara
```

### Query Kritis untuk Statistik

```sql
-- Total suara per kandidat
SELECT kandidat_id, COUNT(*) as total_suara 
FROM suara 
GROUP BY kandidat_id;

-- Partisipasi pemilih
SELECT 
  SUM(CASE WHEN sudah_memilih = TRUE THEN 1 ELSE 0 END) as sudah_memilih,
  SUM(CASE WHEN sudah_memilih = FALSE THEN 1 ELSE 0 END) as belum_memilih
FROM pemilih;

-- Partisipasi per fakultas
SELECT 
  fakultas,
  SUM(CASE WHEN sudah_memilih = TRUE THEN 1 ELSE 0 END) as voted,
  SUM(CASE WHEN sudah_memilih = FALSE THEN 1 ELSE 0 END) as not_voted
FROM pemilih
GROUP BY fakultas;
```

---

## ⚡ Alur Asynchronous ReactPHP

### Mengapa ReactPHP?

ReactPHP menggunakan **event-driven architecture** dengan **non-blocking I/O** yang ideal untuk:

1. **Concurrent Connections**: Menangani ribuan pemilih bersamaan tanpa blocking
2. **Real-time Updates**: Dashboard admin ter-update otomatis saat ada vote baru
3. **Database Async**: Query MySQL menggunakan Promises, tidak freeze server

### Cara Kerja (Contoh: Login Pemilih)

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│   Frontend  │ POST    │   ReactPHP   │ Query   │  MySQL   │
│   (React)   │-------->│   Server     │-------->│ Database │
└─────────────┘         └──────────────┘         └──────────┘
                               │                       │
                               │<──────────────────────┘
                               │  Promise resolved
                               │  (voter data)
                               │
       JSON Response           │
       (success/error)         │
       <────────────────────────┘
```

### Flow Asynchronous

```php
// ReactPHP menggunakan Promises (mirip JavaScript Promise)
return $db->query('SELECT * FROM pemilih WHERE nim = ? AND token = ?', [$nim, $token])
    ->then(function ($result) {
        // Callback ini TIDAK BLOCKING
        // Event loop bisa handle request lain sambil menunggu database
        
        if (empty($result->resultRows)) {
            return jsonResponse(['error' => 'Invalid credentials']);
        }
        
        return jsonResponse(['success' => true, 'voter_id' => $result->resultRows[0]['id']]);
    })
    ->otherwise(function ($error) {
        // Error handling juga async
        return jsonResponse(['error' => 'Database error'], 500);
    });
```

**Keuntungan:**
- Server tidak freeze saat menunggu database
- Bisa handle 1000+ concurrent users dengan 1 process
- Dashboard admin bisa refresh setiap 5 detik tanpa beban berat

---

## 🚀 Setup & Instalasi

### 1. Setup Database (XAMPP)
```bash
# Buka phpMyAdmin atau MySQL CLI
mysql -u root -p

# Import schema
source database/pemilu_schema.sql
```

### 2. Setup Backend ReactPHP
```bash
cd backend
composer require react/http react/mysql react/promise

# Jalankan server
php reactphp_server.php

# Server berjalan di http://localhost:8080
```

### 3. Setup Frontend React
```bash
npm install
npm run dev

# Frontend berjalan di http://localhost:5173
```

---

## 📡 API Endpoints

### Pemilih

#### `POST /api/voter/login`
**Request:**
```json
{
  "nim": "2021001",
  "token": "a1b2c3d4..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "voter_id": 1,
  "voter_name": "Ahmad Fauzi"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Token sudah digunakan"
}
```

#### `POST /api/vote`
**Request:**
```json
{
  "voter_id": 1,
  "candidate_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Suara berhasil disimpan"
}
```

### Admin

#### `POST /api/admin/login`
**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "abc123...",
  "username": "admin"
}
```

#### `GET /api/admin/stats`
**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "candidate1": 45,
    "candidate2": 38,
    "totalVoted": 83,
    "totalNotVoted": 17,
    "facultyStats": [
      { "name": "Teknik", "voted": 30, "notVoted": 5 },
      { "name": "Ekonomi", "voted": 25, "notVoted": 8 }
    ]
  }
}
```

#### `GET /api/admin/voters`
**Response:**
```json
{
  "success": true,
  "voters": [
    {
      "nim": "2021001",
      "name": "Ahmad Fauzi",
      "faculty": "Teknik",
      "program": "Informatika",
      "hasVoted": true,
      "votedAt": "2024-01-15 10:30:00"
    }
  ]
}
```

---

## 🔐 Keamanan

### Token Sekali Pakai
```php
// Generate token (dilakukan saat import pemilih)
$token = bin2hex(random_bytes(32)); // 64 karakter hex

// Validasi di login
SELECT * FROM pemilih WHERE nim = ? AND token = ? AND sudah_memilih = FALSE

// Setelah vote, token tidak bisa dipakai lagi
UPDATE pemilih SET sudah_memilih = TRUE WHERE id = ?
```

### Password Hashing (Admin)
```php
// Saat create admin
$hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);

// Saat login
if (password_verify($inputPassword, $storedHash)) {
    // Login success
}
```

### CORS untuk Frontend
```php
// Di ReactPHP server
'Access-Control-Allow-Origin' => '*',
'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
'Access-Control-Allow-Headers' => 'Content-Type, Authorization'
```

---

## 🎯 Fitur Utama yang Diimplementasikan

### ✅ Pemilih (Voter)
- [x] Login dengan NIM + Token
- [x] Validasi token sekali pakai
- [x] Halaman pemilihan dengan 2 kandidat
- [x] Konfirmasi sebelum vote
- [x] Feedback sukses/error yang jelas
- [x] Auto-logout setelah voting

### ✅ Admin
- [x] Login dengan username/password
- [x] Dashboard real-time dengan visualisasi:
  - Bar chart perolehan suara
  - Pie chart distribusi suara
  - Pie chart partisipasi pemilih
  - Bar chart per fakultas
- [x] Halaman daftar pemilih (sudah/belum memilih)
- [x] Filter dan search pemilih
- [x] Auto-refresh stats (setiap 5 detik)

### ✅ Design System
- [x] Palet coklat-beige-putih-hitam konsisten
- [x] Responsive design (mobile & desktop)
- [x] Toast notifications untuk feedback
- [x] Loading states
- [x] Professional UI dengan Tailwind + shadcn/ui

---

## 🔄 Alur Lengkap Sistem

### Flow Pemilih
```
1. Buka website → Halaman Login Pemilih
2. Input NIM + Token
3. Klik "Masuk & Pilih"
   ↓
   Frontend → POST /api/voter/login → ReactPHP
   ReactPHP → Query MySQL (async)
   MySQL → Return voter data
   ReactPHP → Response ke Frontend
   ↓
4. Redirect ke Halaman Voting
5. Pilih salah satu kandidat
6. Konfirmasi pilihan
   ↓
   Frontend → POST /api/vote → ReactPHP
   ReactPHP → INSERT suara + UPDATE pemilih (async)
   ↓
7. Tampilkan "Suara Tercatat!"
8. Auto-redirect ke halaman login (3 detik)
```

### Flow Admin
```
1. Buka /admin → Login Admin
2. Input username + password
   ↓
   ReactPHP validasi → Return token
   ↓
3. Dashboard Admin (auto-refresh tiap 5s)
   ↓
   GET /api/admin/stats (dengan token)
   ReactPHP → Multiple async queries (Promise.all)
   Return: vote counts, participation, faculty stats
   ↓
4. Visualisasi di chart (recharts)
5. Akses halaman "Daftar Pemilih"
   ↓
   GET /api/admin/voters
   ↓
6. Filter/search pemilih
```

---

## 🛠️ Troubleshooting

### Frontend tidak bisa connect ke backend
```bash
# Pastikan backend ReactPHP berjalan
php reactphp_server.php

# Cek di browser console:
# Network Error? → Backend mati
# CORS Error? → CORS headers belum di-set
```

### Database connection error
```bash
# Pastikan XAMPP MySQL berjalan
# Cek database config di reactphp_server.php:
$dbConfig = 'root:@localhost/pemilu_mahasiswa';
                ^-- password (kosong jika default XAMPP)
```

### Chart tidak muncul
```bash
# Install recharts jika belum
npm install recharts
```

---

## 📝 Catatan Penting

1. **Token Generation:** Token harus di-generate saat import data pemilih (offline), bukan saat runtime
2. **ReactPHP Event Loop:** Tidak boleh ada blocking operations (gunakan async I/O)
3. **Production Deployment:** 
   - Gunakan JWT untuk admin token
   - Implement rate limiting
   - Gunakan HTTPS
   - Set CORS ke domain spesifik

---

## 📚 Referensi

- **ReactPHP Docs:** https://reactphp.org/
- **React MySQL (Async):** https://github.com/friends-of-reactphp/mysql
- **React Promises:** https://github.com/reactphp/promise
- **Recharts:** https://recharts.org/

---

**Sistem siap digunakan!** 🎉

Untuk pertanyaan lebih lanjut tentang implementasi atau customisasi, silakan modifikasi kode sesuai kebutuhan kampus Anda.
