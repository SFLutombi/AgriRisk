import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
}

const StatsCard = ({ title, value, description, icon: Icon, trend, trendPositive }: StatsCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-card-border hover:shadow-hover transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            {trend && (
              <p className={`text-xs flex items-center space-x-1 ${
                trendPositive ? 'text-success' : 'text-destructive'
              }`}>
                <span>{trend}</span>
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="w-12 h-12 bg-primary-soft rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;