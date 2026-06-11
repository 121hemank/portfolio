import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "hemankpatel1122@gmail.com";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          checkAdminStatus(session.user.id, session.user.email);
        } else {
          setIsAdmin(false);
          setAdminChecked(true);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        checkAdminStatus(session.user.id, session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string, email?: string | null) => {
    // Email must match the admin email
    if (email !== ADMIN_EMAIL) {
      setIsAdmin(false);
      setAdminChecked(true);
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data && !error);
    setAdminChecked(true);
  };

  const signIn = async (email: string, password: string) => {
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { error: { message: "Access denied. This email is not authorized." } as any };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (_email: string, _password: string) => {
    return { error: { message: "Sign up is disabled. Only the admin account can access this panel." } as any };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setIsAdmin(false);
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminChecked,
    signIn,
    signUp,
    signOut,
  };
};
