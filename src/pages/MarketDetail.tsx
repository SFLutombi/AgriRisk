import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, Wheat, MapPin, Clock, Users, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Navigation from "@/components/Navigation";

const MarketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stakeAmount, setStakeAmount] = useState("");
  const [prediction, setPrediction] = useState("yes");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Mock market data - in real app would fetch based on ID
  const market = {
    id: parseInt(id || "1"),
    title: "Rainfall > 30mm in Limpopo this week",
    description: "Will Limpopo province receive more than 30mm of rainfall in the next 7 days? This market helps farmers hedge against weather risk.",
    type: "weather" as const,
    totalStaked: "R12,500",
    yesPercentage: 68,
    noPercentage: 32,
    timeLeft: "3 days left",
    participants: 47,
    region: "Limpopo",
    resolutionSource: "South African Weather Service",
    createdAt: "2024-01-15",
    endDate: "2024-01-22"
  };

  // Chart data
  const distributionData = [
    { name: "Yes", value: market.yesPercentage, fill: "hsl(var(--success))" },
    { name: "No", value: market.noPercentage, fill: "hsl(var(--destructive))" }
  ];

  const trendsData = [
    { time: "Day 1", yes: 45, no: 55 },
    { time: "Day 2", yes: 52, no: 48 },
    { time: "Day 3", yes: 61, no: 39 },
    { time: "Day 4", yes: 68, no: 32 },
  ];

  const regionData = [
    { region: "Polokwane", participants: 15, percentage: 32 },
    { region: "Tzaneen", participants: 12, percentage: 26 },
    { region: "Mokopane", participants: 10, percentage: 21 },
    { region: "Musina", participants: 6, percentage: 13 },
    { region: "Others", participants: 4, percentage: 8 },
  ];

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    // In real app, would check if user is connected/authenticated
    setShowLoginModal(true);
  };

  const chartConfig = {
    yes: {
      label: "Yes",
      color: "hsl(var(--success))",
    },
    no: {
      label: "No", 
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/markets")}
          className="mb-6 hover:bg-accent/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Markets
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <Card className="bg-gradient-card border-card-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent-soft rounded-lg flex items-center justify-center">
                    {market.type === "weather" ? (
                      <Droplets className="w-6 h-6 text-accent" />
                    ) : (
                      <Wheat className="w-6 h-6 text-success" />
                    )}
                  </div>
                  <div>
                    <Badge variant={market.type === "weather" ? "secondary" : "outline"} className="mb-2">
                      {market.type} Market
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {market.region}
                    </Badge>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <Clock className="w-3 h-3 mr-1" />
                  {market.timeLeft}
                </Badge>
              </div>

              <h1 className="text-2xl font-bold text-card-foreground mb-3">
                {market.title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {market.description}
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-gradient-hero">{market.totalStaked}</div>
                  <div className="text-sm text-muted-foreground">Total Staked</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-gradient-hero">{market.participants}</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">{market.yesPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Prediction "Yes"</div>
                </div>
              </div>
            </Card>

            {/* Charts and Analytics */}
            <Tabs defaultValue="distribution" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="distribution">Stake Distribution</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="regions">Regional Data</TabsTrigger>
              </TabsList>

              <TabsContent value="distribution" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Stake Distribution</h3>
                  <div className="h-64">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {distributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-success-soft rounded-lg">
                      <div className="text-lg font-bold text-success">{market.yesPercentage}%</div>
                      <div className="text-sm text-success/80">Yes Prediction</div>
                    </div>
                    <div className="text-center p-3 bg-destructive/10 rounded-lg">
                      <div className="text-lg font-bold text-destructive">{market.noPercentage}%</div>
                      <div className="text-sm text-destructive/80">No Prediction</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Odds Evolution Over Time</h3>
                  <div className="h-64">
                    <ChartContainer config={chartConfig}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendsData}>
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 100]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="yes" 
                            stroke="hsl(var(--success))" 
                            strokeWidth={3}
                            name="Yes %"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="no" 
                            stroke="hsl(var(--destructive))" 
                            strokeWidth={3}
                            name="No %"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="regions" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Participants by Area</h3>
                  <div className="space-y-3">
                    {regionData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{item.region}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-muted-foreground">
                            {item.participants} participants
                          </div>
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-primary h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <div className="text-sm font-medium w-12 text-right">
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Staking Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-card-border p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Place Your Stake
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="prediction" className="text-sm font-medium mb-3 block">
                    Your Prediction
                  </Label>
                  <RadioGroup value={prediction} onValueChange={setPrediction}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-success/20 bg-success-soft">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-success">Yes</span>
                          <span className="text-sm font-bold text-success">{market.yesPercentage}%</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-destructive">No</span>
                          <span className="text-sm font-bold text-destructive">{market.noPercentage}%</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                    Stake Amount (ZAR)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="text-lg"
                  />
                  <div className="flex gap-2 mt-2">
                    {[50, 100, 250, 500].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setStakeAmount(amount.toString())}
                        className="flex-1"
                      >
                        R{amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {stakeAmount && parseFloat(stakeAmount) > 0 && (
                  <div className="p-3 bg-background/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stake Amount:</span>
                      <span className="font-medium">R{stakeAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Potential Return:</span>
                      <span className="font-medium text-success">
                        R{prediction === "yes" 
                          ? (parseFloat(stakeAmount) * (100 / market.yesPercentage)).toFixed(2)
                          : (parseFloat(stakeAmount) * (100 / market.noPercentage)).toFixed(2)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Profit if correct:</span>
                      <span className="text-success">
                        +R{prediction === "yes" 
                          ? ((parseFloat(stakeAmount) * (100 / market.yesPercentage)) - parseFloat(stakeAmount)).toFixed(2)
                          : ((parseFloat(stakeAmount) * (100 / market.noPercentage)) - parseFloat(stakeAmount)).toFixed(2)
                        }
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                  className="w-full"
                  variant="hero"
                >
                  Place Stake
                </Button>
              </div>

              {/* Market info */}
              <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Resolution Source:</span>
                  <span>{market.resolutionSource}</span>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <span>{market.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Created:</span>
                  <span>{market.createdAt}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Login Modal */}
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Connect to Stake</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-center text-muted-foreground">
                Connect your wallet or create an account to place stakes in prediction markets.
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Connect Wallet
                </Button>
                <Button variant="default" className="w-full">
                  Create Account
                </Button>
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MarketDetail;