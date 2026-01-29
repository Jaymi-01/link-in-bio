"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
            Loading...
        </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-100 overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <main className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl p-12 bg-white rounded-3xl shadow-xl mx-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-slate-900">
          Link in Bio
        </h1>
        <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
          The only link you'll ever need. Connect audiences to all of your content with just one URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-transform hover:scale-105">
                    Get Started for Free
                </Button>
            </Link>
        </div>
      </main>
      
      <div className="absolute bottom-0 left-0 w-full leading-none z-0">
         <Image 
            src="/wave.svg" 
            alt="Wave" 
            width={1440} 
            height={320} 
            className="w-full h-auto object-cover"
         />
      </div>

      <footer className="absolute bottom-4 text-indigo-100 text-sm z-10">
        &copy; {new Date().getFullYear()} Link in Bio. All rights reserved.
      </footer>
    </div>
  );
}