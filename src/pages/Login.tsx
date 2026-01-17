import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dumbbell, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loggedInUser = await login(emailOrUsername, password);
      toast.success("أهلاً بك مرة أخرى! تم تسجيل الدخول بنجاح");

      // Redirect based on user role from the returned object
      if (loggedInUser.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else if (loggedInUser.role === 'Coach') {
        navigate('/coach', { replace: true });
      } else {
        navigate('/member', { replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل تسجيل الدخول. تحقق من بياناتك");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-10 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="w-10 h-10 object-contain relative z-10" />
            </div>
            <span className="font-display font-bold text-2xl text-white">The Savage</span>
          </Link>

          <h1 className="text-4xl font-display font-bold mb-3 text-white">مرحباً بعودتك</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            سجل الدخول لحسابك لمتابعة رحلة لياقتك البدنية
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername" className="text-white/80">البريد الإلكتروني أو اسم المستخدم</Label>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="you@example.com"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                disabled={isLoading}
                dir="ltr"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 transition-colors h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/80">كلمة المرور</Label>
                <Link to="#" className="text-xs text-muted-foreground hover:text-white transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 transition-colors h-12"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-white text-black hover:bg-white/90 font-bold mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-white font-medium hover:underline hover:text-white/80 transition-colors">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/hero-1.png')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="max-w-md text-center relative z-10 p-8 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-4 text-white">
            حوّل حياتك
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            احصل على برامج تدريبية مخصصة، تتبع تقدمك، وتواصل مع مدربينا الخبراء في بيئة محفزة
          </p>
        </div>
      </div>
    </div>
  );
}
