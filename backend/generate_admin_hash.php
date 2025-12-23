<?php
/**
 * =====================================================
 * UTILITY: GENERATE & TEST ADMIN PASSWORD HASH
 * =====================================================
 * 
 * Script ini akan:
 * 1. Generate hash untuk password 'admin123'
 * 2. Test password_verify() untuk memastikan hash bekerja
 * 3. Memberikan SQL query untuk update database
 * 
 * Cara pakai:
 * php generate_admin_hash.php
 */

echo "=================================================\n";
echo "ADMIN PASSWORD HASH GENERATOR & TESTER\n";
echo "=================================================\n\n";

// Password yang akan di-hash
$plainPassword = 'admin123';
$username = 'admin';

// 1. Generate hash baru
echo "1. Generating hash untuk password: '$plainPassword'\n";
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);
echo "   Hash: $hashedPassword\n\n";

// 2. Test password_verify
echo "2. Testing password_verify()...\n";
$verifyResult = password_verify($plainPassword, $hashedPassword);
echo "   Result: " . ($verifyResult ? "✅ SUCCESS - Hash valid!" : "❌ FAILED - Hash tidak valid!") . "\n\n";

// 3. Test dengan password salah
echo "3. Testing dengan password salah 'wrongpassword'...\n";
$wrongVerify = password_verify('wrongpassword', $hashedPassword);
echo "   Result: " . ($wrongVerify ? "❌ FAILED - Seharusnya gagal!" : "✅ SUCCESS - Correctly rejected wrong password!") . "\n\n";

// 4. Berikan SQL query
echo "=================================================\n";
echo "SQL QUERY UNTUK UPDATE DATABASE:\n";
echo "=================================================\n";
echo "-- Hapus admin lama (jika ada)\n";
echo "DELETE FROM admin WHERE username = '$username';\n\n";
echo "-- Insert admin baru dengan hash yang benar\n";
echo "INSERT INTO admin (username, password) VALUES \n";
echo "('$username', '$hashedPassword');\n\n";

echo "=================================================\n";
echo "LANGKAH SELANJUTNYA:\n";
echo "=================================================\n";
echo "1. Copy SQL query di atas\n";
echo "2. Jalankan di phpMyAdmin atau MySQL client\n";
echo "3. Restart ReactPHP server:\n";
echo "   - Tekan Ctrl+C untuk stop server\n";
echo "   - Jalankan: php reactphp_server.php\n";
echo "4. Test login dengan:\n";
echo "   Username: $username\n";
echo "   Password: $plainPassword\n";
echo "=================================================\n\n";

// 5. Test koneksi database dan cek hash yang ada
echo "=================================================\n";
echo "DEBUGGING: CEK HASH DI DATABASE\n";
echo "=================================================\n";

try {
    // Koneksi ke database untuk debugging
    $pdo = new PDO('mysql:host=localhost;dbname=pemilu_mahasiswa', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT username, password FROM admin WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "Admin ditemukan di database:\n";
        echo "Username: {$admin['username']}\n";
        echo "Hash di DB: {$admin['password']}\n";
        echo "Hash baru: $hashedPassword\n\n";
        
        // Test apakah hash di DB valid
        echo "Testing hash yang ada di database...\n";
        $dbVerify = password_verify($plainPassword, $admin['password']);
        echo "Result: " . ($dbVerify ? "✅ Hash di DB VALID!" : "❌ Hash di DB TIDAK VALID - Perlu update!") . "\n\n";
        
        if (!$dbVerify) {
            echo "⚠️ SOLUSI: Hash di database tidak cocok dengan password '$plainPassword'\n";
            echo "   Jalankan SQL query di atas untuk memperbaikinya.\n\n";
        } else {
            echo "✅ Hash di database sudah benar!\n";
            echo "   Jika masih error, cek:\n";
            echo "   - Apakah ReactPHP server sudah di-restart?\n";
            echo "   - Apakah password yang diinput benar: '$plainPassword'\n";
            echo "   - Apakah ada whitespace/karakter tersembunyi di input?\n\n";
        }
    } else {
        echo "❌ Admin dengan username '$username' TIDAK DITEMUKAN di database!\n";
        echo "   Jalankan SQL query INSERT di atas untuk menambahkannya.\n\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error koneksi database: " . $e->getMessage() . "\n";
    echo "   Pastikan:\n";
    echo "   - XAMPP MySQL sudah running\n";
    echo "   - Database 'pemilu_mahasiswa' sudah ada\n";
    echo "   - Credentials benar (user: root, password: kosong)\n\n";
}

echo "=================================================\n";
echo "SELESAI!\n";
echo "=================================================\n";
