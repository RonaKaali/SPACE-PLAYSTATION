import { Gamepad2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Dibangun dengan <span className="text-primary">❤️</span> oleh tim SPACE STATION.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} SPACE STATION. Semua Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
