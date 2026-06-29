import { Mail, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";

export function AuthPage() {
  return (
    <div className="two-column">
      <SectionCard title="Login / Sign up" description="Account ke baad user plan select karega, phir features unlock honge.">
        <form className="stack-form">
          <label>
            Email
            <input type="email" placeholder="student@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>
          <button className="primary-action" type="button">
            <Mail size={16} /> Login with email
          </button>
          <button className="secondary-action" type="button">
            Continue with Google
          </button>
          <Link className="secondary-action" to="/app">
            Continue demo
          </Link>
          <button className="link-button" type="button">
            Forgot password?
          </button>
        </form>
      </SectionCard>

      <SectionCard title="After login user sees">
        <div className="check-list">
          <p><KeyRound size={16} /> Free plan: 2 similarity/spell checks per month.</p>
          <p><KeyRound size={16} /> Paid plan: paper builder, editor, export, project save.</p>
          <p><KeyRound size={16} /> Admin role: hidden master panel access.</p>
        </div>
      </SectionCard>
    </div>
  );
}
