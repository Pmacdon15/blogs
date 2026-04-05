"use client";

import { Globe, Loader2, Save, Trash, Upload } from "lucide-react";
import { use, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImageAction } from "@/lib/actions/upload-actions";
import { compressImage } from "@/lib/compress-image";
import type { Blog } from "@/lib/dal/blogs";
import {
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useUpdateBlogMutation,
} from "@/lib/mutations/blog-mutations";

export function EditBlogMetadataForm({
  blogIdPromise,
  promise,
}: {
  blogIdPromise: Promise<string>;
  promise: Promise<Blog | null>;
}) {
  const blog = use(promise);
  const deleteMutation = useDeleteBlogMutation();
  const publishMutation = usePublishBlogMutation();
  const updateMutation = useUpdateBlogMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const coverUrlRef = useRef<HTMLInputElement>(null);

  const blogId = use(blogIdPromise);

  if (!blog) {
    return (
      <div className="text-destructive font-mono mb-10">
        Cannot load sequence metadata from DB
      </div>
    );
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await uploadImageAction(formData);
      if (res.success && res.url) {
        // Set the URL in the hidden input
        if (coverUrlRef.current) {
          coverUrlRef.current.value = res.url;
        }
        setCoverPreview(res.url);
        toast.success("Cover image uploaded", {
          description: "Don't forget to Commit Config to save.",
        });
      } else {
        toast.error(("error" in res ? res.error : null) || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed", { description: String(err) });
    } finally {
      setIsUploading(false);
    }
  };

  const currentCover = coverPreview || blog.cover_image_url;

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
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full md:w-auto"
                  disabled={deleteMutation.isPending}
                />
              }
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash className="w-4 h-4 mr-2" />
              )}
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this sequence and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    deleteMutation.mutate(blogId);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            type="button"
            variant={blog.published ? "secondary" : "default"}
            disabled={publishMutation.isPending}
            className={`w-full md:w-auto ${
              !blog.published && "shadow-[0_0_20px_rgba(var(--primary),0.3)]"
            }`}
            onClick={() => {
              publishMutation.mutate(blogId);
            }}
          >
            {publishMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            {blog.published ? "Update Live State" : "Publish to World"}
          </Button>
        </div>
      </div>

      {/* Cover Image Preview */}
      {currentCover && (
        <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden border border-border/30 bg-muted/20">
          <img
            src={currentCover}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-3 left-3 text-[10px] font-mono uppercase tracking-widest text-white/70 bg-black/40 px-2 py-1 rounded-sm backdrop-blur-sm">
            Cover Preview
          </span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const title = formData.get("title") as string;
          const cover = formData.get("coverUrl") as string;
          updateMutation.mutate({
            blogId,
            title,
            coverImageUrl: cover || null,
          });
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Master Title
            </label>
            <Input
              id="title"
              key={blog.title}
              name="title"
              defaultValue={blog.title}
              className="bg-muted/40 border-border/50 text-white font-medium h-12"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="coverUrl"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Cover Topology URI
            </label>
            <div className="flex gap-2">
              <Input
                id="coverUrl"
                ref={coverUrlRef}
                key={currentCover || "empty"}
                name="coverUrl"
                defaultValue={currentCover || ""}
                placeholder="https://..."
                className="bg-muted/40 border-border/50 font-mono text-sm h-12 flex-1"
              />
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all"
                disabled={isUploading}
                onClick={() => coverInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-border/40">
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={updateMutation.isPending}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Commit Config
          </Button>
        </div>
      </form>
    </div>
  );
}
