import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type PlanKey = "FREE" | "AI_TOOL" | "SIMILARITY_CHECK" | "COMBO" | "PREMIUM";

type AppUser = {
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

type AppState = {
  user: AppUser | null;
  plan: PlanKey;
  freeChecksLeft: number;
  projectsCreated: number;
  exportsCreated: number;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  logout: () => void;
  selectPlan: (plan: PlanKey) => void;
  useCheck: () => { ok: true } | { ok: false; message: string };
  saveProject: () => void;
  recordExport: () => void;
};

const STORAGE_KEY = "thesismate-app-state";

const defaultState = {
  user: null,
  plan: "FREE" as PlanKey,
  freeChecksLeft: 2,
  projectsCreated: 0,
  exportsCreated: 0
};

const AppStateContext = createContext<AppState | null>(null);

function readInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readInitialState);

  function persist(next: typeof defaultState) {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value = useMemo<AppState>(() => ({
    ...state,
    login(email: string) {
      const next = {
        ...state,
        user: {
          email,
          name: email.split("@")[0] || "Student",
          role: email.toLowerCase() === "charanjaydeep712@gmail.com" ? "ADMIN" as const : "USER" as const
        }
      };
      persist(next);
    },
    signup(email: string) {
      const next = {
        ...state,
        user: {
          email,
          name: email.split("@")[0] || "Student",
          role: email.toLowerCase() === "charanjaydeep712@gmail.com" ? "ADMIN" as const : "USER" as const
        }
      };
      persist(next);
    },
    logout() {
      persist({ ...state, user: null });
    },
    selectPlan(plan: PlanKey) {
      const next = { ...state, plan, freeChecksLeft: plan === "FREE" ? state.freeChecksLeft : 999 };
      persist(next);
    },
    useCheck() {
      if (state.plan !== "FREE") return { ok: true };
      if (state.freeChecksLeft <= 0) {
        return { ok: false, message: "Free plan limit finished. Please choose a paid plan to continue." };
      }
      persist({ ...state, freeChecksLeft: state.freeChecksLeft - 1 });
      return { ok: true };
    },
    saveProject() {
      persist({ ...state, projectsCreated: state.projectsCreated + 1 });
    },
    recordExport() {
      persist({ ...state, exportsCreated: state.exportsCreated + 1 });
    }
  }), [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used inside AppStateProvider");
  return context;
}

export function isWritingPlan(plan: PlanKey) {
  return plan === "AI_TOOL" || plan === "COMBO" || plan === "PREMIUM";
}

export function planLabel(plan: PlanKey) {
  return {
    FREE: "Free",
    AI_TOOL: "AI Tool",
    SIMILARITY_CHECK: "Similarity Check",
    COMBO: "Combo",
    PREMIUM: "Premium"
  }[plan];
}
