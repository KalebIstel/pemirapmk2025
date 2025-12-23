import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CheckCircle2, User } from "lucide-react";

const VotingPage = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteComplete, setVoteComplete] = useState(false);
  const navigate = useNavigate();

  const candidates = [
    {
      id: 1,
      name: "Kandidat Pasangan 1",
      visi: "Membangun kampus yang inklusif, inovatif, dan berprestasi untuk semua mahasiswa.",
      misi: [
        "Meningkatkan fasilitas dan infrastruktur kampus",
        "Memperkuat organisasi kemahasiswaan",
        "Membuka lebih banyak program beasiswa",
      ],
    },
    {
      id: 2,
      name: "Kandidat Pasangan 2",
      visi: "Mewujudkan mahasiswa yang mandiri, kreatif, dan berjiwa kepemimpinan tinggi.",
      misi: [
        "Mengembangkan soft skill mahasiswa",
        "Meningkatkan kerjasama dengan industri",
        "Memfasilitasi wirausaha mahasiswa",
      ],
    },
  ];

  const handleSelectCandidate = (id) => {
    setSelectedCandidate(id);
    setShowConfirm(true);
  };

  const handleConfirmVote = async () => {
    setVoting(true);
    const voterId = localStorage.getItem("voter_id");

    try {
      const response = await fetch("http://localhost:8080/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voter_id: voterId,
          candidate_id: selectedCandidate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVoteComplete(true);
        toast.success("Terima kasih! Suara Anda telah tercatat.", {
          duration: 5000,
        });
        setTimeout(() => {
          localStorage.removeItem("voter_id");
          localStorage.removeItem("voter_nim");
          navigate("/voter");
        }, 3000);
      } else {
        toast.error(data.message || "Gagal menyimpan suara. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("Koneksi ke server gagal.");
    } finally {
      setVoting(false);
      setShowConfirm(false);
    }
  };

  if (voteComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center border-success/50">
          <CardContent className="pt-12 pb-12">
            <CheckCircle2 className="w-20 h-20 mx-auto text-success mb-6" />
            <h2 className="text-3xl font-bold text-success mb-4">Suara Tercatat!</h2>
            <p className="text-lg text-muted-foreground">
              Terima kasih atas partisipasi Anda dalam Pemilu Mahasiswa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">Surat Suara Elektronik</h1>
          <p className="text-lg text-muted-foreground">Pilih salah satu pasangan kandidat</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
            >
              <CardHeader className="text-center bg-secondary/50">
                <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-primary">{candidate.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Visi:</h3>
                  <p className="text-muted-foreground leading-relaxed">{candidate.visi}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Misi:</h3>
                  <ul className="space-y-2">
                    {candidate.misi.map((item, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start">
                        <span className="mr-2 text-primary font-bold">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  size="lg"
                  className="w-full text-lg font-semibold h-14"
                  onClick={() => handleSelectCandidate(candidate.id)}
                >
                  Pilih Kandidat {candidate.id}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Konfirmasi Pilihan</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Anda memilih <strong>Kandidat Pasangan {selectedCandidate}</strong>.
              <br />
              <br />
              Pilihan Anda tidak dapat diubah setelah dikonfirmasi. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={voting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmVote} disabled={voting}>
              {voting ? "Memproses..." : "Ya, Konfirmasi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VotingPage;