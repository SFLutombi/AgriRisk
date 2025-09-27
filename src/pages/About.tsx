import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const About = () => {
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
      
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-light dark:text-text-dark mb-6">
            About AgriRisk
          </h1>
          <p className="text-xl text-subtext-light dark:text-subtext-dark max-w-2xl mx-auto">
            We're transforming how farmers manage risk by turning prediction markets 
            into agricultural insurance for communities across South Africa.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 mb-12 bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200 dark:border-green-800">
              <span className="material-icons text-green-500 text-3xl">favorite</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Our Mission</h2>
            <p className="text-lg text-subtext-light dark:text-subtext-dark leading-relaxed">
              To democratize agricultural risk management by creating community-powered 
              prediction markets that provide farmers with accessible, transparent, and 
              effective protection against weather and crop uncertainties.
            </p>
          </div>
        </Card>

        {/* How We're Different */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 text-text-light dark:text-text-dark">Why Prediction Markets for Agriculture?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="material-icons text-green-500 text-2xl">shield</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-light dark:text-text-dark">Community Protection</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                Instead of expensive insurance premiums, farmers pool resources in prediction 
                markets. When crops fail, the community automatically provides support through 
                market mechanisms.
              </p>
            </Card>

            <Card className="p-6 bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="material-icons text-green-500 text-2xl">trending_up</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-light dark:text-text-dark">Market-Driven Pricing</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                Risk pricing is determined by collective wisdom rather than insurance 
                companies. This creates fairer, more accurate pricing that reflects 
                real-world conditions.
              </p>
            </Card>

            <Card className="p-6 bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="material-icons text-green-500 text-2xl">group</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-light dark:text-text-dark">Accessible to All</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                No complex paperwork, credit checks, or bureaucracy. Any farmer can 
                participate with minimal capital and receive immediate protection for 
                their crops.
              </p>
            </Card>

            <Card className="p-6 bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="material-icons text-green-500 text-2xl">public</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-light dark:text-text-dark">Transparent & Trustless</h3>
              <p className="text-subtext-light dark:text-subtext-dark">
                All transactions are transparent, and payouts are automatically executed 
                based on verifiable weather data and harvest outcomes. No disputes, 
                no delays.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works Detail */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 text-text-light dark:text-text-dark">The AgriRisk Process</h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-200 dark:border-green-800">
                <span className="text-green-500 font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">Market Creation</h3>
                <p className="text-subtext-light dark:text-subtext-dark">
                  We create prediction markets for specific weather events and crop outcomes 
                  in different regions. Examples include "Will rainfall exceed 30mm in Limpopo 
                  this week?" or "Will maize yields be above average in KZN this season?"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-200 dark:border-green-800">
                <span className="text-green-500 font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">Community Participation</h3>
                <p className="text-subtext-light dark:text-subtext-dark">
                  Farmers and traders stake on outcomes they believe will occur. Farmers 
                  typically bet against their own crops (buying insurance), while traders 
                  provide liquidity based on their analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-200 dark:border-green-800">
                <span className="text-green-500 font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">Oracle Resolution</h3>
                <p className="text-subtext-light dark:text-subtext-dark">
                  Trusted weather stations and agricultural data sources automatically 
                  resolve markets based on real-world outcomes. No human intervention 
                  or subjective judgment required.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-200 dark:border-green-800">
                <span className="text-green-500 font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">Automatic Payouts</h3>
                <p className="text-subtext-light dark:text-subtext-dark">
                  When crops fail or weather events occur, farmers automatically receive 
                  payouts from the pool. When crops succeed, farmers forfeit their stake 
                  but keep their successful harvest.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="mb-16">
          <Card className="p-8 bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200 dark:border-green-800">
                <span className="material-icons text-green-500 text-3xl">lightbulb</span>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Our Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="text-3xl font-bold mb-2 text-text-light dark:text-text-dark">1,247</div>
                  <div className="text-subtext-light dark:text-subtext-dark">Farmers Protected</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2 text-text-light dark:text-text-dark">R987K</div>
                  <div className="text-subtext-light dark:text-subtext-dark">Payouts Distributed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2 text-text-light dark:text-text-dark">74%</div>
                  <div className="text-subtext-light dark:text-subtext-dark">Average Success Rate</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-text-light dark:text-text-dark">Join the AgriRisk Community</h2>
          <p className="text-xl text-subtext-light dark:text-subtext-dark mb-8">
            Whether you're a farmer looking for crop protection or a trader interested 
            in agricultural markets, AgriRisk offers opportunities for everyone.
          </p>
          <div className="flex justify-center">
            <Link to="/markets">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                Explore Markets
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;