import { Trash2, UserRound } from "lucide-react";
import { SectionCard } from "../components/SectionCard";

export function ProfilePage() {
  return (
    <div className="two-column">
      <SectionCard title="Profile edit">
        <form className="stack-form">
          <label>Name<input defaultValue="Student User" /></label>
          <label>Email<input defaultValue="student@example.com" /></label>
          <button className="primary-action" type="button"><UserRound size={16} /> Save profile</button>
        </form>
      </SectionCard>

      <SectionCard title="Account history">
        <div className="history-list">
          <p><strong>Current plan:</strong> Free</p>
          <p><strong>Free checks left:</strong> 2 this month</p>
          <p><strong>Paper builder:</strong> Locked until paid plan</p>
          <p><strong>Documents:</strong> 0 created</p>
        </div>
        <button className="danger-action"><Trash2 size={16} /> Delete account</button>
      </SectionCard>
    </div>
  );
}
