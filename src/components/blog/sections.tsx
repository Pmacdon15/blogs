import Image from "next/image";
import type { BlogSection, FetchResult } from "@/lib/dal/blogs";

export default async function Sections({
  sectionsPromise,
}: {
  sectionsPromise: Promise<FetchResult<BlogSection[]>>;
}) {
  const sections = await sectionsPromise;
  return (
    <div className="flex flex-col gap-10 mt-8 text-lg font-light leading-relaxed text-foreground/90">
      {sections.error === null && sections.data.length === 0 && (
        <p className="italic text-muted-foreground font-mono text-sm opacity-50">
          No structural sections found...
        </p>
      )}

      {sections.error !== null && (
        <p className="italic text-destructive font-mono text-sm opacity-50">
          Error loading sections...
        </p>
      )}

      {sections.data
        ?.sort((a, b) => a.order_index - b.order_index)
        .map((sec) => (
          <section key={sec.id} className="w-full">
            {sec.type === "title" && (
              <h2 className="text-3xl font-bold text-white mt-6 tracking-tight">
                {sec.content}
              </h2>
            )}
            {sec.type === "paragraph" && (
              <div className="flex flex-col gap-3">
                {sec.sub_title && (
                  <h3 className="text-xl font-semibold text-white/90">
                    {sec.sub_title}
                  </h3>
                )}
                <p className="whitespace-pre-wrap">{sec.content}</p>
              </div>
            )}
            {sec.type === "image" && (
              <div className="my-8 rounded-xl overflow-hidden border border-border/20 shadow-xl bg-muted/20">
                <Image
                  src={sec.content}
                  alt={sec.sub_title || "Section Image"}
                  className="w-full max-h-[80vh] object-contain"
                />
                {sec.sub_title && (
                  <p className="text-center text-sm text-muted-foreground mt-3 mb-3">
                    {sec.sub_title}
                  </p>
                )}
              </div>
            )}
            {sec.type === "code" && (
              <div className="my-6 relative rounded-xl overflow-hidden border border-border/20 bg-[#0d1117] p-6 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  {sec.sub_title && (
                    <span className="ml-4 font-mono text-xs text-white/40">
                      {sec.sub_title}
                    </span>
                  )}
                </div>
                <pre className="mt-8 overflow-x-auto text-sm font-mono text-blue-300">
                  <code>{sec.content}</code>
                </pre>
              </div>
            )}
          </section>
        ))}
    </div>
  );
}
