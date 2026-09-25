"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { signInAction, sendMagicLinkAction } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("rizky.pratama@example.id");
  const [password, setPassword] = useState("Password123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const res = await signInAction({ email, password });
    setIsLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.push("/chat");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // Fallback for dev mode
        router.push("/chat");
      }
    } catch {
      router.push("/chat");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const res = await sendMagicLinkAction({ email });
    setIsLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setMagicLinkSent(true);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-card/80 border-border/80 shadow-2xl backdrop-blur-xl rounded-3xl p-2 sm:p-4">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet-600 to-cyan-500 shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Selamat Datang Kembali
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Masuk ke akun AetherChat Anda untuk melanjutkan percakapan
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {errorMsg && (
            <div className="rounded-xl bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-11 rounded-xl border-border/70 hover:bg-secondary/70 gap-2 font-medium text-xs sm:text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-mono">
                atau
              </span>
            </div>
          </div>

          {/* Email Tabs: Password or Magic Link */}
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
              <TabsTrigger value="password" className="text-xs">Password</TabsTrigger>
              <TabsTrigger value="magic-link" className="text-xs">Magic Link</TabsTrigger>
            </TabsList>

            {/* Email + Password Form */}
            <TabsContent value="password">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-medium text-foreground">Kata Sandi</label>
                    <a href="#" className="text-primary hover:underline text-[11px]">
                      Lupa sandi?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="glow"
                  disabled={isLoading}
                  className="w-full h-10 mt-2 text-white font-medium rounded-xl text-xs sm:text-sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Masuk Sekarang</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Magic Link Form */}
            <TabsContent value="magic-link">
              {magicLinkSent ? (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                  <p className="text-xs text-emerald-400 font-medium">
                    Tautan masuk tanpa kata sandi telah dikirim ke <strong>{email}</strong>. Silakan periksa inbox atau folder spam Anda!
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setMagicLinkSent(false)}
                    className="mt-2 text-xs text-primary"
                  >
                    Kirim ulang
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={isLoading}
                    className="w-full h-10 border border-border/70 text-xs sm:text-sm font-medium"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Kirim Tautan Magic Link"
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          {/* Footer Register Link */}
          <div className="text-center text-xs text-muted-foreground pt-2">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar gratis di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
