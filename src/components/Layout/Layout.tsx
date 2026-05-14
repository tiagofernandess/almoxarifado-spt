
import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <AppSidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6 bg-sorte-lightGray/30">
          {children}
        </main>
      </div>
    </div>
  );
}
