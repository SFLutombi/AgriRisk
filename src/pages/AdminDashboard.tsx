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
import { markets, getDashboardStats, type Market } from "@/data/markets";
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
  ArrowUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  const [chartView, setChartView] = useState<"revenue" | "volume">("revenue");
  const [newMarket, setNewMarket] = useState({
    name: "",
    eventType: "Weather",
    threshold: "",
    region: "",
    endTime: "",
    oracleType: "Manual"
  });
  
  const [adminMarkets, setAdminMarkets] = useState(markets);
  const dashboardStats = getDashboardStats();

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

  const handleCreateMarket = () => {
    if (!newMarket.name || !newMarket.endTime) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newId = adminMarkets.length + 1;
    const newMarketData: Market = {
      id: newId,
      title: newMarket.name,
      description: `New ${newMarket.eventType.toLowerCase()} market: ${newMarket.name}`,
      type: newMarket.eventType.toLowerCase() as Market['type'],
      totalStaked: "R 0",
      yesPercentage: 50,
      noPercentage: 50,
      timeLeft: "New",
      participants: 0,
      region: newMarket.region || "National",
      yesOdds: 2.0,
      noOdds: 2.0,
      status: "Open",
      resolutionSource: newMarket.oracleType,
      createdAt: new Date().toISOString().split('T')[0],
      endDate: newMarket.endTime,
      yesStake: "R 0",
      noStake: "R 0"
    };
    setAdminMarkets([...adminMarkets, newMarketData]);
    
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
      title: "Market Created",
      description: "New prediction market has been created successfully.",
    });
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navigation />
      
      {/* Radial Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, black 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, black 1px, transparent 1px),
              radial-gradient(circle at 20% 80%, black 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, black 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, black 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 120px 120px, 80px 80px, 140px 140px, 60px 60px',
            backgroundPosition: '0 0, 30px 30px, 60px 60px, 90px 90px, 15px 15px',
            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">Admin Dashboard</h1>
          <p className="text-subtext-light dark:text-subtext-dark mt-1">Manage your prediction markets and platform activity.</p>
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
              >
                <Plus className="mr-2 w-4 h-4" />
                Create Market
              </Button>
            </div>
            
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
                      <tr key={market.id} className="border-b border-border">
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
            <Button onClick={handleCreateMarket}>
              Create Market
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
