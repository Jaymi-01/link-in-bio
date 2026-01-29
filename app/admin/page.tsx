"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addLink, deleteLink, getUserLinks, LinkItem, updateLink } from "@/lib/db";
import { Trash2, ExternalLink, GripVertical } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!userProfile) {
        router.push("/onboarding");
      } else {
        fetchLinks();
      }
    }
  }, [user, userProfile, loading, router]);

  const fetchLinks = async () => {
    if (user) {
      const userLinks = await getUserLinks(user.uid);
      setLinks(userLinks);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    setIsAdding(true);
    try {
      if (user) {
        await addLink(user.uid, newTitle, newUrl);
        setNewTitle("");
        setNewUrl("");
        await fetchLinks();
      }
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this link?") && user) {
        await deleteLink(user.uid, id);
        fetchLinks();
    }
  };

  if (loading || !userProfile) return null;

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-x-hidden">
      {/* Decorative Blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

      <header className="bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">LB</span>
            Dashboard
        </h1>
        <div className="flex gap-4 items-center">
            <Link href={`/${userProfile.username}`} target="_blank">
                <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <ExternalLink className="w-4 h-4 mr-2"/>
                    View My Page
                </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => logout()} className="text-slate-500">Logout</Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-8 relative z-10">
        {/* Add Link Form */}
        <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle className="text-slate-900">Add New Link</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddLink} className="space-y-4">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Title</label>
                            <Input 
                                placeholder="e.g. My Portfolio" 
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="bg-slate-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">URL</label>
                            <Input 
                                placeholder="https://portfolio.com" 
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="bg-slate-50"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={isAdding} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        {isAdding ? "Adding..." : "Add Link"}
                    </Button>
                </form>
            </CardContent>
        </Card>

        {/* Links List */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Your Links</h2>
            {links.length === 0 && (
                <Card className="p-12 text-center bg-white/50 border-dashed">
                    <p className="text-slate-500">No links yet. Add one above to get started!</p>
                </Card>
            )}
            {links.map((link) => (
                <Card key={link.id} className="p-4 flex items-center gap-4 bg-white hover:shadow-md transition-shadow group border-l-4 border-l-indigo-400">
                    <div className="cursor-move text-slate-300 group-hover:text-slate-400">
                        <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h3 className="font-semibold text-slate-900 truncate">{link.title}</h3>
                        <p className="text-sm text-slate-500 truncate">{link.url}</p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} className="hover:bg-red-50 text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
