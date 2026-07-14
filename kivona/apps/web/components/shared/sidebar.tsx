"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Compass,
  Users,
  UsersRound,
  User,
  LogOut,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "/discover", label: "Keşfet", icon: Compass },
  { href: "/match", label: "Eşleşme", icon: Users },
  { href: "/team", label: "Takımım", icon: UsersRound },
  { href: "/profile", label: "Profilim", icon: User },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/discover" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Kivona</span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>KU</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">
              Kullanıcı
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @kullanici
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive">
            <LogOut className="size-4" />
            <span className="sr-only">Çıkış Yap</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" />
        }
      >
        <Menu className="size-5" />
        <span className="sr-only">Menüyü aç</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigasyon Menüsü</SheetTitle>
        </SheetHeader>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}
