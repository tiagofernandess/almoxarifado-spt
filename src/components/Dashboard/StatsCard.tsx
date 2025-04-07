
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  change?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  change,
}: StatsCardProps) {
  return (
    <Card className="card-transition">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-sorte-blue" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {typeof change === "number" && (
          <div className="flex items-center pt-1">
            <span
              className={`text-xs ${change >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              em relação ao mês anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
