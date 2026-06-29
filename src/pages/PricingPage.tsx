import { Check } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { plans } from "../data/mockData";

export function PricingPage() {
  return (
    <SectionCard title="Pricing" description="Clear plan separation with Premium unlocking editor, builder, and exports.">
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            {plan.features.map((feature) => (
              <p key={feature}><Check size={16} /> {feature}</p>
            ))}
            <button className={plan.featured ? "primary-action" : "secondary-action"}>Choose plan</button>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
