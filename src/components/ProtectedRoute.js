import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = invalid
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/verify`, {
          withCredentials: true,
        });
        if (res.data.valid) setUser(res.data.user);
        else setUser(null);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, [location.pathname]);

  // Show loading state only while checking
  if (user === undefined) {
    return <p className="h-screen flex items-center justify-center text-gray-500">Loading...</p>;
  }

  //  Redirect if no user or invalid token
  if (user === null) {
    return <Navigate to="/" replace />;
  }

  // Optional: Verify URL userId matches token user.id
  const urlUserId = params.userid || params.userId || params.id;
  if (urlUserId && user.id?.toString() !== urlUserId.toString()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

