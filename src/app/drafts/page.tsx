import { getDrafts } from '@/lib/dal/blogs';
import { Suspense } from 'react';
import { BlogListServer } from '@/components/blogs/BlogListServer';
import { Skeleton } from '@/components/ui/skeleton';
import { Library } from "lucide-react";

export default function DraftsPage() {
  const draftsPromise = getDrafts();

  return (
    <main className="flex min-h-screen flex-col text-foreground bg-background relative overflow-hidden selection:bg-primary/30">
      <div className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 lg:py-32 flex flex-col gap-16 relative z-10">
        <div className="flex flex-col gap-6 text-center md:text-left max-w-3xl">
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white/90 to-white/30 bg-clip-text text-transparent flex flex-col md:flex-row items-center gap-4 md:gap-6 drop-shadow-sm">
             <Library className="w-12 h-12 md:w-16 md:h-16 text-primary/80" /> Your Drafts
           </h1>
           <p className="text-muted-foreground text-xl md:text-2xl font-light leading-relaxed">
             Unpublished sequences, active workspaces, and concepts in progress.
           </p>
        </div>

        <div className="w-full flex-col flex gap-8">
           <Suspense fallback={
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <Skeleton className="h-[320px] w-full rounded-2xl bg-card border border-border/20 shadow-lg" />
               <Skeleton className="h-[320px] w-full rounded-2xl bg-card border border-border/20 shadow-lg" />
             </div>
           }>
             <BlogListServer promise={draftsPromise} prefix="/edit" />
           </Suspense>
        </div>
      </div>
    </main>
  );
}
