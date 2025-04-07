
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChartBig,
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LogOut,
  Package,
  Printer,
  RefreshCw,
  Tag,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Itens", href: "/items", icon: Package },
    { name: "Vendedores", href: "/sellers", icon: User },
    { name: "Saída de Itens", href: "/checkout", icon: ClipboardList },
    { name: "Devolução", href: "/return", icon: RefreshCw },
    { name: "Etiquetas", href: "/labels", icon: Tag },
    { name: "Relatórios", href: "/reports", icon: BarChartBig },
  ];

  return (
    <Sidebar
      expanded={expanded}
      onExpandedChange={setExpanded}
      className="border-r border-r-sorte-lightGray"
    >
      <SidebarHeader className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2 px-4">
          {expanded ? (
            <div className="flex items-center gap-2">
              <Box className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Sorte ParaTodos</span>
            </div>
          ) : (
            <Box className="h-6 w-6 text-white mx-auto" />
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-full hover:bg-sidebar-accent transition-colors"
        >
          {expanded ? (
            <ChevronLeft className="h-5 w-5 text-white" />
          ) : (
            <ChevronRight className="h-5 w-5 text-white" />
          )}
        </button>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  expanded ? "justify-start" : "justify-center",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <item.icon className={cn("h-5 w-5", expanded ? "" : "mx-auto")} />
              {expanded && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-4">
        <NavLink
          to="/logout"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            expanded ? "justify-start" : "justify-center",
            "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <LogOut className={cn("h-5 w-5", expanded ? "" : "mx-auto")} />
          {expanded && <span>Sair</span>}
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
}
