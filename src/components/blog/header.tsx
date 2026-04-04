export default async function Header({
  blogTitlePromise,
}: {
  blogTitlePromise: Promise<string>;
}) {
  const blogTitle = await blogTitlePromise;
  return (
    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
      {blogTitle}
    </h1>
  );
}
