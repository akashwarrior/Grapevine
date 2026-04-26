import { Card } from "@/components/ui/card";
import { Target, Users, TrendingUp, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          Prediction Markets for You
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Grapevine brings the power of prediction markets to the events that matter to you in real-time.
        </p>
      </div>

      <Card className="p-8 mb-12 bg-muted/30">
        <h2 className="text-2xl font-medium mb-4">Why Localized Prediction Markets?</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          National platforms like Polymarket and Kalshi excel at global events, but they can't compete on hyper-local knowledge.
          Grapevine focuses on community-specific questions where members have genuine insider information.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Whether predicting campus events, neighborhood developments, or organizational decisions,
          you're leveraging firsthand experience that no external platform can replicate.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Information Advantage</h3>
              <p className="text-sm text-muted-foreground">
                Local events require insider knowledge. Community members understand patterns, context, and nuances that outsiders miss, creating more accurate predictions.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Natural Network Effects</h3>
              <p className="text-sm text-muted-foreground">
                Concentrated user base in physical and digital spaces enables rapid growth. Word spreads faster within a community that already knows each other.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Direct Relevance</h3>
              <p className="text-sm text-muted-foreground">
                Every market personally impacts users' lives. Higher engagement comes from predicting events that directly affect your daily experience.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Community Verification</h3>
              <p className="text-sm text-muted-foreground">
                Outcomes are easily verified by the community itself through public announcements and shared experiences. No complex oracle systems needed.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 mb-12">
        <h2 className="text-2xl font-medium mb-4">The Resolution Advantage</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Global platforms face a fundamental challenge: participants are dispersed and don't share common information sources.
          Polymarket tried decentralized token voting but faced manipulation issues. Kalshi uses centralized internal teams,
          which works but requires regulatory oversight and operational overhead.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Localized markets have a structural advantage: outcomes are typically based on <strong>objective, publicly verifiable sources</strong>.
          When a university officially posts exam averages, announces policy changes, or publishes election results,
          there's no ambiguity. The entire community sees the same authoritative source simultaneously.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This doesn't eliminate the need for trusted resolution - markets still need admins or moderators to input the official outcome.
          But the key difference is <strong>verifiability</strong>: anyone in the community can check the resolution against the
          same public source. This reduces disputes, lowers operational costs, and enables faster resolution than complex oracle systems.
        </p>
      </Card>

      <Card className="p-8 mb-12">
        <h2 className="text-2xl font-medium mb-4">The Strategy</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Rather than competing head-on with established national platforms, Grapevine creates a category of one.
          We're building the prediction market communities actually use by focusing on what global platforms can't:
          hyper-local, community-driven forecasting.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Start with one community, prove the model, then expand community by community. The same playbook that launched
          successful social platforms. Dominate a small market before scaling.
        </p>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-medium mb-4">The Vision</h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Every community, from universities to neighborhoods to organizations, has questions worth predicting.
          Grapevine proves that the future of prediction markets isn't just global events, but the local decisions
          and outcomes that shape everyday life.
        </p>
      </div>
    </div>
  );
}

