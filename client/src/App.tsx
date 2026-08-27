import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar'
import { BotIcon, ChevronRightIcon, HomeIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, UsersIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { type ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { MainDashboard } from './pages/main.dashboard'
import { ProvidersDashboard } from './pages/providers.dashboard'
import { AgentsDashboard } from './pages/agents.dashboard'


const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { title: 'Providers', path: '/providers', icon: UsersIcon },
  { title: 'Agents', path: '/agents', icon: BotIcon },
]

type AppRoute = {
  path: string
  element: ReactNode
}

const app_routes: AppRoute[] = [
  { element: <MainDashboard />, path: '/dashboard' },
  { element: <ProvidersDashboard />, path: '/providers' },
  { element: <AgentsDashboard />, path: '/agents' },
]

function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <SidebarProvider style={{ '--sidebar-width': '15rem' } as CSSProperties}>
      <div className="flex h-svh w-full overflow-hidden bg-card">
        {/* Sidebar */}
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader className="flex flex-row items-center gap-2 px-3 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[7px] border border-primary/20 bg-gradient-to-br from-primary to-primary/80 p-2 shadow-md">
              <BotIcon className="size-full rounded-sm text-primary-foreground" />
            </div>
            <div className="flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold leading-tight">Agentic Kanban</span>
            </div>
          </SidebarHeader>

          <SidebarSeparator className="mx-auto"/>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(item => {
                    const isActive = pathname === item.path
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          render={<Link to={item.path} />}
                          tooltip={item.title}
                          isActive={isActive}
                          className="rounded-lg transition-all duration-200 ease-in-out data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary data-[active=true]:border-l-2 data-[active=true]:border-primary data-[active=true]:pl-[14px]"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          {isActive && (
                            <ChevronRightIcon className="ml-auto size-4 text-primary" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarRail />

        {/* Page content */}
        <SidebarInset className="min-h-0 overflow-hidden p-1">
          <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
            <SidebarToggle />
          </div>
          <Routes>
            <Route path='/' element={<Navigate to={'/dashboard'} replace/>}/>
            {app_routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function SidebarToggle() {
  const { toggleSidebar, state } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label={state === 'expanded' ? 'Minimize sidebar' : 'Expand sidebar'}
      title={state === 'expanded' ? 'Minimize sidebar' : 'Expand sidebar'}
    >
      {state === 'expanded' ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
    </Button>
  )
}

export default function Root() {
  return (
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
  )
}
