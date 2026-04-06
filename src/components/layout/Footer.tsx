import { Mail } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "../icons.github";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 Pat's Blogs</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="mailto:patrick@patmac.ca"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>patrick@patmac.ca</span>
            </Link>
            <Link
              href="https://github.com/pmacdon15"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>pmacdon15</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
