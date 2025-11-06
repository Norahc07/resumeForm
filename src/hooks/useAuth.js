import { useState, useEffect } from 'react';
import { onAuthStateChange, checkAdminStatus } from '../firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        const adminStatus = await checkAdminStatus(authUser.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, loading };
};

