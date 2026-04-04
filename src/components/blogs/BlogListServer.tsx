import type { Blog, FetchResult } from "@/lib/dal/blogs";
import { BlogCard } from "./BlogCard";

export async function BlogListServer({
  promise,
  prefix = "/blog",
}: {
  promise: Promise<FetchResult<Blog[]>>;
  prefix?: string;
}) {
  const result = await promise;

  if (result.error != null || !result.data) {
    return (
      <div className="p-8 border border-destructive/30 bg-destructive/5 rounded-2xl text-destructive text-center font-medium backdrop-blur-sm">
        <p>We encountered an anomaly retrieving your feed.</p>
        <p className="text-xs mt-2 opacity-70 font-mono">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {result.data.map((blog) => (
        <BlogCard key={blog.id} blog={blog} prefix={prefix} />
      ))}
    </div>
  );
}
