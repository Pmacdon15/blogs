import Link from "next/link";
import { isBlogOwner } from "@/lib/auth";
import { Button } from "../ui/button";

export default async function LinkToEditButton({
  blogIdPromise,
}: {
  blogIdPromise: Promise<string>;
}) {
  const isBlogOwnerResult = await isBlogOwner();
  const blogId = await blogIdPromise;
  if (isBlogOwnerResult)
    return (
      <Link href={`/edit/${blogId}`} className="ml-auto">
        <Button>Edit Blog</Button>
      </Link>
    );
  return null;
}
