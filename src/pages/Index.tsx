import React, { useEffect } from "react";
import Home from "./Home";
import { supabase } from "@/integrations/supabase/client";

const Index: React.FC = () => {
  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Session:", data.session);
    };
    checkAuth();
  }, []);

  return <Home />;
};

export default Index;
