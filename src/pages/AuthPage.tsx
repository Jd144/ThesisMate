import { Mail, KeyRound } from "lucide-react";
import { SectionCard } from "../components/SectionCard";

export function AuthPage() {
  return (
    <div className="two-column">
      <SectionCard title="Login" description="Email, password, Google login, and forgot password flows are API-ready.">
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
          <button className="link-button" type="button">
            Forgot password?
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Secure account controls">
        <div className="check-list">
          <p><KeyRound size={16} /> Password hashing and JWT sessions on backend.</p>
          <p><KeyRound size={16} /> Profile edit and delete account confirmation endpoints.</p>
          <p><KeyRound size={16} /> Plan history and usage history tables included.</p>
        </div>
      </SectionCard>
    </div>
  );
}
