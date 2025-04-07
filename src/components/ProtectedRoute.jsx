import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUserAccess = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setLoading(false);
        return;
      }

      setUser(data.user);

      // Check if the user's email is inside the access array
      const { data: clubData, error: clubError } = await supabase
        .from("Clubs")
        .select("access")
        .contains("access", [data.user.email]) // Check if email exists in the JSON array
        .maybeSingle();

      if (!clubError && clubData) {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkUserAccess();
  }, []);

  if (loading) return <div>Loading...</div>;

  return authorized ? children : <Navigate to="/404" />;
};

export default ProtectedRoute;
