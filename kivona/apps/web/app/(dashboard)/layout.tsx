import Sidebar from "@/components/shared/sidebar"
import Navbar from "@/components/shared/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      {/* Desktop sidebar — fixed left */}
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col md:pl-64">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
