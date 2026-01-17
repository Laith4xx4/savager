import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-display font-bold text-white">404</h1>
        <p className="mb-8 text-xl text-white/60">عذراً! الصفحة التي تبحث عنها غير موجودة</p>
        <a
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;
