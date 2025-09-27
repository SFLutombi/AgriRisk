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
<<<<<<< HEAD
      <section className="relative py-24 md:py-40 text-center bg-white overflow-hidden">
        {/* Circular Grid Background */}
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
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-black">
            Prediction markets as a <span className="text-green-500">safety net</span> for agriculture.
            </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-600 mb-10">
            Farmers stake on rainfall outcomes and get payouts when crops fail. Community-powered agricultural insurance through decentralized prediction markets.
            </p>
          <div className="flex justify-center space-x-4">
              <Link to="/markets">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                  Explore Markets
                </Button>
              </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-700">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="pt-8 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-black/20 flex items-center space-x-6">
              <div className="bg-green-500/10 dark:bg-green-500/20 p-4 rounded-full">
                <span className="material-icons text-green-500 text-4xl">account_balance_wallet</span>
              </div>
              <div>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">Total Staked</p>
                <p className="text-3xl font-bold text-text-light dark:text-text-dark">R2.4M</p>
                <p className="text-xs text-subtext-light dark:text-subtext-dark">Total value staked across all markets</p>
                <p className="text-xs text-green-500 font-medium mt-1">+15% this month</p>
              </div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-black/20 flex items-center space-x-6">
              <div className="bg-green-500/10 dark:bg-green-500/20 p-4 rounded-full">
                <span className="material-icons text-green-500 text-4xl">people</span>
              </div>
              <div>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">Active Users</p>
                <p className="text-3xl font-bold text-text-light dark:text-text-dark">1,247</p>
                <p className="text-xs text-subtext-light dark:text-subtext-dark">Farmers and traders participating</p>
                <p className="text-xs text-green-500 font-medium mt-1">+89 this week</p>
              </div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-black/20 flex items-center space-x-6">
              <div className="bg-green-500/10 dark:bg-green-500/20 p-4 rounded-full">
                <span className="material-icons text-green-500 text-4xl">history_edu</span>
              </div>
              <div>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">Payouts Distributed</p>
                <p className="text-3xl font-bold text-text-light dark:text-text-dark">R987K</p>
                <p className="text-xs text-subtext-light dark:text-subtext-dark">Successfully paid out to farmers</p>
                <p className="text-xs text-green-500 font-medium mt-1">R123K this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pt-12 pb-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-text-light dark:text-text-dark">How It Works</h2>
          <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-2xl mx-auto mb-16">
            Four simple steps to protect your crops and earn from accurate predictions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-5 border-2 border-green-200 dark:border-green-800">
                <span className="material-icons text-green-500 text-3xl">place</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">1. Select a Market</h3>
              <p className="text-subtext-light dark:text-subtext-dark text-sm">Choose a prediction outcome market in your region</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-5 border-2 border-green-200 dark:border-green-800">
                <span className="material-icons text-green-500 text-3xl">add_shopping_cart</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">2. Stake on Outcome</h3>
              <p className="text-subtext-light dark:text-subtext-dark text-sm">Predict the outcome and stake your position (Yes/No)</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-5 border-2 border-green-200 dark:border-green-800">
                <span className="material-icons text-green-500 text-3xl">show_chart</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">3. Oracle Resolves</h3>
              <p className="text-subtext-light dark:text-subtext-dark text-sm">Weather data and harvest results determine the outcome</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-5 border-2 border-green-200 dark:border-green-800">
                <span className="material-icons text-green-500 text-3xl">payments</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-light dark:text-text-dark">4. Collect Payout</h3>
              <p className="text-subtext-light dark:text-subtext-dark text-sm">Winners collect, losers pay. Farmers get protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Markets */}
      <section className="pt-8 pb-20 md:pb-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-light dark:text-text-dark mb-4">Trending Markets</h2>
            <Link to="/markets" className="text-green-500 hover:underline font-medium flex items-center justify-center text-sm">
              View All Markets <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="flex items-start mb-4">
                <span className="material-symbols-outlined text-blue-500 mr-3 mt-1">cloud</span>
                <div>
                  <p className="font-semibold text-base text-text-light dark:text-text-dark leading-snug">Rainfall &gt; 30mm in Limpopo this week</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 py-0.5 px-2 rounded-full font-medium">Weather</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-0.5 px-2 rounded-full font-medium">Limpopo</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-subtext-light dark:text-subtext-dark mb-5 flex-grow">Will the Limpopo region receive more than 30mm of rainfall in the next 7 days?</p>
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center text-xs text-subtext-light dark:text-subtext-dark">
                  <span>Prediction Split</span>
                  <span>R12,500 staked</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-green-600 dark:text-green-400">Yes: 65%</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">No: 35%</span>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
                <div className="flex justify-between items-center text-sm text-subtext-light dark:text-subtext-dark mb-4">
                  <span className="flex items-center"><span className="material-symbols-outlined mr-1.5 text-base">group</span> 27 participants</span>
                  <span className="flex items-center"><span className="material-symbols-outlined mr-1.5 text-base">timer</span> 3 days left</span>
                </div>
                <Link to="/market/1">
                  <button className="w-full h-10 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-white dark:text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm">Join Market</button>
                </Link>
              </div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="flex items-start mb-4">
                <span className="material-symbols-outlined text-yellow-500 mr-3 mt-1">agriculture</span>
                <div>
                  <p className="font-semibold text-base text-text-light dark:text-text-dark leading-snug">Maize yield above 5 ton/hectare KZN</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 py-0.5 px-2 rounded-full font-medium">Crop Yield</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-0.5 px-2 rounded-full font-medium">KwaZulu Natal</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-subtext-light dark:text-subtext-dark mb-5 flex-grow">Will the average maize yield in KwaZulu Natal exceed 5 tons per hectare this season?</p>
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center text-xs text-subtext-light dark:text-subtext-dark">
                  <span>Prediction Split</span>
                  <span>R6,500 staked</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-green-600 dark:text-green-400">Yes: 45%</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">No: 55%</span>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
                <div className="flex justify-between items-center text-sm text-subtext-light dark:text-subtext-dark mb-4">
                  <span className="flex items-center"><span className="material-symbols-outlined mr-1.5 text-base">group</span> 22 participants</span>
                  <span className="flex items-center"><span className="material-symbols-outlined mr-1.5 text-base">timer</span> 14 days left</span>
                </div>
                <Link to="/market/2">
                  <button className="w-full h-10 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-white dark:text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm">Join Market</button>
                </Link>
              </div>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="flex items-start mb-4">
                <span className="material-symbols-outlined text-orange-500 mr-3 mt-1">water_drop</span>
                <div>
                  <p className="font-semibold text-base text-text-light dark:text-text-dark leading-snug">Drought declaration in Eastern Cape</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 py-0.5 px-2 rounded-full font-medium">Drought</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-0.5 px-2 rounded-full font-medium">Eastern Cape</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-subtext-light dark:text-subtext-dark mb-5 flex-grow">Will the Eastern Cape government declare a state of drought in the next 30 days?</p>
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center text-xs text-subtext-light dark:text-subtext-dark">
                  <span>Prediction Split</span>
                  <span>R15,200 staked</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '28%'}}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-green-600 dark:text-green-400">Yes: 28%</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">No: 72%</span>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
                <div className="flex justify-between items-center text-sm text-subtext-light dark:text-subtext-dark mb-4">
                  <span className="flex items-center"><span className="material-symbols-outlined mr-1.5 text-base">group</span> 89 participants</span>
                  <span className="flex items-center"><span className="material-symbols-outlined mr-1.5 text-base">timer</span> 21 days left</span>
                </div>
                <Link to="/market/3">
                  <button className="w-full h-10 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-white dark:text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm">Join Market</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-28">
=======
      <section className="relative overflow-hidden">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Agricultural prediction markets" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80" />
        </div>
        
<<<<<<< HEAD
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-xl text-white/90 mb-8">
=======
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
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
            Join thousands of farmers using prediction markets as agricultural insurance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/markets">
<<<<<<< HEAD
              <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white">
=======
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
                Start Trading
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
<<<<<<< HEAD
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
=======
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
<<<<<<< HEAD
      <footer className="bg-white border-t border-slate-200 dark:border-slate-800 py-12">
=======
      <footer className="bg-card border-t border-card-border py-12">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
<<<<<<< HEAD
                <span className="material-icons text-green-500 text-3xl">grass</span>
                <span className="text-xl font-bold text-text-light dark:text-text-dark">AgriRisk</span>
              </div>
              <p className="text-subtext-light dark:text-subtext-dark text-sm">
=======
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-gradient-hero">AgriRisk</span>
              </div>
              <p className="text-muted-foreground text-sm">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
                Turning prediction markets into agricultural safety nets for farmers across South Africa.
              </p>
            </div>
            
            <div>
<<<<<<< HEAD
              <h4 className="font-semibold mb-4 text-text-light dark:text-text-dark">Markets</h4>
              <ul className="space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
=======
              <h4 className="font-semibold mb-4">Markets</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
                <li>Weather Markets</li>
                <li>Crop Markets</li>
                <li>Regional Markets</li>
                <li>All Markets</li>
              </ul>
            </div>
            
            <div>
<<<<<<< HEAD
              <h4 className="font-semibold mb-4 text-text-light dark:text-text-dark">Resources</h4>
              <ul className="space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
=======
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
                <li>How It Works</li>
                <li>Market Guide</li>
                <li>Risk Management</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
<<<<<<< HEAD
              <h4 className="font-semibold mb-4 text-text-light dark:text-text-dark">Support</h4>
              <ul className="space-y-2 text-sm text-subtext-light dark:text-subtext-dark">
=======
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
<<<<<<< HEAD
          <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center text-sm text-subtext-light dark:text-subtext-dark">
=======
          <div className="border-t border-card-border mt-8 pt-8 text-center text-sm text-muted-foreground">
>>>>>>> f684dfb8b5b4bfa06523bb8e78c26be4defbcbfc
            <p>&copy; 2024 AgriRisk. All rights reserved. Empowering farmers through prediction markets.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
