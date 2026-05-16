import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Image as ImageIcon,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Students", url: "/admin/students", icon: Users },
  { title: "Staff", url: "/admin/staff", icon: GraduationCap },
  { title: "Academics", url: "/admin/academics", icon: BookOpen },
  { title: "Branches", url: "/admin/branches", icon: Building2 },
];

const contentItems = [
  { title: "Gallery", url: "/admin/gallery", icon: ImageIcon },
  { title: "Enquiries", url: "/admin/enquiries", icon: MessageSquare },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={isActive(item.url)}
          tooltip={item.title}
          className="h-10 hover:bg-transparent data-[active=true]:bg-transparent"
        >
          <NavLink
            to={item.url}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 transition-smooth ${
                isActive
                  ? "bg-primary-foreground text-primary font-semibold shadow-card"
                  : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="text-sm">{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="gradient-primary text-primary-foreground gap-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground/50 text-[11px] tracking-widest uppercase">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground/50 text-[11px] tracking-widest uppercase">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">{renderItems(contentItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
