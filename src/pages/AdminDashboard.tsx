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
  const [newMarket, setNewMarket] = useState({
    name: "",
    eventType: "Weather",
    threshold: "",
    region: "",
    endTime: "",
    oracleType: "Manual"
  });
  
  const [markets, setMarkets] = useState([
    {
      id: 1,
      name: "Rainfall > 30mm Limpopo",
      totalStaked: "R 150,000",
      closingTime: "2024-08-31 12:00",
      status: "Open"
    },
    {
      id: 2,
      name: "Drought declaration EC",
      totalStaked: "R 320,000",
      closingTime: "2024-09-15 12:00",
      status: "Open"
    },
    {
      id: 3,
      name: "Maize yield > 5t/ha KZN",
      totalStaked: "R 85,000",
      closingTime: "2024-07-30 18:00",
      status: "Resolving"
    },
    {
      id: 4,
      name: "Frost warning Western Cape",
      totalStaked: "R 50,000",
      closingTime: "2024-06-30 06:00",
      status: "Closed"
    }
  ]);

  const handleCreateMarket = () => {
    if (!newMarket.name || !newMarket.endTime) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newId = markets.length + 1;
    setMarkets([...markets, {
      id: newId,
      name: newMarket.name,
      totalStaked: "R 0",
      closingTime: newMarket.endTime,
      status: "Open"
    }]);
    
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your prediction markets and platform activity.</p>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Total Revenue</p>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">R24,150</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">This Month</p>
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">R3,850</p>
                <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +15%
                </p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Active Markets</p>
                  <Store className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">12</p>
                <p className="text-xs text-muted-foreground mt-1">+2 this week</p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Active Users</p>
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">1,247</p>
                <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +52
                </p>
              </Card>
              
              <Card className="p-5 flex flex-col">
                <div className="flex items-center justify-between text-muted-foreground">
                  <p className="text-sm font-medium">Volume Staked</p>
                  <Database className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground mt-2">R2.4M</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </Card>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-6">
                <div className="flex flex-wrap justify-between items-start mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Revenue</h2>
                    <p className="text-sm text-muted-foreground mt-1">Track revenue over time.</p>
                  </div>
                  <div className="flex items-center text-sm bg-muted p-1 rounded-lg">
                    <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-background text-foreground shadow-sm">
                      Revenue
                    </button>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground">
                      Volume
                    </button>
                  </div>
                </div>
                <div className="h-80 w-full flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p>Revenue Chart Placeholder</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-5">Revenue Breakdown</h2>
                <div className="h-48 w-48 mx-auto my-6 flex items-center justify-center relative">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="3"></path>
                    <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeDasharray="65, 100" strokeDashoffset="-0" strokeLinecap="round" strokeWidth="3"></path>
                    <path className="text-yellow-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-65" strokeLinecap="round" strokeWidth="3"></path>
                    <path className="text-slate-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeDasharray="10, 100" strokeDashoffset="-90" strokeLinecap="round" strokeWidth="3"></path>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">Total Fees</span>
                    <span className="text-2xl font-bold text-foreground">R3,850</span>
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-muted-foreground">
                      <span className="w-3 h-3 rounded-full bg-primary mr-3"></span>
                      Trading Fees
                    </span>
                    <span className="font-semibold text-foreground">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-muted-foreground">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></span>
                      Resolution Fees
                    </span>
                    <span className="font-semibold text-foreground">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-muted-foreground">
                      <span className="w-3 h-3 rounded-full bg-slate-400 mr-3"></span>
                      Other
                    </span>
                    <span className="font-semibold text-foreground">10%</span>
                  </div>
                </div>
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
                      <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Closing Time</th>
                      <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((market) => (
                      <tr key={market.id} className="border-b border-border">
                        <td className="py-4 px-4 font-medium text-foreground">{market.name}</td>
                        <td className="py-4 px-4 text-muted-foreground">{market.totalStaked}</td>
                        <td className="py-4 px-4 text-muted-foreground">{market.closingTime}</td>
                        <td className="py-4 px-4">{getStatusBadge(market.status)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5"
                              disabled={market.status === "Closed"}
                            >
                              <Gavel className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1.5"
                              disabled={market.status === "Closed"}
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
