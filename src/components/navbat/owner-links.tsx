import { Library, PenSquare } from "lucide-react";
import Link from "next/link";
import { createNewDraftAction } from "@/lib/actions/blog-actions";
import { isBlogOwner } from "@/lib/auth";
import { Button } from "../ui/button";

export default async function OwnerLinks() {
  const isBlogOwnerResults = await isBlogOwner();
  if (isBlogOwnerResults)
    return (
      <>
        <Link href="/drafts">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-muted-foreground hover:text-white gap-2"
          >
            <Library className="w-4 h-4" /> Drafts
          </Button>
        </Link>
        <form action={createNewDraftAction}>
          <Button
            size="sm"
            variant="outline"
            type="submit"
            className="hidden sm:inline-flex border-primary/40 hover:bg-primary/10 gap-2"
          >
            <PenSquare className="w-4 h-4" /> Draft Blog
          </Button>
        </form>
        <div className="h-4 w-px bg-border hidden sm:block"></div>
      </>
    );
}
