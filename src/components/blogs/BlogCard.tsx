import { Blog } from '@/lib/dal/blogs';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

export function BlogCard({ blog, prefix = "/blog" }: { blog: Blog, prefix?: string }) {
  return (
    <Link href={`${prefix}/${blog.id}`} className="group block h-full">
      <Card className="h-full bg-card/40 backdrop-blur-md border-border/40 hover:bg-card/60 transition-all duration-500 hover:border-primary/40 overflow-hidden flex flex-col group-hover:-translate-y-2 shadow-xl shadow-black/10 hover:shadow-primary/5">
        <div className="aspect-[4/3] w-full overflow-hidden relative bg-muted/30">
           {blog.cover_image_url ? (
             <img 
               src={blog.cover_image_url} 
               alt={blog.title} 
               className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
             />
           ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
           )}
           {/* Glassmorphic gradient overlay */}
           <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <CardHeader className="pt-2 pb-2 z-10 -mt-12">
           <CardTitle className="text-xl md:text-2xl font-bold leading-tight line-clamp-2 drop-shadow-md">
             {blog.title}
           </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end pt-4">
           <div className="text-sm text-muted-foreground flex items-center justify-between font-medium">
             <span>{new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
             <span className="flex items-center gap-1 text-primary/70 group-hover:text-primary transition-colors">
               Read <ArrowUpRight className="h-4 w-4" />
             </span>
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}
