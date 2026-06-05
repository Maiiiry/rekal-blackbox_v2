import SidebarNav from './SidebarNav'

const WebLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <SidebarNav />
      <main className="ml-60 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default WebLayout
