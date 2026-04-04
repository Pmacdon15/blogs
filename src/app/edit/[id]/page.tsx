import { EditBlogMetadataForm } from "@/components/editor/EditBlogMetadataForm";
import SectionEditor from "@/components/editor/SectionEditor";
import { getBlogById, getBlogSections } from "@/lib/dal/blogs";

export default async function EditBlogPage(props: PageProps<"/edit/[id]">) {
  const { id } = await props.params;

  const blogPromise = getBlogById(id).then((res) => {
    if (res.error || !res.data) return null;
    return res.data;
  });

  const sectionsDataPromise = getBlogSections(id).then((res) =>
    res.error == null && res.data ? res.data : [],
  );

  return (
    <main className="flex min-h-screen flex-col text-foreground bg-background selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full px-6 py-16 relative z-10">
        <EditBlogMetadataForm blogId={id} promise={blogPromise} />

        <div className="flex flex-col gap-3 mb-10 mt-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            Structural Sequence
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Structure, order, and present your abstract thoughts into visual
            blocks.
          </p>
        </div>

        <SectionEditor blogId={id} promise={sectionsDataPromise} />
      </div>
    </main>
  );
}
