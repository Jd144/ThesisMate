import { Check } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { plans } from "../data/mockData";
import { PlanKey, useAppState } from "../lib/appState";

export function PricingPage() {
  const { plan: currentPlan, selectPlan, user } = useAppState();

  function choosePlan(plan: PlanKey) {
    selectPlan(plan);
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    window.location.href = plan === "FREE" || plan === "SIMILARITY_CHECK" ? "/app/similarity" : "/app/builder";
  }

  return (
    <SectionCard title="Plans" description="Free users only get 2 monthly checks. Paid plans unlock tools as per plan.">
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            {plan.features.map((feature) => (
              <p key={feature}><Check size={16} /> {feature}</p>
            ))}
            <button className={plan.featured ? "primary-action" : "secondary-action"} onClick={() => choosePlan(plan.key as PlanKey)}>
              {currentPlan === plan.key ? "Current plan" : plan.name === "Free" ? "Start free" : "Choose plan"}
            </button>
            {plan.name !== "Free" ? <small className="payment-note">Razorpay checkout ready. Key/env later set karna hai.</small> : null}
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
