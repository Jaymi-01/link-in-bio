"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUsernameExists, createUserProfile } from "@/lib/db";

export default function OnboardingPage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
        if (!user) {
            router.push("/login");
        } else if (userProfile) {
            router.push("/admin");
        }
    }
  }, [user, userProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.");
      return;
    }

    setIsChecking(true);
    try {
      const exists = await checkUsernameExists(username);
      if (exists) {
        setError("Username is already taken.");
        setIsChecking(false);
        return;
      }

      if (user) {
        await createUserProfile(user.uid, {
            email: user.email,
            photoURL: user.photoURL,
            username: username,
            createdAt: Date.now()
        });
        await refreshProfile();
        // Redirect will happen via useEffect
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
        setIsChecking(false);
    }
  };

  if (loading) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-100 p-4 overflow-hidden">
       {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white z-10">
        <CardHeader>
          <CardTitle>Claim your unique handle</CardTitle>
          <CardDescription>Choose a username for your public page.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">myapp.com/</span>
                    <Input 
                        placeholder="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        disabled={isChecking}
                        className="font-medium"
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isChecking}>
              {isChecking ? "Checking..." : "Claim Username"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
