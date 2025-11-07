import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
}

export default function LoginForm({ onSubmit, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email, password);
    console.log("Login submitted:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte Beauté Suisse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => {
                onForgotPassword?.();
                console.log("Forgot password clicked");
              }}
              data-testid="button-forgot-password"
            >
              Mot de passe oublié ?
            </button>
            <Button
              type="submit"
              className="w-full"
              data-testid="button-submit-login"
            >
              Se connecter
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <Link href="/register">
              <span className="text-primary hover:underline cursor-pointer" data-testid="link-register">
                S'inscrire
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
