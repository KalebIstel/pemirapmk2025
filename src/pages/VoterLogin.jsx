import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Vote } from "lucide-react";

const VoterLogin = () => {
  const [nim, setNim] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call ReactPHP backend API
      const response = await fetch("http://localhost:8080/api/voter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, token }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("voter_id", data.voter_id);
        localStorage.setItem("voter_nim", nim);
        toast.success("Login berhasil!");
        navigate("/voting");
      } else {
        toast.error(data.message || "Login gagal. Periksa NIM dan Token Anda.");
      }
    } catch (error) {
      toast.error("Koneksi ke server gagal. Pastikan backend ReactPHP berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Vote className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-primary">Pemilu Mahasiswa</CardTitle>
            <CardDescription className="text-base mt-2">
              Masukkan NIM dan Token untuk memilih
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nim">Nomor Induk Mahasiswa (NIM)</Label>
              <Input
                id="nim"
                type="text"
                placeholder="Masukkan NIM"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Token Pemilihan</Label>
              <Input
                id="token"
                type="password"
                placeholder="Masukkan Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading}>
              {loading ? "Memproses..." : "Masuk & Pilih"}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <div>
              <a href="/admin" className="text-sm text-muted-foreground hover:text-primary">
                Login sebagai Admin
              </a>
            </div>
            <div>
              <a href="/" className="text-sm text-muted-foreground hover:text-primary">
                ← Kembali ke Halaman Utama
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoterLogin;