import Sidebar from "@/components/shared/sidebar"
import Navbar from "@/components/shared/navbar"
import { createClient } from "@/lib/supabase/server"
import { NameOnboarding } from "@/components/shared/name-onboarding"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="flex h-screen">
      <NameOnboarding user={user} />
      {/* Desktop sidebar — fixed left */}
      <Sidebar user={user} />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col md:pl-64">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
