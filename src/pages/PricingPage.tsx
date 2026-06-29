import { Check } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { plans } from "../data/mockData";

export function PricingPage() {
  return (
    <SectionCard title="Plans" description="Free users only get 2 monthly checks. Paper writing needs a paid plan.">
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            {plan.features.map((feature) => (
              <p key={feature}><Check size={16} /> {feature}</p>
            ))}
            <button className={plan.featured ? "primary-action" : "secondary-action"}>
              {plan.name === "Free" ? "Start free" : "Choose plan"}
            </button>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
