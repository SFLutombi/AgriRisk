import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, TrendingUp, Activity, DollarSign, CheckCircle, Droplets, Wheat, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import MarketCard from "@/components/MarketCard";
import StatsCard from "@/components/StatsCard";
import heroImage from "@/assets/hero-agriculture.jpg";

const Index = () => {
  // Mock trending markets data
  const trendingMarkets = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Agricultural prediction markets" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Turning prediction markets into a{" "}
              <span className="text-tertiary-foreground">safety net</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-slide-up">
              Farmers stake on rainfall outcomes and get payouts when crops fail. 
              Community-powered agricultural insurance through prediction markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-scale-in">
              <Link to="/markets">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore Markets
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Staked"
              value="R2.4M"
              description="Total value staked across all markets"
              icon={DollarSign}
              trend="+15% this month"
              trendPositive={true}
            />
            <StatsCard
              title="Active Users"
              value="1,247"
              description="Farmers and traders participating"
              icon={Users}
              trend="+89 this week"
              trendPositive={true}
            />
            <StatsCard
              title="Payouts Distributed"
              value="R987K"
              description="Successfully paid out to farmers"
              icon={CheckCircle}
              trend="R123K this month"
              trendPositive={true}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-hero mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to protect your crops and earn from accurate predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: MapPin,
                title: "Select a Market",
                description: "Choose weather or crop outcome markets in your region"
              },
              {
                step: 2,
                icon: TrendingUp,
                title: "Stake on Outcome",
                description: "Predict the outcome and stake your position (Yes/No)"
              },
              {
                step: 3,
                icon: Activity,
                title: "Oracle Resolves",
                description: "Weather data and harvest results determine the outcome"
              },
              {
                step: 4,
                icon: DollarSign,
                title: "Collect Payout",
                description: "Winners receive payouts, farmers get protected"
              }
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="text-center group animate-fade-in" style={{ animationDelay: `${step * 0.2}s` }}>
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Markets */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gradient-hero mb-4">
                Trending Markets
              </h2>
              <p className="text-xl text-muted-foreground">
                Join the most active prediction markets
              </p>
            </div>
            <Link to="/markets">
              <Button variant="outline">
                View All Markets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingMarkets.map((market, index) => (
              <div key={market.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <MarketCard {...market} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of farmers using prediction markets as agricultural insurance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/markets">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start Trading
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-card-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-gradient-hero">AgriRisk</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Turning prediction markets into agricultural safety nets for farmers across South Africa.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Markets</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Weather Markets</li>
                <li>Crop Markets</li>
                <li>Regional Markets</li>
                <li>All Markets</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>How It Works</li>
                <li>Market Guide</li>
                <li>Risk Management</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-card-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AgriRisk. All rights reserved. Empowering farmers through prediction markets.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
