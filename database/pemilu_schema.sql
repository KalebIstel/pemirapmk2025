-- =====================================================
-- SKEMA DATABASE PEMILU MAHASISWA
-- Database: pemilu_mahasiswa
-- Backend: ReactPHP + MySQL
-- =====================================================

CREATE DATABASE IF NOT EXISTS pemilu_mahasiswa;
USE pemilu_mahasiswa;

-- Tabel Admin
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Gunakan password_hash() di PHP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Kandidat
CREATE TABLE kandidat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nomor_urut INT NOT NULL UNIQUE,
    visi TEXT,
    misi TEXT,
    foto_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Pemilih
CREATE TABLE pemilih (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    fakultas VARCHAR(100) NOT NULL,
    program_studi VARCHAR(100) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL, -- Token unik untuk sekali pakai
    sudah_memilih BOOLEAN DEFAULT FALSE,
    waktu_memilih TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nim (nim),
    INDEX idx_token (token),
    INDEX idx_sudah_memilih (sudah_memilih)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Suara (Votes)
CREATE TABLE suara (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pemilih_id INT NOT NULL,
    kandidat_id INT NOT NULL,
    waktu_vote TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pemilih_id) REFERENCES pemilih(id) ON DELETE CASCADE,
    FOREIGN KEY (kandidat_id) REFERENCES kandidat(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (pemilih_id) -- Satu pemilih hanya bisa vote sekali
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- DATA SAMPLE (Opsional untuk testing)
-- =====================================================

-- Insert Admin (password: admin123)
-- Hash dibuat dengan password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO admin (username, password) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert Kandidat
INSERT INTO kandidat (nama, nomor_urut, visi, misi) VALUES 
('Kandidat Pasangan 1', 1, 
 'Membangun kampus yang inklusif, inovatif, dan berprestasi untuk semua mahasiswa.',
 'Meningkatkan fasilitas kampus, Memperkuat organisasi, Membuka program beasiswa'),
('Kandidat Pasangan 2', 2,
 'Mewujudkan mahasiswa yang mandiri, kreatif, dan berjiwa kepemimpinan tinggi.',
 'Mengembangkan soft skill, Meningkatkan kerjasama industri, Memfasilitasi wirausaha');

-- Insert Sample Pemilih dengan token unik
-- Token di-generate dengan bin2hex(random_bytes(32))
INSERT INTO pemilih (nim, nama, fakultas, program_studi, token) VALUES
('2021001', 'Ahmad Fauzi', 'Teknik', 'Informatika', 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'),
('2021002', 'Siti Nurhaliza', 'Ekonomi', 'Akuntansi', 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567'),
('2021003', 'Budi Santoso', 'Teknik', 'Elektro', 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678'),
('2021004', 'Dewi Lestari', 'FMIPA', 'Matematika', 'd4e5f6789012345678901234567890abcdef1234567890abcdef123456789'),
('2021005', 'Eko Prasetyo', 'Ekonomi', 'Manajemen', 'e5f6789012345678901234567890abcdef1234567890abcdef1234567890a'),
('2021006', 'Fitri Handayani', 'FMIPA', 'Fisika', 'f6789012345678901234567890abcdef1234567890abcdef1234567890ab'),
('2021007', 'Gunawan', 'Teknik', 'Sipil', 'g789012345678901234567890abcdef1234567890abcdef1234567890abc'),
('2021008', 'Hana Wijaya', 'Hukum', 'Hukum', 'h89012345678901234567890abcdef1234567890abcdef1234567890abcd');

-- =====================================================
-- QUERY UNTUK STATISTIK (Digunakan oleh ReactPHP API)
-- =====================================================

-- Total suara per kandidat
-- SELECT kandidat_id, COUNT(*) as total_suara 
-- FROM suara 
-- GROUP BY kandidat_id;

-- Total pemilih yang sudah/belum memilih
-- SELECT 
--   SUM(CASE WHEN sudah_memilih = TRUE THEN 1 ELSE 0 END) as sudah_memilih,
--   SUM(CASE WHEN sudah_memilih = FALSE THEN 1 ELSE 0 END) as belum_memilih
-- FROM pemilih;

-- Partisipasi per fakultas
-- SELECT 
--   fakultas,
--   SUM(CASE WHEN sudah_memilih = TRUE THEN 1 ELSE 0 END) as voted,
--   SUM(CASE WHEN sudah_memilih = FALSE THEN 1 ELSE 0 END) as not_voted
-- FROM pemilih
-- GROUP BY fakultas;
