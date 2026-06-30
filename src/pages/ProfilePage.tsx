import { useState } from "react";
import { Trash2, UserRound } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { isWritingPlan, planLabel, useAppState } from "../lib/appState";

export function ProfilePage() {
  const { user, plan, freeChecksLeft, projectsCreated, exportsCreated, logout } = useAppState();
  const [message, setMessage] = useState("");

  return (
    <div className="two-column">
      <SectionCard title="Profile edit">
        <form className="stack-form">
          <label>Name<input defaultValue={user?.name || "Student User"} /></label>
          <label>Email<input defaultValue={user?.email || "student@example.com"} /></label>
          <button className="primary-action" type="button" onClick={() => setMessage("Profile saved in demo session.")}>
            <UserRound size={16} /> Save profile
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </SectionCard>

      <SectionCard title="Account history">
        <div className="history-list">
          <p><strong>Current plan:</strong> {planLabel(plan)}</p>
          <p><strong>Free checks left:</strong> {plan === "FREE" ? freeChecksLeft : "Unlimited / paid"}</p>
          <p><strong>Paper builder:</strong> {isWritingPlan(plan) ? "Unlocked" : "Locked until writing plan"}</p>
          <p><strong>Documents:</strong> {projectsCreated} created</p>
          <p><strong>Exports:</strong> {exportsCreated}</p>
        </div>
        <button className="danger-action" onClick={() => { logout(); window.location.href = "/"; }}>
          <Trash2 size={16} /> Logout / clear session
        </button>
      </SectionCard>
    </div>
  );
}
