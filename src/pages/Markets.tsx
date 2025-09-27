import { useState } from "react";
import { Search, Filter, Droplets, Wheat, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MarketCard from "@/components/MarketCard";
import Navigation from "@/components/Navigation";

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  // Mock market data
  const markets = [
    {
      id: 1,
      title: "Rainfall > 30mm in Limpopo this week",
      description: "Will Limpopo province receive more than 30mm of rainfall in the next 7 days?",
      type: "weather" as const,
      totalStaked: "R12,500",
      yesPercentage: 68,
      noPercentage: 32,
      timeLeft: "3 days left",
      participants: 47,
      region: "Limpopo"
    },
    {
      id: 2,
      title: "Maize yield above 6 tons/hectare - KZN",
      description: "Will the average maize yield in KwaZulu-Natal exceed 6 tons per hectare this season?",
      type: "crop" as const,
      totalStaked: "R8,900",
      yesPercentage: 45,
      noPercentage: 55,
      timeLeft: "14 days left",
      participants: 23,
      region: "KwaZulu-Natal"
    },
    {
      id: 3,
      title: "Drought declaration in Eastern Cape",
      description: "Will the Eastern Cape government declare a drought emergency in the next 30 days?",
      type: "weather" as const,
      totalStaked: "R15,200",
      yesPercentage: 72,
      noPercentage: 28,
      timeLeft: "21 days left",
      participants: 89,
      region: "Eastern Cape"
    },
    {
      id: 4,
      title: "Sunflower harvest success - Free State",
      description: "Will Free State sunflower farmers achieve above-average harvest yields this season?",
      type: "crop" as const,
      totalStaked: "R6,750",
      yesPercentage: 38,
      noPercentage: 62,
      timeLeft: "45 days left",
      participants: 31,
      region: "Free State"
    },
    {
      id: 5,
      title: "Temperature exceeds 35°C for 5 consecutive days",
      description: "Will the Northern Cape experience 5+ consecutive days above 35°C this month?",
      type: "weather" as const,
      totalStaked: "R9,300",
      yesPercentage: 84,
      noPercentage: 16,
      timeLeft: "12 days left",
      participants: 56,
      region: "Northern Cape"
    },
    {
      id: 6,
      title: "Wheat quality grade - Western Cape",
      description: "Will Western Cape wheat achieve premium grade classification this harvest?",
      type: "crop" as const,
      totalStaked: "R11,100",
      yesPercentage: 59,
      noPercentage: 41,
      timeLeft: "62 days left",
      participants: 72,
      region: "Western Cape"
    }
  ];

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || market.type === typeFilter;
    const matchesRegion = regionFilter === "all" || market.region === regionFilter;
    
    return matchesSearch && matchesType && matchesRegion;
  });

  const provinces = [...new Set(markets.map(market => market.region))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-hero mb-2">All Markets</h1>
          <p className="text-muted-foreground">
            Browse and join prediction markets for weather events and crop outcomes
          </p>
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

        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No markets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or explore different regions
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Markets;