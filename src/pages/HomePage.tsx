import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileSearch, LockKeyhole, PenLine, ShieldCheck, Sparkles } from "lucide-react";
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
        <div className="home-copy">
          <span className="release-pill"><Sparkles size={16} /> New ThesisMate flow</span>
          <p className="eyebrow">AI academic writing platform</p>
          <h1>From topic to formatted paper, with plan limits and human review built in.</h1>
          <p>
            Open website, understand the product, login or sign up, choose a plan, then write or check documents.
            Free users get 2 monthly checks. Paid users unlock paper generation, editing, and export.
          </p>
          <div className="button-row">
            <Link className="primary-action" to="/auth">Login / Sign up <ArrowRight size={16} /></Link>
            <Link className="secondary-action" to="/pricing">View plans</Link>
          </div>
          <div className="trust-row">
            <span>No fake dashboard numbers</span>
            <span>No unsafe detection-bypass claims</span>
            <span>Admin data from database</span>
          </div>
        </div>

        <div className="product-preview" aria-label="ThesisMate workflow preview">
          <div className="preview-window-bar">
            <span></span>
            <span></span>
            <span></span>
            <strong>Paper Builder</strong>
          </div>
          <div className="paper-card">
            <small>Input</small>
            <h2>Impact of AI tools on postgraduate writing</h2>
            <p>Format: APA · Outline: Platform creates · Visuals: Flowchart after methodology</p>
          </div>
          <div className="preview-columns">
            <div>
              <small>Plan gate</small>
              <strong>Free: checks only</strong>
            </div>
            <div>
              <small>Paid output</small>
              <strong>Section-wise paper</strong>
            </div>
          </div>
          <div className="home-preview compact">
            {steps.slice(0, 5).map((step, index) => (
              <div className="preview-step" key={step}>
                <strong>{index + 1}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section workflow-strip">
        <div className="section-heading">
          <div>
            <h2>How input and output will work</h2>
            <p>User gives paper details first. The platform returns outline, sections, edit suggestions, checks, and export files.</p>
          </div>
        </div>
        <div className="io-grid">
          <div>
            <h3>User input</h3>
            <p>Title, description, domain, keywords, format, outline choice, figure/table/flowchart placement notes.</p>
          </div>
          <div>
            <h3>Platform output</h3>
            <p>Editable outline, section-wise draft, placeholders for visuals, checker explanations, DOCX/PDF exports.</p>
          </div>
          <div>
            <h3>Admin control</h3>
            <p>Users, plans, limits, premium access, usage, documents, and site settings from real data.</p>
          </div>
        </div>
      </section>

      <section className="home-section step-map">
        <div className="section-heading">
          <div>
            <h2>Full user journey</h2>
            <p>This is the route users should see before any dashboard opens.</p>
          </div>
        </div>
        <div className="journey-list">
          {steps.map((step, index) => (
            <div className="journey-item" key={step}>
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
