"use client";
import { useQuery } from "@tanstack/react-query";
import { Library, PenSquare } from "lucide-react";
import Link from "next/link";
import { createNewDraftAction } from "@/lib/actions/blog-actions";
import { Button } from "../ui/button";
export function useIsBlogOwner() {
  return useQuery({
    queryKey: ["blog-owner"],
    queryFn: async () => {
      const res = await fetch("/api/blog-owner");
      if (!res.ok) throw new Error("Failed to fetch owner status");
      const data = await res.json();
      return data.isOwner as boolean;
    },
    // Prevent excessive re-fetches since ownership rarely changes mid-session
    staleTime: 1000 * 60 * 5,
  });
}
export default function OwnerLinks() {
  const isBlogOwnerResults = useIsBlogOwner();
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
