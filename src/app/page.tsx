import { Suspense } from "react";
import { BlogListServer } from "@/components/blogs/BlogListServer";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlogs } from "@/lib/dal/blogs";

export default function Home() {
  const blogsResultAsync = getBlogs();

  return (
    <main className="flex min-h-screen flex-col text-foreground bg-background relative overflow-hidden selection:bg-primary/30">
      {/* Aesthetic Background Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 lg:py-32 flex flex-col gap-16 relative z-10">
        <div className="flex flex-col gap-6 text-center md:text-left max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-br from-white via-white/90 to-white/30 bg-clip-text text-transparent drop-shadow-sm">
            Pat's Blogs
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl font-light leading-relaxed">
            Welcome to my personal corner of the web. Share, read, and create
            thoughts.
          </p>
        </div>

        <div className="w-full flex-col flex gap-8">
          <div className="flex justify-between items-end border-b border-border/30 pb-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white/90">
              Curated Concepts
            </h2>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-[320px] w-full rounded-2xl bg-card border border-border/20 shadow-lg" />
                <Skeleton className="h-[320px] w-full rounded-2xl bg-card border border-border/20 shadow-lg" />
                <Skeleton className="h-[320px] w-full rounded-2xl bg-card border border-border/20 shadow-lg" />
              </div>
            }
          >
            <BlogListServer promise={blogsResultAsync} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
