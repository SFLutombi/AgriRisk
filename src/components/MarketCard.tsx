import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users, Droplets, Wheat } from "lucide-react";

interface MarketCardProps {
  title: string;
  description: string;
  type: "weather" | "crop";
  totalStaked: string;
  yesPercentage: number;
  noPercentage: number;
  timeLeft: string;
  participants: number;
  region: string;
}

const MarketCard = ({
  title,
  description,
  type,
  totalStaked,
  yesPercentage,
  noPercentage,
  timeLeft,
  participants,
  region,
}: MarketCardProps) => {
  return (
    <Card className="group bg-gradient-card border-card-border hover:shadow-hover transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      {/* Header with icon and type */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {type === "weather" ? (
              <div className="w-8 h-8 bg-accent-soft rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 text-accent" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-success-soft rounded-lg flex items-center justify-center">
                <Wheat className="w-4 h-4 text-success" />
              </div>
            )}
            <Badge variant={type === "weather" ? "secondary" : "outline"} className="capitalize">
              {type} Market
            </Badge>
          </div>
          <Badge variant="outline" className="text-xs">
            {region}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>

        {/* Prediction percentages */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prediction split</span>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>{totalStaked} staked</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-success">Yes</span>
              <span className="text-sm font-bold text-success">{yesPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-success h-2 rounded-full transition-all duration-500"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-destructive">No</span>
              <span className="text-sm font-bold text-destructive">{noPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-destructive h-2 rounded-full transition-all duration-500"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Market stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{participants} participants</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{timeLeft}</span>
          </div>
        </div>

        {/* Action button */}
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          Join Market
        </Button>
      </div>
    </Card>
  );
};

export default MarketCard;