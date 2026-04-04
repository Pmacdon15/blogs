import { getBlogById } from "@/dal/blog-dal";

export default function BlogPage(props: PageProps<"/blog/[id]">) {
  const blogPromise = props.params.then((params) =>
    getBlogById(Array.isArray(params.id) ? params.id[0] : params.id),
  );
  return <>Content</>;
}
