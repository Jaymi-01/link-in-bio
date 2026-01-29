import { getUserByUsername, getUserLinks } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} | Link in Bio`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  
  // 1. Fetch User Profile
  const profile = await getUserByUsername(username);

  if (!profile) {
    notFound();
  }

  // 2. Fetch Links
  const links = await getUserLinks(profile.uid);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-100 overflow-hidden">
      
       {/* Decorative Blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      <Card className="w-full max-w-md bg-white shadow-2xl border-0 z-10 my-8">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={profile.photoURL || ""} alt={username} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-indigo-600 text-white">
                    {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">@{username}</h1>
            </div>
        </CardHeader>

        <CardContent className="space-y-6">
            <div className="space-y-3">
                {links.length === 0 && (
                    <div className="text-center py-8 text-slate-500 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        <p>This user hasn't added any links yet.</p>
                    </div>
                )}
                {links.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full group"
                    >
                        <div className="w-full p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 flex items-center justify-center text-center relative overflow-hidden">
                            <span className="font-semibold text-slate-800 relative z-10 group-hover:text-indigo-600 transition-colors">
                                {link.title}
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            <div className="flex justify-center pt-4 border-t border-slate-100">
                <Link href="/" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Create your own <span className="font-semibold">Link in Bio</span>
                </Link>
            </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 w-full leading-none z-0 pointer-events-none">
         <Image 
            src="/wave.svg" 
            alt="Wave" 
            width={1440} 
            height={320} 
            className="w-full h-auto object-cover opacity-50"
         />
      </div>
    </div>
  );
}
