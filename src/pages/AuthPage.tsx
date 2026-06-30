import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useAppState } from "../lib/appState";

export function AuthPage() {
  const { login, signup } = useAppState();
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function submit(mode: "login" | "signup") {
    if (!email.includes("@") || password.length < 4) {
      setMessage("Valid email aur minimum 4 character password daalo.");
      return;
    }
    if (mode === "login") login(email, password);
    else signup(email, password);
    window.location.href = "/app";
  }

  return (
    <div className="two-column">
      <SectionCard title="Login / Sign up" description="Yahaan se session start hoga. Demo me data browser me save hota hai; backend DB baad me attach hoga.">
        <form className="stack-form">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          </label>
          <button className="primary-action" type="button" onClick={() => submit("login")}>
            <Mail size={16} /> Login with email
          </button>
          <button className="secondary-action" type="button" onClick={() => submit("signup")}>
            Create account
          </button>
          <button className="secondary-action" type="button" onClick={() => setMessage("Google login ke liye OAuth keys later set karenge.")}>
            Continue with Google
          </button>
          <Link className="secondary-action" to="/app">
            Continue demo
          </Link>
          <button className="link-button" type="button" onClick={() => setMessage("Forgot password email service connect hone ke baad send hoga.")}>
            Forgot password?
          </button>
          {message ? <p className="form-message">{message}</p> : null}
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
