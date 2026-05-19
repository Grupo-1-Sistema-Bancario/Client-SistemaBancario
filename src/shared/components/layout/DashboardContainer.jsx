import { useState, useRef } from "react"
import Navbar from "./Navbar.jsx"
import Sidebar from "./Sidebar.jsx"
import { Background } from "./Background.jsx"
import { useParallaxEngine } from "../../../features/auth/hooks/useParallaxEngine.js"

export const DashboardContainer = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const canvasRef = useRef(null)

  useParallaxEngine(canvasRef, null)

  return (
    <div className="relative h-screen flex overflow-hidden bg-[#0D0618]">
     
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
        <Background />
      </div>

      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-8 bg-transparent relative">
          {children}
        </main>
      </div>

    </div>
  )
}