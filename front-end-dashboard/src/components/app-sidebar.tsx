"use client";

import {
  BookOpen,
  Brain,
  Home,
  MessageCircle,
  Play,
  Settings,
  Target,
  TrendingUp,
  Video,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import Link from "next/link";

const menuItems = [
  {
    title: "Dashboard",
    key: "dashboard",
    link: "/dashboard",
    icon: Home,
  },
  {
    title: "Talk with AI",
    key: "practice-room",
    icon: MessageCircle,
    link: "/talk-with-ai",
    badge: "AI Voice",
  },
  {
    title: "Pronunciation",
    key: "pronunciation",
    icon: Volume2,
    link: "/pronunciation",
    badge: "New",
  },
  {
    title: "Vocabulary",
    key: "vocabulary",
    link: "/vocabulary",
    icon: BookOpen,
  },
  {
    title: "Situations",
    key: "situations",
    link: "/situations",
    icon: Target,
  },
  {
    title: "Video Lessons",
    key: "video-lessons",
    link: "/video-lessons",
    icon: Video,
  },
  {
    title: "IELTS Mode",
    key: "ielts-mode",
    link: "/ilts",
    icon: Brain,
  },
  {
    title: "Progress & Stats",
    key: "progress-stats",
    link: "/progress-stats",
    icon: TrendingUp,
  },
];

interface AppSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AppSidebar({
  activeView,
  setActiveView,
  collapsed,
  isMobile,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  // Close mobile sidebar when clicking outside
  useEffect(() => {
    if (isMobile && mobileOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.getElementById("mobile-sidebar");
        if (sidebar && !sidebar.contains(event.target as Node)) {
          onMobileClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile, mobileOpen, onMobileClose]);

  const handleMenuClick = (key: string) => {
    setActiveView(key);
    if (isMobile) {
      onMobileClose();
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onMobileClose}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          id="mobile-sidebar"
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-border transition-transform duration-300 ease-in-out md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Play className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-sidebar-foreground">
                  FluentAI
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  Learn English
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 p-2 overflow-y-auto">
            <div className="space-y-1">
              <div className="text-xs font-medium text-sidebar-foreground/70 px-2 py-1">
                Navigation
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.key;

                return (
                  <Link key={item.key} href={item.link}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-11 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      )}
                      // onClick={() => handleMenuClick(item.key)}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-2 py-0.5 text-xs",
                            item.badge === "New"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Settings */}
          <div className="p-2 border-t border-border">
            <Link href={"/settings"}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-11 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  activeView === "settings" &&
                    "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
                // onClick={() => handleMenuClick("settings")}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className={cn(
        "bg-sidebar border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Desktop Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
            <Play className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-sidebar-foreground truncate">
                FluentAI
              </span>
              {/* <span className="text-xs text-sidebar-foreground/70 truncate">
                Learn English
              </span> */}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="flex-1 p-2">
        <div className="space-y-1">
          <div
            className={cn(
              "text-xs font-medium text-sidebar-foreground/70 px-2 py-1",
              collapsed && "sr-only"
            )}
          >
            Navigation
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;

            return (
              <Link key={item.key} href={item.link}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 h-10 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    collapsed && "justify-center px-0"
                  )}
                  // onClick={() => setActiveView(item.key)}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-2 py-0.5 text-xs",
                            item.badge === "New"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Settings */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 h-10 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            activeView === "settings" &&
              "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
            collapsed && "justify-center px-0"
          )}
          onClick={() => setActiveView("settings")}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="truncate">Settings</span>}
        </Button>
      </div>
    </div>
  );
}
