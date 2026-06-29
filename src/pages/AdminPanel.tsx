import { KeyRound, ShieldCheck, UserMinus } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { StatGrid } from "../components/StatGrid";
import { usageMetrics } from "../data/mockData";

const users = [
  { name: "Aarav Sharma", email: "aarav@example.com", plan: "Premium", usage: 84 },
  { name: "Neha Singh", email: "neha@example.com", plan: "Combo", usage: 31 },
  { name: "Riya Patel", email: "riya@example.com", plan: "AI Tool", usage: 17 }
];

export function AdminPanel() {
  return (
    <div className="page-grid">
      <SectionCard title="Admin panel" description="Real-time operational data should come from API usage and user tables.">
        <StatGrid stats={usageMetrics} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Plan</th>
                <th>AI usage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.plan}</td>
                  <td>{user.usage}</td>
                  <td className="action-cell">
                    <button className="icon-btn" title="Grant premium"><ShieldCheck size={16} /></button>
                    <button className="icon-btn" title="Reset password"><KeyRound size={16} /></button>
                    <button className="icon-btn" title="Revoke premium"><UserMinus size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
