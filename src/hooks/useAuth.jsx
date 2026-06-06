import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, payload) => {
      setSession(payload.session ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error);
      throw error;
    }
    setSession(data.session);
    return data.session;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error);
      throw error;
    }
    setSession(null);
  };

  const role =
    session?.user?.app_metadata?.role ||
    session?.user?.user_metadata?.role ||
    'admin';

  const isAdmin = role === 'admin';

  return {
    session,
    loading,
    error,
    role,
    isAdmin,
    signIn,
    signOut,
  };
}
