import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoImg from "@/assets/logo1.png";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

function LoginForm() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  return (
    <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
      <div className="space-y-1">
        <Label>Username</Label>
        <Input {...register("username")} placeholder="your_username" />
        {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Password</Label>
        <Input type="password" {...register("password")} placeholder="••••••••" />
        {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
      </div>
      {login.error && <p className="text-destructive text-sm">{login.error.message}</p>}
      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}

function RegisterForm() {
  const register_ = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  return (
    <form onSubmit={handleSubmit((data) => register_.mutate(data))} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>First Name</Label>
          <Input {...register("firstName")} placeholder="Jane" />
        </div>
        <div className="space-y-1">
          <Label>Last Name</Label>
          <Input {...register("lastName")} placeholder="Doe" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Email (optional)</Label>
        <Input type="email" {...register("email")} placeholder="jane@example.com" />
        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Username</Label>
        <Input {...register("username")} placeholder="your_username" />
        {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
      </div>
      <div className="space-y-1">
        <Label>Password</Label>
        <Input type="password" {...register("password")} placeholder="At least 6 characters" />
        {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
      </div>
      {register_.error && <p className="text-destructive text-sm">{register_.error.message}</p>}
      <Button type="submit" className="w-full" disabled={register_.isPending}>
        {register_.isPending ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img
              src={logoImg}
              alt="Quixoria"
              className="h-28 w-auto object-contain drop-shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Quixoria</h1>
            <p className="text-muted-foreground text-sm mt-1">Your cozy digital bookshop</p>
          </div>
        </div>

        {/* Card */}
        <Card className="border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              {tab === "login" ? "Welcome back" : "Join Quixoria"}
            </CardTitle>
            <CardDescription>
              {tab === "login"
                ? "Sign in to access your library"
                : "Create an account to start reading"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login"><LoginForm /></TabsContent>
              <TabsContent value="register"><RegisterForm /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}