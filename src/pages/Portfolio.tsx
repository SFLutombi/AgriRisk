import { useState } from "react";
import { TrendingUp, TrendingDown, Clock, CheckCircle, X, Filter, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";

const Portfolio = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock portfolio data
  const portfolioStats = {
    totalStaked: "R4,250",
    totalWon: "R3,180",
    totalLost: "R890",
    winRate: "74%",
    activeBets: 6,
    resolvedBets: 12
  };

  const bets = [
    {
      id: 1,
      title: "Rainfall > 30mm in Limpopo this week",
      type: "weather",
      prediction: "Yes",
      stake: "R500",
      currentOdds: "68%",
      potentialPayout: "R735",
      status: "active",
      timeLeft: "3 days left",
      region: "Limpopo",
      dateStaked: "2024-01-15"
    },
    {
      id: 2,
      title: "Maize yield above 6 tons/hectare - KZN",
      type: "crop",
      prediction: "No",
      stake: "R300",
      currentOdds: "55%",
      potentialPayout: "R545",
      status: "active",
      timeLeft: "14 days left",
      region: "KwaZulu-Natal",
      dateStaked: "2024-01-10"
    },
    {
      id: 3,
      title: "Temperature exceeds 35°C for 5 consecutive days",
      type: "weather",
      prediction: "Yes",
      stake: "R750",
      finalOdds: "84%",
      actualPayout: "R893",
      status: "won",
      resolvedDate: "2024-01-12",
      region: "Northern Cape",
      dateStaked: "2024-01-05"
    },
    {
      id: 4,
      title: "Sunflower harvest success - Free State",
      type: "crop",
      prediction: "Yes",
      stake: "R400",
      finalOdds: "38%",
      actualPayout: "R0",
      status: "lost",
      resolvedDate: "2024-01-08",
      region: "Free State",
      dateStaked: "2024-01-02"
    },
    {
      id: 5,
      title: "Drought conditions in Western Cape",
      type: "weather",
      prediction: "No",
      stake: "R600",
      finalOdds: "25%",
      actualPayout: "R2,400",
      status: "won",
      resolvedDate: "2024-01-14",
      region: "Western Cape",
      dateStaked: "2024-01-01"
    },
    {
      id: 6,
      title: "Wheat quality premium grade",
      type: "crop",
      prediction: "Yes",
      stake: "R350",
      currentOdds: "59%",
      potentialPayout: "R593",
      status: "active",
      timeLeft: "62 days left",
      region: "Western Cape",
      dateStaked: "2024-01-16"
    }
  ];

  const filteredBets = bets.filter(bet => statusFilter === "all" || bet.status === statusFilter);
  const activeBets = bets.filter(bet => bet.status === "active");
  const resolvedBets = bets.filter(bet => bet.status === "won" || bet.status === "lost");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won": return "text-success";
      case "lost": return "text-destructive";
      case "active": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won": return CheckCircle;
      case "lost": return X;
      case "active": return Clock;
      default: return Clock;
    }
  };

  const BetCard = ({ bet }: { bet: typeof bets[0] }) => {
    const StatusIcon = getStatusIcon(bet.status);
    
    return (
      <Card className="p-6 bg-gradient-card border-card-border hover:shadow-hover transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={bet.type === "weather" ? "secondary" : "outline"} className="capitalize">
                {bet.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {bet.region}
              </Badge>
            </div>
            <h3 className="font-semibold text-card-foreground mb-1 line-clamp-2">
              {bet.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Predicted: <span className="font-medium">{bet.prediction}</span>
            </p>
          </div>
          <div className={`flex items-center gap-1 ${getStatusColor(bet.status)}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{bet.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Stake</p>
            <p className="font-semibold">{bet.stake}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {bet.status === "active" ? "Potential Payout" : "Final Payout"}
            </p>
            <p className="font-semibold">
              {bet.status === "active" ? bet.potentialPayout : bet.actualPayout}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {bet.status === "active" ? bet.timeLeft : `Resolved ${bet.resolvedDate}`}
          </span>
          <span className="text-muted-foreground">
            Odds: {bet.status === "active" ? bet.currentOdds : bet.finalOdds}
          </span>
        </div>

        {bet.status === "won" && (
          <div className="mt-3 p-2 bg-success-soft rounded-lg">
            <p className="text-sm text-success font-medium">
              Profit: {bet.actualPayout !== "R0" ? `R${parseInt(bet.actualPayout.slice(1)) - parseInt(bet.stake.slice(1))}` : "R0"}
            </p>
          </div>
        )}

        {bet.status === "lost" && (
          <div className="mt-3 p-2 bg-destructive-soft rounded-lg">
            <p className="text-sm text-destructive font-medium">
              Loss: {bet.stake}
            </p>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark mb-2">My Portfolio</h1>
          <p className="text-subtext-light dark:text-subtext-dark">
            Track your prediction market performance and active bets
          </p>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Staked"
            value={portfolioStats.totalStaked}
            description="Amount invested in markets"
            icon={DollarSign}
          />
          <StatsCard
            title="Total Won"
            value={portfolioStats.totalWon}
            description="Successful predictions payout"
            icon={TrendingUp}
            trend="+12% this month"
            trendPositive={true}
          />
          <StatsCard
            title="Win Rate"
            value={portfolioStats.winRate}
            description="Percentage of successful bets"
            icon={CheckCircle}
            trend="Above average"
            trendPositive={true}
          />
          <StatsCard
            title="Active Bets"
            value={portfolioStats.activeBets.toString()}
            description="Currently open positions"
            icon={Clock}
          />
        </div>

        {/* Bets Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Bets</TabsTrigger>
              <TabsTrigger value="active">Active ({activeBets.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedBets.length})</TabsTrigger>
            </TabsList>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBets.map((bet, index) => (
                <div key={bet.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BetCard bet={bet} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBets.map((bet, index) => (
                <div key={bet.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BetCard bet={bet} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resolvedBets.map((bet, index) => (
                <div key={bet.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BetCard bet={bet} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredBets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bets found</h3>
            <p className="text-muted-foreground mb-4">
              Start by joining some prediction markets
            </p>
            <Button variant="hero">
              Explore Markets
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
import { useState } from "react";
import { TrendingUp, TrendingDown, Clock, CheckCircle, X, Filter, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";

const Portfolio = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock portfolio data
  const portfolioStats = {
    totalStaked: "R4,250",
    totalWon: "R3,180",
    totalLost: "R890",
    winRate: "74%",
    activeBets: 6,
    resolvedBets: 12
  };

  const bets = [
    {
      id: 1,
      title: "Rainfall > 30mm in Limpopo this week",
      type: "weather",
      prediction: "Yes",
      stake: "R500",
      currentOdds: "68%",
      potentialPayout: "R735",
      status: "active",
      timeLeft: "3 days left",
      region: "Limpopo",
      dateStaked: "2024-01-15"
    },
    {
      id: 2,
      title: "Maize yield above 6 tons/hectare - KZN",
      type: "crop",
      prediction: "No",
      stake: "R300",
      currentOdds: "55%",
      potentialPayout: "R545",
      status: "active",
      timeLeft: "14 days left",
      region: "KwaZulu-Natal",
      dateStaked: "2024-01-10"
    },
    {
      id: 3,
      title: "Temperature exceeds 35°C for 5 consecutive days",
      type: "weather",
      prediction: "Yes",
      stake: "R750",
      finalOdds: "84%",
      actualPayout: "R893",
      status: "won",
      resolvedDate: "2024-01-12",
      region: "Northern Cape",
      dateStaked: "2024-01-05"
    },
    {
      id: 4,
      title: "Sunflower harvest success - Free State",
      type: "crop",
      prediction: "Yes",
      stake: "R400",
      finalOdds: "38%",
      actualPayout: "R0",
      status: "lost",
      resolvedDate: "2024-01-08",
      region: "Free State",
      dateStaked: "2024-01-02"
    },
    {
      id: 5,
      title: "Drought conditions in Western Cape",
      type: "weather",
      prediction: "No",
      stake: "R600",
      finalOdds: "25%",
      actualPayout: "R2,400",
      status: "won",
      resolvedDate: "2024-01-14",
      region: "Western Cape",
      dateStaked: "2024-01-01"
    },
    {
      id: 6,
      title: "Wheat quality premium grade",
      type: "crop",
      prediction: "Yes",
      stake: "R350",
      currentOdds: "59%",
      potentialPayout: "R593",
      status: "active",
      timeLeft: "62 days left",
      region: "Western Cape",
      dateStaked: "2024-01-16"
    }
  ];

  const filteredBets = bets.filter(bet => statusFilter === "all" || bet.status === statusFilter);
  const activeBets = bets.filter(bet => bet.status === "active");
  const resolvedBets = bets.filter(bet => bet.status === "won" || bet.status === "lost");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won": return "text-success";
      case "lost": return "text-destructive";
      case "active": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won": return CheckCircle;
      case "lost": return X;
      case "active": return Clock;
      default: return Clock;
    }
  };

  const BetCard = ({ bet }: { bet: typeof bets[0] }) => {
    const StatusIcon = getStatusIcon(bet.status);
    
    return (
      <Card className="p-6 bg-gradient-card border-card-border hover:shadow-hover transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={bet.type === "weather" ? "secondary" : "outline"} className="capitalize">
                {bet.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {bet.region}
              </Badge>
            </div>
            <h3 className="font-semibold text-card-foreground mb-1 line-clamp-2">
              {bet.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Predicted: <span className="font-medium">{bet.prediction}</span>
            </p>
          </div>
          <div className={`flex items-center gap-1 ${getStatusColor(bet.status)}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{bet.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Stake</p>
            <p className="font-semibold">{bet.stake}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {bet.status === "active" ? "Potential Payout" : "Final Payout"}
            </p>
            <p className="font-semibold">
              {bet.status === "active" ? bet.potentialPayout : bet.actualPayout}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {bet.status === "active" ? bet.timeLeft : `Resolved ${bet.resolvedDate}`}
          </span>
          <span className="text-muted-foreground">
            Odds: {bet.status === "active" ? bet.currentOdds : bet.finalOdds}
          </span>
        </div>

        {bet.status === "won" && (
          <div className="mt-3 p-2 bg-success-soft rounded-lg">
            <p className="text-sm text-success font-medium">
              Profit: {bet.actualPayout !== "R0" ? `R${parseInt(bet.actualPayout.slice(1)) - parseInt(bet.stake.slice(1))}` : "R0"}
            </p>
          </div>
        )}

        {bet.status === "lost" && (
          <div className="mt-3 p-2 bg-destructive-soft rounded-lg">
            <p className="text-sm text-destructive font-medium">
              Loss: {bet.stake}
            </p>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-hero mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">
            Track your prediction market performance and active bets
          </p>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Staked"
            value={portfolioStats.totalStaked}
            description="Amount invested in markets"
            icon={DollarSign}
          />
          <StatsCard
            title="Total Won"
            value={portfolioStats.totalWon}
            description="Successful predictions payout"
            icon={TrendingUp}
            trend="+12% this month"
            trendPositive={true}
          />
          <StatsCard
            title="Win Rate"
            value={portfolioStats.winRate}
            description="Percentage of successful bets"
            icon={CheckCircle}
            trend="Above average"
            trendPositive={true}
          />
          <StatsCard
            title="Active Bets"
            value={portfolioStats.activeBets.toString()}
            description="Currently open positions"
            icon={Clock}
          />
        </div>

        {/* Bets Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Bets</TabsTrigger>
              <TabsTrigger value="active">Active ({activeBets.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedBets.length})</TabsTrigger>
            </TabsList>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBets.map((bet, index) => (
                <div key={bet.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BetCard bet={bet} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBets.map((bet, index) => (
                <div key={bet.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BetCard bet={bet} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resolvedBets.map((bet, index) => (
                <div key={bet.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BetCard bet={bet} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredBets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bets found</h3>
            <p className="text-muted-foreground mb-4">
              Start by joining some prediction markets
            </p>
            <Button variant="hero">
              Explore Markets
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;