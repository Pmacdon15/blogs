"use client";

import { use, useTransition } from "react";
import { Blog } from "@/lib/dal/blogs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateBlogAction, publishBlogAction } from "@/lib/actions/blog-actions";
import { toast } from "sonner";
import { Globe, Save, Loader2 } from "lucide-react";

export function EditBlogMetadataForm({
  blogId,
  promise,
}: {
  blogId: string;
  promise: Promise<Blog | null>;
}) {
  const blog = use(promise);
  const [isPublishing, startPublish] = useTransition();

  if (!blog) {
    return (
      <div className="text-destructive font-mono mb-10">
        Cannot load sequence metadata from DB
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-card border border-border/40 shadow-xl relative z-20">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex flex-col md:flex-row gap-4 items-start md:items-center">
            Config Panel
            {blog.published && (
              <span className="text-xs font-bold tracking-widest bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full whitespace-nowrap">
                LIVE
              </span>
            )}
           {!blog.published && (
              <span className="text-xs font-bold tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full whitespace-nowrap">
                DRAFT
              </span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            type="button"
            variant={blog.published ? "secondary" : "default"}
            disabled={isPublishing}
            className={`w-full md:w-auto ${
               !blog.published && 'shadow-[0_0_20px_rgba(var(--primary),0.3)]'
            }`}
            onClick={() => {
              startPublish(async () => {
                const res = await publishBlogAction(blogId);
                if (res.success) {
                  toast.success("Sequence is now published globally!");
                } else {
                  toast.error(res.error || "Failed to publish");
                }
              });
            }}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            {blog.published ? "Update Live State" : "Publish to World"}
          </Button>
        </div>
      </div>

      <form
        action={async (fd) => {
          const title = fd.get("title") as string;
          const cover = fd.get("coverUrl") as string;
          const res = await updateBlogAction(blogId, title, cover || null);
          if (res.success) toast.success("Configuration preserved");
          else if ('error' in res) toast.error(res.error as string || "Failed to save configuration");
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Master Title
            </label>
            <Input
              key={blog.title}
              name="title"
              defaultValue={blog.title}
              className="bg-muted/40 border-border/50 text-white font-medium h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Cover Topology URI
            </label>
            <Input
              key={blog.cover_image_url || 'empty'}
              name="coverUrl"
              defaultValue={blog.cover_image_url || ""}
              placeholder="https://..."
              className="bg-muted/40 border-border/50 font-mono text-sm h-12"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-border/40">
          <Button type="submit" variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Save className="w-4 h-4 mr-2" /> Commit Config
          </Button>
        </div>
      </form>
    </div>
  );
}
