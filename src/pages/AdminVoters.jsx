import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminVoters = () => {
  const [voters, setVoters] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/voters", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setVoters(data.voters);
      }
    } catch (error) {
      console.error("Failed to fetch voters:", error);
    }
  };

  const filteredVoters = voters.filter((voter) => {
    const matchesSearch =
      voter.nim.toLowerCase().includes(search.toLowerCase()) ||
      voter.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "voted" && voter.hasVoted) ||
      (filter === "not-voted" && !voter.hasVoted);

    return matchesSearch && matchesFilter;
  });

  const votedCount = voters.filter((v) => v.hasVoted).length;
  const notVotedCount = voters.length - votedCount;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/dashboard")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Daftar Pemilih</h1>
          <p className="text-primary-foreground/80 mt-1">Kelola dan monitor status pemilih</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Pemilih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{voters.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sudah Memilih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success">{votedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Belum Memilih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-muted-foreground">{notVotedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Lengkap Pemilih</CardTitle>
            <CardDescription>Filter dan cari data pemilih</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari NIM atau nama..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  Semua
                </Button>
                <Button
                  variant={filter === "voted" ? "default" : "outline"}
                  onClick={() => setFilter("voted")}
                >
                  Sudah Pilih
                </Button>
                <Button
                  variant={filter === "not-voted" ? "default" : "outline"}
                  onClick={() => setFilter("not-voted")}
                >
                  Belum Pilih
                </Button>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Fakultas</TableHead>
                    <TableHead>Program Studi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Waktu Memilih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVoters.map((voter) => (
                    <TableRow key={voter.nim}>
                      <TableCell className="font-medium">{voter.nim}</TableCell>
                      <TableCell>{voter.name}</TableCell>
                      <TableCell>{voter.faculty}</TableCell>
                      <TableCell>{voter.program}</TableCell>
                      <TableCell>
                        {voter.hasVoted ? (
                          <Badge variant="default" className="bg-success">
                            Sudah Memilih
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Belum Memilih</Badge>
                        )}
                      </TableCell>
                      <TableCell>{voter.votedAt || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredVoters.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Tidak ada data pemilih yang sesuai dengan filter
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVoters;