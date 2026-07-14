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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
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

function SidebarContent({ user }: { user: any }) {
  const pathname = usePathname()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || "Kullanıcı";
  const userName = user?.user_metadata?.user_name ? `@${user.user_metadata.user_name}` : "@kullanici";
  const initials = fullName.substring(0, 2).toUpperCase();

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
            {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">
              {fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userName}
            </p>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive">
            <LogOut className="size-4" />
            <span className="sr-only">Çıkış Yap</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ user }: { user?: any }) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
      <SidebarContent user={user} />
    </aside>
  )
}

export function MobileSidebar({ user }: { user?: any }) {
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
        <SidebarContent user={user} />
      </SheetContent>
    </Sheet>
  )
}
