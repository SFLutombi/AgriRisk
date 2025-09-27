import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navigation from "@/components/Navigation";
import { 
  Shield, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  DollarSign,
  BarChart3,
  TrendingUp,
  Calendar,
  Store,
  Database,
  Gavel,
  X,
  Leaf,
  Grid3X3,
  MoreHorizontal,
  ArrowUp,
  Loader2,
  Settings,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contractService } from "@/lib/contractService";
import { marketService, Market } from "@/lib/marketService";
import { autoResolutionService } from "@/lib/autoResolutionService";
import { useWallet } from "@/contexts/WalletContext";

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected } = useWallet();
  
  // Check if user is admin (assuming you're using organization roles)
  // For development/testing, also allow if user is signed in (remove this in production)
  const isAdmin = user?.organizationMemberships?.some(
    (membership) => membership.organization.name === "AgriRisk" && 
    membership.role === "admin"
  ) || (user && import.meta.env.DEV); // Allow any signed-in user in development
  
  // Debug logging
  useEffect(() => {
    console.log("Admin Dashboard Debug:", {
      isLoaded,
      user: user ? "User exists" : "No user",
      organizationMemberships: user?.organizationMemberships,
      isAdmin,
      userEmail: user?.emailAddresses?.[0]?.emailAddress
    });
  }, [isLoaded, user, isAdmin]);
  
  // Redirect if not admin
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      console.log("Redirecting to home - not admin");
      navigate("/");
    }
  }, [isLoaded, isAdmin, navigate]);
  
  // State management
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [resolutionOutcome, setResolutionOutcome] = useState<"yes" | "no">("yes");
  const [chartView, setChartView] = useState<"revenue" | "volume">("revenue");
  const [autoResolutionEnabled, setAutoResolutionEnabled] = useState(true);
  const [newMarket, setNewMarket] = useState({
    name: "",
    eventType: "Weather",
    threshold: "",
    region: "",
    endTime: "",
    oracleType: "Manual"
  });
  
  const [adminMarkets, setAdminMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalStaked: "R0M",
    totalParticipants: "0",
    activeMarkets: 0,
    openMarkets: 0,
    resolvingMarkets: 0,
    closedMarkets: 0
  });

  // Initialize auto-resolution service
  useEffect(() => {
    if (isAdmin) {
      // Start auto-resolution service
      autoResolutionService.start();
      
      // Set up periodic refresh of markets
      const refreshInterval = setInterval(async () => {
        try {
          const [markets, stats] = await Promise.all([
            marketService.getAllMarkets(),
            marketService.getDashboardStats()
          ]);
          setAdminMarkets(markets);
          setDashboardStats(stats);
        } catch (error) {
          console.error('Error refreshing markets:', error);
        }
      }, 30000); // Refresh every 30 seconds

      return () => {
        clearInterval(refreshInterval);
        autoResolutionService.stop();
      };
    }
  }, [isAdmin]);

  // Fetch markets from blockchain
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const [markets, stats] = await Promise.all([
          marketService.getAllMarkets(),
          marketService.getDashboardStats()
        ]);
        setAdminMarkets(markets);
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching markets:', error);
        toast({
          title: "Error",
          description: "Failed to load markets from blockchain",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchMarkets();
    }
  }, [isAdmin, toast]);

  // Chart data for revenue and breakdown
  const revenueData = [
    { month: "Jan", revenue: 125000, volume: 2100000 },
    { month: "Feb", revenue: 142000, volume: 2400000 },
    { month: "Mar", revenue: 168000, volume: 2800000 },
    { month: "Apr", revenue: 195000, volume: 3200000 },
    { month: "May", revenue: 220000, volume: 3600000 },
    { month: "Jun", revenue: 245000, volume: 4000000 },
    { month: "Jul", revenue: 268000, volume: 4400000 },
    { month: "Aug", revenue: 285000, volume: 4800000 },
    { month: "Sep", revenue: 310000, volume: 5200000 },
    { month: "Oct", revenue: 335000, volume: 5600000 },
    { month: "Nov", revenue: 360000, volume: 6000000 },
    { month: "Dec", revenue: 485000, volume: 8000000 }
  ];

  const revenueBreakdownData = [
    { name: "Trading Fees", value: 65, amount: 315250, color: "hsl(var(--primary))" },
    { name: "Resolution Fees", value: 25, amount: 121250, color: "hsl(var(--warning))" },
    { name: "Premium Features", value: 10, amount: 48500, color: "hsl(var(--muted-foreground))" }
  ];

  const handleCreateMarket = async () => {
    if (!newMarket.name || !newMarket.endTime) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if wallet is connected
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a market on the blockchain.",
        variant: "destructive",
      });
      return;
    }

    // Check if contract is available
    if (!contractService.isContractAvailable()) {
      toast({
        title: "Contract Not Available",
        description: "Smart contract is not deployed on the current network. Please switch to the correct network.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert datetime-local to Unix timestamp
      const endTimeUnix = Math.floor(new Date(newMarket.endTime).getTime() / 1000);
      
      // Show loading toast
      const loadingToast = toast({
        title: "Creating Market...",
        description: "Please wait while the transaction is being processed.",
      });

      // Call smart contract
      const result = await contractService.createMarket({
        title: newMarket.name,
        description: `New ${newMarket.eventType.toLowerCase()} market: ${newMarket.name}`,
        marketType: newMarket.eventType,
        region: newMarket.region || "National",
        endTime: endTimeUnix,
        oracleType: newMarket.oracleType
      });

      if (result.success) {
        // Clear cache and refresh markets
        marketService.clearCache();
        const updatedMarkets = await marketService.getAllMarkets();
        setAdminMarkets(updatedMarkets);
        
        setNewMarket({
          name: "",
          eventType: "Weather",
          threshold: "",
          region: "",
          endTime: "",
          oracleType: "Manual"
        });
        setShowCreateModal(false);
        
        toast({
          title: "Market Created Successfully!",
          description: `Market created on blockchain with ID: ${result.marketId}. Transaction: ${result.txHash?.slice(0, 10)}...`,
        });
      } else {
        toast({
          title: "Failed to Create Market",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating market:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create market",
        variant: "destructive",
      });
    }
  };

  const handleResolveMarket = (market: Market) => {
    setSelectedMarket(market);
    setResolutionOutcome("yes");
    setShowResolveModal(true);
  };

  const handleConfirmResolution = async () => {
    if (!selectedMarket) return;

    // Check if wallet is connected
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to resolve markets on the blockchain.",
        variant: "destructive",
      });
      return;
    }

    // Check if contract is available
    if (!contractService.isContractAvailable()) {
      toast({
        title: "Contract Not Available",
        description: "Smart contract is not deployed on the current network. Please switch to the correct network.",
        variant: "destructive",
      });
      return;
    }

    try {
      setResolving(true);
      
      // Show loading toast
      toast({
        title: "Resolving Market...",
        description: "Please wait while the transaction is being processed.",
      });

      // Call smart contract to resolve market
      const result = await contractService.resolveMarket(
        selectedMarket.id, 
        resolutionOutcome === "yes"
      );

      if (result.success) {
        // Clear cache and refresh markets
        marketService.clearCache();
        const updatedMarkets = await marketService.getAllMarkets();
        setAdminMarkets(updatedMarkets);
        
        setShowResolveModal(false);
        setSelectedMarket(null);
        
        toast({
          title: "Market Resolved Successfully!",
          description: `Market resolved with outcome: ${resolutionOutcome.toUpperCase()}. Transaction: ${result.txHash?.slice(0, 10)}...`,
        });
      } else {
        toast({
          title: "Failed to Resolve Market",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error resolving market:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to resolve market",
        variant: "destructive",
      });
    } finally {
      setResolving(false);
    }
  };

  const handleToggleAutoResolution = () => {
    const newState = !autoResolutionEnabled;
    setAutoResolutionEnabled(newState);
    
    if (newState) {
      autoResolutionService.start();
      toast({
        title: "Auto-Resolution Enabled",
        description: "Markets will now be automatically resolved when they expire.",
      });
    } else {
      autoResolutionService.stop();
      toast({
        title: "Auto-Resolution Disabled",
        description: "Markets will need to be manually resolved.",
      });
    }
  };

  const handleTriggerResolutionCheck = async () => {
    try {
      await autoResolutionService.triggerCheck();
      toast({
        title: "Resolution Check Triggered",
        description: "Checking for expired markets and resolving them.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger resolution check",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Open</Badge>;
      case "Resolving":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Resolving</Badge>;
      case "Closed":
        return <Badge className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          {user ? (
            <div className="text-sm text-muted-foreground">
              <p>You are signed in as: {user.emailAddresses?.[0]?.emailAddress}</p>
              <p className="mt-2">To access the admin dashboard, you need:</p>
              <ul className="text-left mt-2 space-y-1">
                <li>• Be a member of the "AgriRisk" organization</li>
                <li>• Have the "admin" role</li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Please sign in first.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your prediction markets and platform activity.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerResolutionCheck}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Check Expired</span>
              </Button>
              <Button
                variant={autoResolutionEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleToggleAutoResolution}
                className="flex items-center space-x-2"
              >
                {autoResolutionEnabled ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Auto-Resolution ON</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Auto-Resolution OFF</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Grid3X3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="markets" className="flex items-center space-x-2">
              <Store className="w-4 h-4" />
              <span>Markets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Charts Section - First Priority */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <Card className="lg:col-span-2 p-6">
                <div className="flex flex-wrap justify-between items-start mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {chartView === "revenue" ? "Revenue" : "Volume"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {chartView === "revenue" ? "Track revenue over time" : "Track trading volume over time"}
                    </p>
                  </div>
                  <div className="flex items-center text-sm bg-muted p-1 rounded-lg">
                    <button 
                      onClick={() => setChartView("revenue")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        chartView === "revenue" 
                          ? "bg-background text-foreground shadow-sm font-semibold" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Revenue
                    </button>
                    <button 
                      onClick={() => setChartView("volume")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        chartView === "volume" 
                          ? "bg-background text-foreground shadow-sm font-semibold" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Volume
                    </button>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--primary))",
                      },
                      volume: {
                        label: "Volume",
                        color: "hsl(var(--muted-foreground))",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <LineChart data={revenueData}>
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => 
                          chartView === "revenue" 
                            ? `R${(value / 1000).toFixed(0)}K` 
                            : `R${(value / 1000000).toFixed(1)}M`
                        }
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line
                        dataKey={chartView}
                        type="monotone"
                        stroke={`var(--color-${chartView})`}
                        strokeWidth={2}
                        dot={{
                          fill: `var(--color-${chartView})`,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-5">Revenue Breakdown</h2>
                <div className="h-40 w-40 mx-auto my-4">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Revenue",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <PieChart>
                      <Pie
                        data={revenueBreakdownData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        strokeWidth={5}
                      >
                        {revenueBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="space-y-3 text-sm">
                  {revenueBreakdownData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="flex items-center text-muted-foreground">
                        <span 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: item.color }}
                        ></span>
                        {item.name}
                      </span>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">{item.value}%</div>
                        <div className="text-xs text-muted-foreground">R{item.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Stats Cards - Below Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Total Revenue</p>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">R2.4M</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">This Month</p>
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">R485K</p>
                <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +23%
                </p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Active Markets</p>
                  <Store className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{dashboardStats.activeMarkets}</p>
                <p className="text-xs text-muted-foreground mt-1">{dashboardStats.openMarkets} open, {dashboardStats.resolvingMarkets} resolving, {dashboardStats.closedMarkets} closed</p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Active Users</p>
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{dashboardStats.totalParticipants}</p>
                <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +127
                </p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Volume Staked</p>
                  <Database className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">{dashboardStats.totalStaked}</p>
                <p className="text-xs text-muted-foreground mt-1">Across all markets</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="markets" className="mt-6">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Active Markets</h2>
                <p className="text-muted-foreground mt-1">Manage, resolve, and create new prediction markets.</p>
              </div>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 sm:mt-0"
                disabled={!isConnected}
              >
                <Plus className="mr-2 w-4 h-4" />
                Create Market
                {!isConnected && (
                  <span className="ml-2 text-xs opacity-75">(Connect Wallet)</span>
                )}
              </Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading markets from blockchain...</p>
                </div>
              </div>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market</th>
                        <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Staked</th>
                        <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Participants</th>
                        <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Closing Time</th>
                        <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminMarkets.map((market) => (
                        <tr key={`market-${market.id}`} className="border-b border-border">
                          <td className="py-4 px-4 font-medium text-foreground">{market.title}</td>
                          <td className="py-4 px-4 text-muted-foreground">{market.totalStaked}</td>
                          <td className="py-4 px-4 text-muted-foreground">{market.participants.toLocaleString()}</td>
                          <td className="py-4 px-4 text-muted-foreground">{market.endDate}</td>
                          <td className="py-4 px-4">{getStatusBadge(market.status)}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5"
                                disabled={market.status === "Closed"}
                                title="Resolve Market"
                                onClick={() => handleResolveMarket(market)}
                              >
                                <Gavel className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5"
                                disabled={market.status === "Closed"}
                                title="Close Market"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Market Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Market</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="market-name">Market Name / Question</Label>
              <Input
                id="market-name"
                placeholder="e.g., Rainfall in Limpopo to exceed 50mm in August"
                value={newMarket.name}
                onChange={(e) => setNewMarket({...newMarket, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="event-type">Event Type</Label>
                <Select value={newMarket.eventType} onValueChange={(value) => setNewMarket({...newMarket, eventType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weather">Weather</SelectItem>
                    <SelectItem value="Crop Yield">Crop Yield</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="threshold">Threshold / Condition</Label>
                <Input
                  id="threshold"
                  placeholder="e.g., > 50mm"
                  value={newMarket.threshold}
                  onChange={(e) => setNewMarket({...newMarket, threshold: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  placeholder="e.g., Limpopo"
                  value={newMarket.region}
                  onChange={(e) => setNewMarket({...newMarket, region: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end-time">Resolution End Time</Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={newMarket.endTime}
                  onChange={(e) => setNewMarket({...newMarket, endTime: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="oracle-type">Oracle Type</Label>
              <Select value={newMarket.oracleType} onValueChange={(value) => setNewMarket({...newMarket, oracleType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chainlink">Chainlink</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="SAWS API">SAWS API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMarket}
              disabled={!isConnected || !contractService.isContractAvailable()}
            >
              Create Market
              {!isConnected && (
                <span className="ml-2 text-xs opacity-75">(Connect Wallet)</span>
              )}
              {isConnected && !contractService.isContractAvailable() && (
                <span className="ml-2 text-xs opacity-75">(Wrong Network)</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resolve Market Modal */}
      <Dialog open={showResolveModal} onOpenChange={setShowResolveModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Market</DialogTitle>
          </DialogHeader>
          {selectedMarket && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedMarket.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedMarket.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Market Outcome
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-success/20 bg-success-soft">
                    <input
                      type="radio"
                      id="outcome-yes"
                      name="outcome"
                      value="yes"
                      checked={resolutionOutcome === "yes"}
                      onChange={(e) => setResolutionOutcome(e.target.value as "yes" | "no")}
                      className="w-4 h-4 text-success"
                    />
                    <Label htmlFor="outcome-yes" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-success">Yes</span>
                        <span className="text-sm font-bold text-success">{selectedMarket.yesPercentage}%</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                    <input
                      type="radio"
                      id="outcome-no"
                      name="outcome"
                      value="no"
                      checked={resolutionOutcome === "no"}
                      onChange={(e) => setResolutionOutcome(e.target.value as "yes" | "no")}
                      className="w-4 h-4 text-destructive"
                    />
                    <Label htmlFor="outcome-no" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-destructive">No</span>
                        <span className="text-sm font-bold text-destructive">{selectedMarket.noPercentage}%</span>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resolution Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Total Staked:</span>
                    <span>{selectedMarket.totalStaked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{selectedMarket.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Status:</span>
                    <span>{selectedMarket.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowResolveModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmResolution}
                  disabled={resolving || !isConnected || !contractService.isContractAvailable()}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {resolving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resolving...
                    </>
                  ) : (
                    <>
                      <Gavel className="w-4 h-4 mr-2" />
                      Resolve Market
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Auto-Resolution Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-Resolution</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically resolve markets when they expire
                  </p>
                </div>
                <Button
                  variant={autoResolutionEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleAutoResolution}
                >
                  {autoResolutionEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Markets are checked every minute for expiry</li>
                  <li>• Expired markets are automatically resolved</li>
                  <li>• Outcome is determined by stake distribution</li>
                  <li>• Manual resolution is always available</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                Close
              </Button>
              <Button onClick={handleTriggerResolutionCheck}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;