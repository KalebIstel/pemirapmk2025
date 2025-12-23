import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, CheckCircle, XCircle, TrendingUp, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    candidate1: 0,
    candidate2: 0,
    totalVoted: 0,
    totalNotVoted: 0,
    facultyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast.success("Logout berhasil");
    navigate("/admin");
  };

  const candidateData = [
    { name: "Kandidat 1", value: stats.candidate1, color: "hsl(var(--chart-1))" },
    { name: "Kandidat 2", value: stats.candidate2, color: "hsl(var(--chart-2))" },
  ];

  const participationData = [
    { name: "Sudah Memilih", value: stats.totalVoted, color: "hsl(var(--success))" },
    { name: "Belum Memilih", value: stats.totalNotVoted, color: "hsl(var(--muted))" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin Pemilu</h1>
            <p className="text-primary-foreground/80 mt-1">Monitor pemilihan secara real-time</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemilih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div className="text-3xl font-bold">{stats.totalVoted + stats.totalNotVoted}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sudah Memilih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div className="text-3xl font-bold text-success">{stats.totalVoted}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Belum Memilih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-muted-foreground" />
                <div className="text-3xl font-bold">{stats.totalNotVoted}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Partisipasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div className="text-3xl font-bold">
                  {stats.totalVoted + stats.totalNotVoted > 0
                    ? Math.round((stats.totalVoted / (stats.totalVoted + stats.totalNotVoted)) * 100)
                    : 0}
                  %
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="candidates">Perolehan Suara</TabsTrigger>
            <TabsTrigger value="participation">Partisipasi</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Diagram Batang - Perolehan Suara</CardTitle>
                  <CardDescription>Perbandingan suara antar kandidat</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={candidateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diagram Lingkaran - Perolehan Suara</CardTitle>
                  <CardDescription>Distribusi suara dalam persentase</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={candidateData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {candidateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participation" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Partisipasi Pemilih</CardTitle>
                  <CardDescription>Perbandingan sudah vs belum memilih</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={participationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {participationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partisipasi per Fakultas</CardTitle>
                  <CardDescription>Data pemilih berdasarkan fakultas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.facultyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="voted" fill="hsl(var(--success))" name="Sudah Memilih" />
                      <Bar dataKey="notVoted" fill="hsl(var(--muted))" name="Belum Memilih" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;