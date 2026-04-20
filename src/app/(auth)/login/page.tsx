"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Loader2,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EMAIL_STORAGE_KEY = "aquaflow-remember-email";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const QUICK_ACCESS = [
  {
    label: "Enter as Admin",
    description: "Dashboard, orders, inventory & more",
    email: "admin@aquaflow.store",
    password: "admin123",
    icon: ShieldCheck,
    variant: "outline" as const,
  },
  {
    label: "Enter as Customer",
    description: "Browse, shop & manage your orders",
    email: "customer@aquaflow.store",
    password: "customer123",
    icon: ShoppingBag,
    variant: "outline" as const,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(EMAIL_STORAGE_KEY);
        if (stored) {
          setEmail(stored);
          setRemember(true);
        }
      } catch {
        /* ignore */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  async function doSignIn(signinEmail: string, signinPassword: string) {
    const result = await signIn("credentials", {
      email: signinEmail,
      password: signinPassword,
      redirect: false,
    });
    if (result?.error || !result?.ok) return false;

    let session = await getSession();
    if (!session?.user) {
      await new Promise((r) => setTimeout(r, 150));
      session = await getSession();
    }

    const role = session?.user?.role;
    if (role === "ADMIN") router.push("/admin");
    else router.push("/");
    router.refresh();
    return true;
  }

  async function handleQuickAccess(account: (typeof QUICK_ACCESS)[number]) {
    setFormError(null);
    setQuickLoading(account.email);
    try {
      const ok = await doSignIn(account.email, account.password);
      if (!ok) setFormError("Quick sign-in failed. Please try again.");
    } finally {
      setQuickLoading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const nextErrors: { email?: string; password?: string } = {};
    const trimmed = email.trim();
    if (!trimmed) nextErrors.email = "Email is required.";
    else if (!isValidEmail(trimmed)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const ok = await doSignIn(trimmed, password);
      if (!ok) {
        setFormError("Invalid email or password.");
        return;
      }
      try {
        if (remember) localStorage.setItem(EMAIL_STORAGE_KEY, trimmed);
        else localStorage.removeItem(EMAIL_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
    }
  }

  const anyLoading = loading || quickLoading !== null;

  return (
    <div className="flex flex-col gap-6">
      {/* Quick access */}
      <div className="space-y-3">
        <p className="text-center text-sm font-medium text-foreground">
          Quick access — choose a role
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_ACCESS.map((account) => {
            const Icon = account.icon;
            const isLoading = quickLoading === account.email;
            return (
              <button
                key={account.email}
                type="button"
                disabled={anyLoading}
                onClick={() => handleQuickAccess(account)}
                className="group flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-5 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{account.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {account.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or sign in manually</span>
        <Separator className="flex-1" />
      </div>

      {/* Manual sign-in */}
      <Card className="w-full shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-lg">Sign in to your account</CardTitle>
          <CardDescription>Enter your email and password to continue.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="flex flex-col gap-4 pt-6">
            {formError ? (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                className="h-9"
                disabled={anyLoading}
              />
              {fieldErrors.email ? (
                <p id="login-email-error" className="text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                className="h-9"
                disabled={anyLoading}
              />
              {fieldErrors.password ? (
                <p id="login-password-error" className="text-sm text-destructive">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-me"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
              />
              <Label htmlFor="remember-me" className="cursor-pointer font-normal text-muted-foreground">
                Remember me
              </Label>
            </div>
            <Button type="submit" className="h-9 w-full" disabled={anyLoading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/30 pt-4">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
