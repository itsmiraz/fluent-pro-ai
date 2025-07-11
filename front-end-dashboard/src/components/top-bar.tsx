"use client"

import { Bell, ChevronDown, Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopBarProps {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  isMobile: boolean
  onSignOut: () => void
}

export function TopBar({ onToggleSidebar, isMobile, onSignOut }: TopBarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 md:h-16 items-center justify-between border-b bg-background px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8 md:h-8 md:w-8">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-semibold">Hi, Miraj 👋</h1>
          <Badge
            variant="secondary"
            className="hidden sm:inline-flex bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs"
          >
            🔥 7 Day Streak
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Streak badge for mobile */}
        <Badge
          variant="secondary"
          className="sm:hidden bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs px-2 py-1"
        >
          🔥 7
        </Badge>

        <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3 rounded-full bg-red-500"></span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 md:h-9 md:w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 md:gap-2 h-8 md:h-9 px-2 md:px-3">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="text-xs">MR</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 md:h-4 md:w-4 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
