import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-emerald-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-8xl font-extrabold text-emerald-400 mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-emerald-300 mb-8">The page you're looking for doesn't exist or was removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
