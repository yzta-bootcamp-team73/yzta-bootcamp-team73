import { UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeamPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-subtle-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md gap-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border border-border">
          <UsersRound className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
            Yakında
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Takım Çalışma Alanı
          </h1>
          <p className="text-muted-foreground">
            Takımını kurduktan sonra burası senin çalışma alanın olacak. Kanban panosu, fikir havuzu ve daha fazlası.
          </p>
        </div>
      </div>
    </div>
  );
}
