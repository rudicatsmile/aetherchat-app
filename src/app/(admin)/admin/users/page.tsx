"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Ban, CheckCircle, Shield, MoreVertical, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getAdminUsersAction, toggleUserBanAction, AdminUserItem } from "@/actions/admin";

export default function AdminUsersPage() {
  const [userList, setUserList] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await getAdminUsersAction();
        setUserList(data);
      } catch (err) {
        console.error("Gagal memuat pengguna:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleToggleBan = async (id: string, currentStatus: "active" | "banned") => {
    try {
      setUpdatingId(id);
      const res = await toggleUserBanAction(id, currentStatus);
      if (res.success && res.newStatus) {
        setUserList((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: res.newStatus as "active" | "banned" } : u))
        );
      }
    } catch (err) {
      console.error("Gagal memperbarui status blokir:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = userList.filter((u) => {
    const matchQuery =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchQuery && matchRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Manajemen Pengguna
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Daftar seluruh akun terdaftar di Supabase Auth, kuota penggunaan hari ini, dan kontrol akses (banned/active).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            className="pl-9 h-10 text-xs bg-card/60 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant={filterRole === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRole("all")}
            className="text-xs rounded-xl"
          >
            Semua ({userList.length})
          </Button>
          <Button
            variant={filterRole === "admin" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRole("admin")}
            className="text-xs rounded-xl"
          >
            Admin
          </Button>
          <Button
            variant={filterRole === "user" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRole("user")}
            className="text-xs rounded-xl"
          >
            User Biasa
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-card/70 border-border/80 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Memuat data pengguna dari Supabase...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Pengguna</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Bergabung</TableHead>
                <TableHead className="text-xs">Pesan Hari Ini</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Tidak ada pengguna yang cocok dengan kriteria pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-foreground">{u.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">{u.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.role === "admin" ? (
                        <Badge variant="violet" className="text-[10px]">
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {u.joined}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold">
                      {u.messagesToday} / 50
                    </TableCell>
                    <TableCell>
                      {u.status === "active" ? (
                        <Badge variant="success" className="text-[10px]">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">
                          Diblokir
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={u.status === "banned" ? "outline" : "destructive"}
                        size="sm"
                        disabled={updatingId === u.id}
                        onClick={() => handleToggleBan(u.id, u.status)}
                        className="h-7 px-2.5 text-xs rounded-lg gap-1"
                      >
                        {updatingId === u.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : u.status === "banned" ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-emerald-400" />
                            <span>Buka Blokir</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-3 w-3" />
                            <span>Blokir Akun</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
