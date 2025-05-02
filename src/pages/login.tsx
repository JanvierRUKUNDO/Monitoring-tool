import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Head>
        <title>Login | Application Monitoring System</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the application monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Use &quot;password&quot; for all accounts
                </p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-gray-500">
              <p>Available accounts:</p>
              <ul className="list-disc list-inside">
                <li>admin@example.com (Janvier RUKUNDO)</li>
                <li>staff@example.com (Staff)</li>
                <li>user@example.com (Regular User)</li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
