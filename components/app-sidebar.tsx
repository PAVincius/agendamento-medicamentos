"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Icons } from "./icons"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "/app/dashboard/page.tsx",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Starred",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Settings",
          url: "/app/dashboard/page.tsx",
        },
      ],
    },
    {
      title: "Models",
      url: "/app/dashboard/page.tsx",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Explorer",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Quantum",
          url: "/app/dashboard/page.tsx",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/app/dashboard/page.tsx",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Get Started",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Tutorials",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Changelog",
          url: "/app/dashboard/page.tsx",
        },
      ],
    },
    {
      title: "Settings",
      url: "/app/dashboard/page.tsx",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Team",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Billing",
          url: "/app/dashboard/page.tsx",
        },
        {
          title: "Limits",
          url: "/app/dashboard/page.tsx",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/app/dashboard/page.tsx",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/app/dashboard/page.tsx",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/app/dashboard/page.tsx",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/dashboard">
                  <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                    <Icons.logo className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none ">
                    <span className=" font-['Montserrat'] font-thin text-neutral-950 hover:font-normal antialiased animate-in duration-150">AGENDAVAC</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
