import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Application Monitoring System
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Welcome, {user.name} ({user.role})
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 border-r">
          <nav className="p-4 space-y-2">
            <Link href="/" className={`flex items-center p-2 rounded-md ${router.pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-gray-200"}`}>
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>

            {(user.role === "admin" || user.role === "staff") && (
              <Link href="/applications" className={`flex items-center p-2 rounded-md ${router.pathname === "/applications" ? "bg-primary/10 text-primary" : "hover:bg-gray-200"}`}>
                <FileText className="h-5 w-5 mr-3" />
                Applications
              </Link>
            )}

            {user.role === "admin" && (
              <Link href="/applications/new" className={`flex items-center p-2 rounded-md ${router.pathname === "/applications/new" ? "bg-primary/10 text-primary" : "hover:bg-gray-200"}`}>
                <PlusCircle className="h-5 w-5 mr-3" />
                New Application
              </Link>
            )}

            {user.role === "admin" && (
              <Link href="/users" className={`flex items-center p-2 rounded-md ${router.pathname === "/users" ? "bg-primary/10 text-primary" : "hover:bg-gray-200"}`}>
                <Users className="h-5 w-5 mr-3" />
                Users
              </Link>
            )}

            <Link href="/settings" className={`flex items-center p-2 rounded-md ${router.pathname === "/settings" ? "bg-primary/10 text-primary" : "hover:bg-gray-200"}`}>
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
