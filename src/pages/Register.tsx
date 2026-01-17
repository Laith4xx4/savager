import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة. تأكد من تطابق كلمات المرور");
      return;
    }

    if (password.length < 6) {
      toast.error("كلمة المرور قصيرة جداً. يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        userName,
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phoneNumber: phoneNumber || undefined,
        role: 'Client'
      });

      toast.success("تم إنشاء الحساب بنجاح! أهلاً بك في FitClub");

      // Redirect based on user role
      if (user?.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else if (user?.role === 'Coach') {
        navigate('/coach', { replace: true });
      } else if (user?.role === 'Member') {
        navigate('/member', { replace: true });
      } else {
        // Default to client dashboard for new 'Client' users
        navigate('/client', { replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل إنشاء الحساب. حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/hero-2.png')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />

        <div className="max-w-md text-center relative z-10 p-8 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-4 text-white">
            ابدأ رحلة لياقتك
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            انضم إلى مجتمع The Savage واحصل على الأدوات والدعم الذي تحتاجه لتحقيق أهدافك
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="w-10 h-10 object-contain relative z-10" />
            </div>
            <span className="font-display font-bold text-2xl text-white">The Savage</span>
          </Link>

          <h1 className="text-3xl font-display font-bold mb-2 text-white">إنشاء حساب جديد</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            انضم إلينا وابدأ تحويل حياتك اليوم
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-white/80">اسم المستخدم</Label>
              <Input
                id="userName"
                type="text"
                placeholder="username123"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={isLoading}
                dir="ltr"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/80">الاسم الأول</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="أحمد"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/80">اسم العائلة</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="محمد"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                dir="ltr"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">رقم الهاتف (اختياري)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+966 50 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                dir="ltr"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 h-11"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/80">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                dir="ltr"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-white/30 h-11"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-white text-black hover:bg-white/90 font-bold mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-white font-medium hover:underline hover:text-white/80 transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
