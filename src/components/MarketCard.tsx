import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users, Droplets, Wheat, DollarSign, Truck, Gavel } from "lucide-react";

interface MarketCardProps {
  id: number;
  title: string;
  description: string;
  type: "weather" | "crop" | "price" | "trade" | "policy";
  totalStaked: string;
  yesPercentage: number;
  noPercentage: number;
  timeLeft: string;
  participants: number;
  region: string;
  yesOdds?: number;
  noOdds?: number;
  status?: "Open" | "Resolving" | "Closed";
  isResolved?: boolean;
}

const MarketCard = ({
  id,
  title,
  description,
  type,
  totalStaked,
  yesPercentage,
  noPercentage,
  timeLeft,
  participants,
  region,
  status,
  isResolved,
}: MarketCardProps) => {
  const navigate = useNavigate();
  
  const handleJoinMarket = () => {
    navigate(`/market/${id}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case "crop":
        return <Wheat className="w-5 h-5 text-green-500" />;
      case "price":
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      case "trade":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "policy":
        return <Gavel className="w-5 h-5 text-red-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "weather":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "crop":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "price":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "trade":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "policy":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card className="group bg-gradient-card border-card-border hover:shadow-hover transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      {/* Resolved banner */}
      {isResolved || status === "Closed" ? (
        <div className="bg-red-500 text-white text-xs font-semibold px-3 py-1">Resolved</div>
      ) : null}
      {/* Header with icon and type */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon(type)}
            <Badge className={getTypeColor(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
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
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleJoinMarket}
          disabled={isResolved || status === "Closed"}
        >
          {isResolved || status === "Closed" ? "Market Closed" : "Join Market"}
        </Button>
      </div>
    </Card>
  );
};

export default MarketCard;