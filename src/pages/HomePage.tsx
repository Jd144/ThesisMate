import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileSearch, LockKeyhole, PenLine, ShieldCheck } from "lucide-react";
import { plans } from "../data/mockData";

const steps = [
  "Create account",
  "Select free or paid plan",
  "Enter title, topic, format, outline choice, and figure/flowchart notes",
  "Approve outline",
  "Generate paper section by section",
  "Edit manually or with prompts",
  "Run checks and export"
];

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div>
          <p className="eyebrow">ThesisMate for students and researchers</p>
          <h1>Plan, write, edit, check, and export academic papers in one guided workspace.</h1>
          <p>
            Users start with a clear input form, approve the outline, then generate the paper step by step.
            Free users get limited checks; paid users unlock paper writing and advanced editing.
          </p>
          <div className="button-row">
            <Link className="primary-action" to="/auth">Login / Sign up <ArrowRight size={16} /></Link>
            <Link className="secondary-action" to="/pricing">View plans</Link>
          </div>
        </div>
        <div className="home-preview">
          <span className="badge success">Correct flow</span>
          {steps.map((step, index) => (
            <div className="preview-step" key={step}>
              <strong>{index + 1}</strong>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-band">
        <article>
          <FileSearch size={24} />
          <h2>Free plan</h2>
          <p>2 uses per month for similarity and spell checks only. Paper writing stays locked.</p>
        </article>
        <article>
          <PenLine size={24} />
          <h2>Paid paper writing</h2>
          <p>Title, description, outline choice, format, image notes, flowchart notes, and editable output.</p>
        </article>
        <article>
          <ShieldCheck size={24} />
          <h2>Responsible checks</h2>
          <p>Highlights similarity and AI-like patterns with suggestions, without false guarantees.</p>
        </article>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <h2>Plans decide what the user can do</h2>
            <p>Limits and access should come from real account usage, not fake dashboard numbers.</p>
          </div>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              {plan.features.map((feature) => (
                <p key={feature}><CheckCircle2 size={16} /> {feature}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="home-section split-info">
        <div>
          <LockKeyhole size={24} />
          <h2>Master admin panel</h2>
          <p>
            Admin login is separate by role. Master admin can control users, plans, limits, usage,
            payments, and website settings from real database data.
          </p>
        </div>
        <div className="admin-email-box">
          <span>Master admin email</span>
          <strong>charanjaydeep712@gmail.com</strong>
          <small>Password must be stored securely as an environment variable or hashed database seed.</small>
        </div>
      </section>
    </main>
  );
}
