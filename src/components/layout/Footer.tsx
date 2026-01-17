import { Link } from "react-router-dom";
import { Dumbbell, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="w-10 h-10 object-contain relative z-10" />
              </div>
              <span className="font-display font-bold text-2xl text-white">The Savage</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              ارتقِ بأدائك وحقق أهدافك مع أفضل المدربين والمرافق المتطورة. نحن هنا لنساعدك لتكون النسخة الأفضل من نفسك.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-6">روابط سريعة</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/coaches" className="text-white/60 hover:text-white transition-colors text-sm block">
                  المدربين
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="text-white/60 hover:text-white transition-colors text-sm block">
                  جدول الحصص
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/60 hover:text-white transition-colors text-sm block">
                  كن عضواً
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/60 hover:text-white transition-colors text-sm block">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-6">البرامج التدريبية</h4>
            <ul className="space-y-4">
              <li><span className="text-white/60 hover:text-white transition-colors text-sm cursor-pointer">كمال الأجسام</span></li>
              <li><span className="text-white/60 hover:text-white transition-colors text-sm cursor-pointer">اللياقة البدنية (CrossFit)</span></li>
              <li><span className="text-white/60 hover:text-white transition-colors text-sm cursor-pointer">يوغا ومرونة</span></li>
              <li><span className="text-white/60 hover:text-white transition-colors text-sm cursor-pointer">كارديو</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm group">
                <MapPin className="h-5 w-5 text-white/40 group-hover:text-white transition-colors mt-0.5" />
                <span className="group-hover:text-white transition-colors">الرياض، المملكة العربية السعودية<br />شارع التخصصي</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm group">
                <Phone className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm group">
                <Mail className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">info@thesavage.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} The Savage. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-white/40 hover:text-white text-sm transition-colors">
                سياسة الخصوصية
              </Link>
              <Link to="#" className="text-white/40 hover:text-white text-sm transition-colors">
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
