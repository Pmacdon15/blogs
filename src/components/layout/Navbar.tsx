import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { TerminalSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OwnerLinks from "../navbat/owner-links";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
        <div className="flex gap-6 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <TerminalSquare className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            <span className="font-bold tracking-wider text-lg hidden md:inline-block">
              Pat's Blogs
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <OwnerLinks />

            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 border border-border rounded-full hover:opacity-80 transition-opacity",
                },
              }}
            />
          </Show>
          <Show when="signed-out">
            <SignInButton>
              <Button variant="default" size="sm">
                Log In
              </Button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </nav>
  );
}
