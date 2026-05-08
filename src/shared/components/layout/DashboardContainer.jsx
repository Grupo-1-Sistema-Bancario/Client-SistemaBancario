import { useState } from "react"
import Navbar from "./Navbar.jsx"
import Sidebar from "./Sidebar.jsx"
import { CoinBackground } from "./CoinBackground.jsx"

export const DashboardContainer = ({ children }) => {
  // Estado compartido: el botón hamburger del Navbar controla el sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-[#0D0618]">

      <CoinBackground />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            externalOpen={sidebarOpen}
            onExternalClose={() => setSidebarOpen(false)}
            onPin={(pinned) => { if (pinned) setSidebarOpen(true) }}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-transparent">
            {children}
          </main>
        </div>
      </div>

    </div>
  )
}   