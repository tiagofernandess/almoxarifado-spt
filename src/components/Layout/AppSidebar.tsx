
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ArrowRightFromLine,
  ArrowLeftFromLine,
  RefreshCw,
  LayoutDashboard,
  FileText,
  Tag,
  ChevronRight,
} from "lucide-react";

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={cn(
      "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      expanded ? "w-64" : "w-20"
    )}>
      <div className="flex items-center h-16 px-4 border-b">
        {expanded ? (
          <div className="text-xl font-bold text-sorte-primary">
            Sorte ParaTodos
          </div>
        ) : (
          <div className="text-xl font-bold text-sorte-primary mx-auto">SP</div>
        )}
      </div>
      
      <div className="overflow-y-auto flex-1 py-4">
        <nav className="px-2 space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" expanded={expanded} />
          <NavItem to="/items" icon={<Package size={20} />} label="Itens" expanded={expanded} />
          <NavItem to="/sellers" icon={<Users size={20} />} label="Vendedores" expanded={expanded} />
          <NavItem to="/checkout" icon={<ArrowRightFromLine size={20} />} label="Saída" expanded={expanded} />
          <NavItem to="/return" icon={<RefreshCw size={20} />} label="Devolução" expanded={expanded} />
          <NavItem to="/labels" icon={<Tag size={20} />} label="Etiquetas" expanded={expanded} />
          <NavItem to="/reports" icon={<FileText size={20} />} label="Relatórios" expanded={expanded} />
        </nav>
      </div>
      
      <div className="border-t p-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex justify-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronRight /> : <ChevronRight className="rotate-180" />}
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
}

function NavItem({ to, icon, label, expanded }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2 text-sm rounded-md",
          isActive
            ? "bg-sorte-primary/10 text-sorte-primary font-medium"
            : "text-gray-600 hover:bg-gray-100",
          !expanded && "justify-center"
        )
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      {expanded && <span className="ml-3">{label}</span>}
    </NavLink>
  );
}
