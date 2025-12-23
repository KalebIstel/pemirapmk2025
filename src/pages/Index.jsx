import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Vote, ShieldCheck, Users, BarChart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-foreground/10 rounded-full mb-4">
            <Vote className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Sistem Pemilu Mahasiswa</h1>
          <p className="text-lg text-primary-foreground/90">
            Platform Pemilihan Umum Online yang Transparan dan Efisien
          </p>
        </div>
      </header>

      {/* Demo Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Demo Sistem</h2>
          <p className="text-lg text-muted-foreground">
            Pilih role untuk melihat tampilan yang berbeda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pemilih Card */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Portal Pemilih</CardTitle>
              <CardDescription className="text-base">
                Login sebagai mahasiswa untuk memberikan suara
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="font-semibold text-foreground">Kredensial Demo:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">NIM:</div>
                  <div className="font-mono font-semibold">2021001</div>
                  <div className="text-muted-foreground">Token:</div>
                  <div className="font-mono text-xs break-all font-semibold">
                    a1b2c3d4e5f67890...
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  * Token akan otomatis terisi saat Anda klik tombol demo
                </p>
              </div>
              <Button
                size="lg"
                className="w-full text-lg font-semibold h-14"
                onClick={() => navigate("/voter")}
              >
                <Users className="w-5 h-5 mr-2" />
                Masuk Sebagai Pemilih
              </Button>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Portal Admin</CardTitle>
              <CardDescription className="text-base">
                Dashboard monitoring dan analisis hasil pemilu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="font-semibold text-foreground">Kredensial Demo:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Username:</div>
                  <div className="font-mono font-semibold">admin</div>
                  <div className="text-muted-foreground">Password:</div>
                  <div className="font-mono font-semibold">admin123</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  * Kredensial akan otomatis terisi saat Anda klik tombol demo
                </p>
              </div>
              <Button
                size="lg"
                className="w-full text-lg font-semibold h-14"
                onClick={() => navigate("/admin")}
              >
                <BarChart className="w-5 h-5 mr-2" />
                Masuk Sebagai Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Fitur Sistem</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-primary/10">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold mb-2">Token Sekali Pakai</h4>
                <p className="text-sm text-muted-foreground">
                  Setiap mahasiswa mendapat token unik yang hanya bisa digunakan satu kali
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold mb-2">Dashboard Real-time</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor hasil pemilu secara langsung dengan visualisasi data yang menarik
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold mb-2">Aman & Transparan</h4>
                <p className="text-sm text-muted-foreground">
                  Sistem keamanan berlapis dengan enkripsi dan audit trail lengkap
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Note */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-muted/50 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-bold text-center mb-3 text-lg">📝 Catatan Teknis</h4>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Sistem ini dibangun dengan <strong>React + TypeScript</strong> untuk frontend dan{" "}
                <strong>ReactPHP</strong> untuk backend yang asynchronous. Database menggunakan{" "}
                <strong>MySQL</strong>. Untuk demo lengkap, Anda perlu menjalankan backend ReactPHP
                dan database MySQL (lihat file <code className="bg-background px-1.5 py-0.5 rounded">DOKUMENTASI_TEKNIS.md</code>).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;