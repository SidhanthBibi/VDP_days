import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUserAccess = async () => {
      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user) {
        setLoading(false);
        return;
      }

      const currentUser = sessionData.session.user;
      setUser(currentUser);

      // First check if user email is a Club_Coordinator in any club
      const { data: coordinatorClub, error: coordinatorError } = await supabase
        .from("Clubs")
        .select("*")
        .eq("Club_Coordinator", currentUser.email)
        .maybeSingle();

      if (!coordinatorError && coordinatorClub) {
        // User is a coordinator, grant access
        setAuthorized(true);
        setLoading(false);
        return;
      }

      // Then check if user's email is in the access array of any club
      const { data: clubs, error: clubsError } = await supabase
        .from("Clubs")
        .select("*");

      if (clubsError) {
        console.error("Error fetching clubs:", clubsError);
        setLoading(false);
        return;
      }

      // Check each club's access array for the user's email
      const hasAccess = clubs.some(club => {
        // Ensure access is an array before checking
        if (Array.isArray(club.access)) {
          return club.access.includes(currentUser.email);
        }
        return false;
      });

      setAuthorized(hasAccess);
      setLoading(false);
    };

    checkUserAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If not logged in, redirect to login page with return URL
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} />;
  }

  // If logged in but not authorized, redirect to 404
  return authorized ? children : <Navigate to="/404" />;
};

export default ProtectedRoute;