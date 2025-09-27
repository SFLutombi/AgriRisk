import { useState } from "react";
import { Search, Filter, Droplets, Wheat, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MarketCard from "@/components/MarketCard";
import Navigation from "@/components/Navigation";
import { marketService, Market } from "@/lib/marketService";

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch markets from blockchain
  const fetchMarkets = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const blockchainMarkets = await marketService.getAllMarkets();
      setMarkets(blockchainMarkets);
    } catch (err) {
      console.error('Error fetching markets:', err);
      setError('Failed to load markets from blockchain');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  // Refresh markets when user navigates back to this page
  useEffect(() => {
    const handleFocus = () => {
      // Clear cache and refresh when user returns to the page
      marketService.clearCache();
      fetchMarkets(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleRefresh = () => {
    marketService.clearCache();
    fetchMarkets(true);
  };

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || market.type === typeFilter;
    const matchesRegion = regionFilter === "all" || market.region === regionFilter;
    
    return matchesSearch && matchesType && matchesRegion;
  });

  const provinces = [...new Set(markets.map(market => market.region))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading markets from blockchain...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Markets</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gradient-hero mb-2">All Markets</h1>
              <p className="text-muted-foreground">
                Browse and join prediction markets for weather events and crop outcomes
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-card-border p-6 mb-8 shadow-card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Market type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="weather">Weather Markets</SelectItem>
                  <SelectItem value="crop">Crop Markets</SelectItem>
                  <SelectItem value="price">Price Markets</SelectItem>
                  <SelectItem value="trade">Trade Markets</SelectItem>
                  <SelectItem value="policy">Policy Markets</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {provinces.map(province => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter summary */}
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Showing {filteredMarkets.length} of {markets.length} markets</span>
            {typeFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {typeFilter === "weather" ? <Droplets className="w-3 h-3" /> : <Wheat className="w-3 h-3" />}
                {typeFilter}
              </Badge>
            )}
            {regionFilter !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {regionFilter}
              </Badge>
            )}
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market, index) => (
            <div key={market.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <MarketCard {...market} />
            </div>
          ))}
        </div>

        {filteredMarkets.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No markets found</h3>
            <p className="text-muted-foreground">
              {markets.length === 0 
                ? "No markets have been created yet. Create the first market in the admin dashboard."
                : "Try adjusting your search criteria or explore different regions"
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Markets;