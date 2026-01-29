import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-white/50">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2 animate-pulse">
          <div className="h-24 w-24 rounded-full bg-slate-200"></div>
          <div className="h-8 w-32 bg-slate-200 rounded"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-16 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
