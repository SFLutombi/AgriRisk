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
import { useUser, useSignIn, useSignUp } from "@clerk/clerk-react";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { getMarketById } from "@/data/markets";

const MarketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stakeAmount, setStakeAmount] = useState("");
  const [prediction, setPrediction] = useState("yes");
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Authentication and wallet hooks
  const { isSignedIn, user } = useUser();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { isConnected, connect } = useWallet();
  const { toast } = useToast();

  // Get market data from unified source
  const market = getMarketById(parseInt(id || "1")) || {
    id: 1,
    title: "Market Not Found",
    description: "The requested market could not be found.",
    type: "weather" as const,
    totalStaked: "R0",
    yesPercentage: 50,
    noPercentage: 50,
    timeLeft: "N/A",
    participants: 0,
    region: "Unknown",
    yesOdds: 2.0,
    noOdds: 2.0,
    status: "Closed" as const,
    resolutionSource: "Unknown",
    createdAt: "2024-01-01",
    endDate: "2024-01-01",
    yesStake: "R0",
    noStake: "R0"
  };

  // Chart data
  const distributionData = [
    { name: "Yes", value: market.yesPercentage, fill: "hsl(var(--success))" },
    { name: "No", value: market.noPercentage, fill: "hsl(var(--destructive))" }
  ];

  const trendsData = [
    { time: "Jan 15", yes: 45, no: 55, volume: 125000 },
    { time: "Jan 16", yes: 52, no: 48, volume: 180000 },
    { time: "Jan 17", yes: 61, no: 39, volume: 220000 },
    { time: "Jan 18", yes: 68, no: 32, volume: 195000 },
    { time: "Jan 19", yes: 71, no: 29, volume: 210000 },
    { time: "Jan 20", yes: 68, no: 32, volume: 175000 },
    { time: "Jan 21", yes: 69, no: 31, volume: 190000 },
  ];

  const regionData = market.region === "Limpopo" ? [
    { region: "Polokwane", participants: 245, percentage: 32, stake: "R785,000" },
    { region: "Tzaneen", participants: 198, percentage: 26, stake: "R637,000" },
    { region: "Mokopane", participants: 156, percentage: 21, stake: "R501,000" },
    { region: "Musina", participants: 98, percentage: 13, stake: "R315,000" },
    { region: "Others", participants: 60, percentage: 8, stake: "R193,000" },
  ] : market.region === "Eastern Cape" ? [
    { region: "Port Elizabeth", participants: 456, percentage: 35, stake: "R1,120,000" },
    { region: "East London", participants: 389, percentage: 30, stake: "R956,000" },
    { region: "Uitenhage", participants: 234, percentage: 18, stake: "R575,000" },
    { region: "Grahamstown", participants: 156, percentage: 12, stake: "R384,000" },
    { region: "Others", participants: 78, percentage: 5, stake: "R192,000" },
  ] : [
    { region: "Durban", participants: 267, percentage: 30, stake: "R555,000" },
    { region: "Pietermaritzburg", participants: 223, percentage: 25, stake: "R463,000" },
    { region: "Newcastle", participants: 178, percentage: 20, stake: "R370,000" },
    { region: "Ladysmith", participants: 134, percentage: 15, stake: "R278,000" },
    { region: "Others", participants: 90, percentage: 10, stake: "R187,000" },
  ];

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    // Check if market is closed or expired
    if (market.status === "Closed" || market.timeLeft === "Expired") {
      toast({
        title: "Market Closed",
        description: "This market is no longer accepting stakes.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is authenticated and wallet is connected
    if (!isSignedIn || !isConnected) {
      setShowLoginModal(true);
      return;
    }
    
    // User is authenticated and wallet is connected - proceed with staking
    toast({
      title: "Stake Placed!",
      description: `Successfully placed R${stakeAmount} stake on "${prediction}" prediction.`,
    });
    
    // Reset form
    setStakeAmount("");
    setPrediction("yes");
  };

  const handleConnectWallet = async () => {
    try {
      await connect();
      setShowLoginModal(false);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleSignIn = () => {
    if (signIn) {
      signIn.open();
    }
  };

  const handleSignUp = () => {
    if (signUp) {
      signUp.open();
    }
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
                  <div className="h-80 w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                            labelLine={false}
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
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-success-soft rounded-lg border border-success/20">
                      <div className="text-2xl font-bold text-success">{market.yesPercentage}%</div>
                      <div className="text-sm text-success/80 font-medium">Yes Prediction</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="text-2xl font-bold text-destructive">{market.noPercentage}%</div>
                      <div className="text-sm text-destructive/80 font-medium">No Prediction</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Odds Evolution Over Time</h3>
                  <div className="h-80 w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: 'hsl(var(--border))' }}
                            tickLine={{ stroke: 'hsl(var(--border))' }}
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: 'hsl(var(--border))' }}
                            tickLine={{ stroke: 'hsl(var(--border))' }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="yes" 
                            stroke="hsl(var(--success))" 
                            strokeWidth={3}
                            name="Yes %"
                            dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="no" 
                            stroke="hsl(var(--destructive))" 
                            strokeWidth={3}
                            name="No %"
                            dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: 'hsl(var(--destructive))', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  {/* Legend for line chart */}
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-success"></div>
                      <span className="text-sm font-medium text-success">Yes Prediction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-destructive"></div>
                      <span className="text-sm font-medium text-destructive">No Prediction</span>
                    </div>
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

              {(market.status === "Closed" || market.timeLeft === "Expired") && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center text-destructive text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    This market is closed and no longer accepting stakes
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="prediction" className="text-sm font-medium mb-3 block">
                    Your Prediction
                  </Label>
                  <RadioGroup value={prediction} onValueChange={setPrediction} disabled={market.status === "Closed" || market.timeLeft === "Expired"}>
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
                    disabled={market.status === "Closed" || market.timeLeft === "Expired"}
                  />
                  <div className="flex gap-2 mt-2">
                    {[50, 100, 250, 500].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setStakeAmount(amount.toString())}
                        className="flex-1"
                        disabled={market.status === "Closed" || market.timeLeft === "Expired"}
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
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || market.status === "Closed" || market.timeLeft === "Expired"}
                  className="w-full"
                  variant="hero"
                >
                  {market.status === "Closed" || market.timeLeft === "Expired" 
                    ? "Market Closed" 
                    : !isSignedIn || !isConnected 
                      ? "Connect to Stake" 
                      : "Place Stake"
                  }
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

        {/* Authentication Modal */}
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Connect to Stake</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-center text-muted-foreground">
                {!isSignedIn && !isConnected 
                  ? "Connect your wallet and sign in to place stakes in prediction markets."
                  : !isSignedIn 
                    ? "Sign in to your account to place stakes in prediction markets."
                    : "Connect your wallet to place stakes in prediction markets."
                }
              </p>
              
              {/* Show current status */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                  <span>Account Status:</span>
                  <Badge variant={isSignedIn ? "default" : "secondary"}>
                    {isSignedIn ? `Signed in as ${user?.firstName || user?.emailAddresses[0]?.emailAddress}` : "Not signed in"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                  <span>Wallet Status:</span>
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? "Connected" : "Not connected"}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                {!isConnected && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleConnectWallet}
                  >
                    Connect Wallet
                  </Button>
                )}
                {!isSignedIn && (
                  <>
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={handleSignUp}
                    >
                      Create Account
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                  </>
                )}
                {isSignedIn && isConnected && (
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Continue to Stake
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MarketDetail;