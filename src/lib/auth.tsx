import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "management" | "reception" | "doctor";

type Session = { username: string; role: Role } | null;

interface AuthCtx {
  session: Session;
  login: (s: NonNullable<Session>) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hms-session");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migrate away from removed "staff" role
        if (parsed?.role === "staff") {
          localStorage.removeItem("hms-session");
        } else {
          setSession(parsed);
        }
      }
    } catch {}
  }, []);

  const login = (s: NonNullable<Session>) => {
    setSession(s);
    localStorage.setItem("hms-session", JSON.stringify(s));
  };
  const logout = () => {
    setSession(null);
    localStorage.removeItem("hms-session");
  };

  return <Ctx.Provider value={{ session, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("AuthProvider missing");
  return c;
};

export const roleHome: Record<Role, string> = {
  management: "/management",
  reception: "/reception",
  doctor: "/doctor",
};
