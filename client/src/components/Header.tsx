import { Code, History, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/ThemeProvider";

export default function Header() {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-card border-b border-slate-200 dark:border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">
                Code Plagiarism Detector
              </h1>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant={location === "/" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <Code className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </Link>

              <Link href="/history">
                <Button
                  variant={location === "/history" ? "default" : "ghost"}
                  size="sm"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-muted-foreground">
                MOSS Winnowing Algorithm
              </span>
              <div
                className="w-2 h-2 bg-accent rounded-full"
                title="Live status indicator"
              />
            </div>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-slate-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
