"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MobileSidebar } from "@/components/shared/sidebar"

export default function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-card px-4 md:px-6">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-3 md:hidden">
        <MobileSidebar />
        <span className="text-xl font-bold text-primary">Kivona</span>
      </div>

      {/* Desktop: page title area (flexible) */}
      <div className="hidden md:flex flex-1 items-center">
        {/* Page title can be added here via props later */}
      </div>

      {/* Mobile spacer to push avatar right */}
      <div className="flex-1 md:hidden" />

      {/* User avatar (always visible) */}
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>KU</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
