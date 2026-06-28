"use client";

import { Menu, CalendarCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
  onBook: () => void;
}

export function MobileNav({ navLinks, onBook }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden size-11 min-h-11 min-w-11 shrink-0"
          aria-label="فتح القائمة"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,280px)] gap-0 p-0">
        <SheetHeader className="border-b border-border/60 px-5 py-4 text-right">
          <SheetTitle className="text-base font-extrabold">تصفح الموقع</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-0.5 px-3 py-4">
          {navLinks.map((link) => (
            <SheetClose key={link.href} asChild>
              <a
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted/60 active:bg-muted transition-colors min-h-11"
              >
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                {link.label}
              </a>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto border-t border-border/60 px-4 py-4 flex flex-col gap-2">
          <SheetClose asChild>
            <Button
              variant="outline"
              className="h-11 w-full gap-2"
              onClick={onBook}
            >
              <Phone className="size-4" />
              استشارة مجانية
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button className="h-11 w-full gap-2" onClick={onBook}>
              <CalendarCheck className="size-4" />
              احجز الآن
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
