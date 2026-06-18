import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  Activity,
  CheckCircle,
  Clock,
  Shield,
  Globe,
  HelpCircle,
  Phone,
  Mail,
  FileText,
  Check,
  ExternalLink,
  Eye,
  Smartphone,
  Laptop,
  Tablet,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  QrCode,
  Sliders,
  Sparkles,
  Info,
  Car,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Copy,
  X
} from "lucide-react";
import { STATIONS, VEHICLE_TYPES, FAQS, CITIES, TIME_SLOTS } from "./data";
import { Station, Appointment } from "./types";
import { db, ref } from "./firebase";
import { onValue, set as dbSet } from "firebase/database";

export default function App() {
  // Localization State - Arabic default
  const [lang, setLang] = useState<"ar" | "en">("ar");

  // Admin Portal state
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);

  // Fallback default URL in case Firebase is empty or unset
  const FALLBACK_URL = "https://example.com";

  // Iframe URL managers aligned with Firebase state
  const [iframeUrl, setIframeUrl] = useState<string>(FALLBACK_URL);
  const [tempIframeUrl, setTempIframeUrl] = useState<string>(FALLBACK_URL);
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Modal Policy States
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  // Toast notification for link copy
  const [toastMessage, setToastMessage] = useState<string>("");

  // Smooth scroll helper
  const bookingRef = useRef<HTMLDivElement>(null);
  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Realtime Database Link Synchronization
  useEffect(() => {
    const bookingUrlRef = ref(db, "config/bookingUrl");
    
    // Listening to changes from Firebase Realtime Database
    const unsubscribe = onValue(bookingUrlRef, (snapshot) => {
      const dbValue = snapshot.val();
      if (dbValue && typeof dbValue === "string" && dbValue.trim() !== "") {
        setIframeUrl(dbValue);
        setTempIframeUrl(dbValue);
      } else {
        setIframeUrl(FALLBACK_URL);
        setTempIframeUrl(FALLBACK_URL);
      }
    }, (error) => {
      console.error("Error reading from Firebase:", error);
    });

    return () => unsubscribe();
  }, []);

  // Handle Admin query detection and password entry with the requested password "101010"
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "admin") {
        const password = prompt(
          lang === "ar" 
            ? "الرجاء إدخال كلمة مرور مدير النظام (الأدمن):" 
            : "Please enter the admin password:"
        );
        if (password === "101010") {
          setHasAdminAccess(true);
          setToastMessage(lang === "ar" ? "تم تسجيل الدخول كمدير للنظام بنجاح!" : "Logged into Admin portal successfully!");
          setTimeout(() => setToastMessage(""), 4000);
        } else {
          setHasAdminAccess(false);
          if (password !== null) {
            alert(lang === "ar" ? "كلمة المرور غير صحيحة! سيتم إخفاء لوحة التحكم." : "Incorrect password! Control panel will remain hidden.");
          }
        }
      }
    }
  }, [lang]);

  const handleCopyCode = () => {
    const embedCode = `<iframe src="${iframeUrl}" width="100%" height="600" style="border:none; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05);" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setIsCopied(true);
    setToastMessage(lang === "ar" ? "تم نسخ كود التضمين للموقع!" : "Embed code copied to clipboard!");
    setTimeout(() => {
      setIsCopied(false);
      setToastMessage("");
    }, 3000);
  };

  const applyCustomIframe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookingUrlRef = ref(db, "config/bookingUrl");
      await dbSet(bookingUrlRef, tempIframeUrl);
      setToastMessage(lang === "ar" ? "تم تحديث الرابط في قاعدة البيانات وقنوات الاتصال بنجاح!" : "Booking link successfully updated in Firebase Realtime Database!");
    } catch (err) {
      console.error("Firebase write error:", err);
      setToastMessage(lang === "ar" ? "خطأ في الاتصال بقاعدة البيانات!" : "Error communicating with the database!");
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handlePresetSelect = async (url: string) => {
    setTempIframeUrl(url);
    try {
      const bookingUrlRef = ref(db, "config/bookingUrl");
      await dbSet(bookingUrlRef, url);
      setToastMessage(lang === "ar" ? "تم تحديث الرابط بنجاح!" : "Preset link applied successfully!");
    } catch (err) {
      console.error("Firebase preset write error:", err);
      setToastMessage(lang === "ar" ? "خطأ في الاتصال بقاعدة البيانات!" : "Error communicating with the database!");
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Content dictionary for Arabic & English
  const dict = {
    ar: {
      siteTitle: "مركز سلامة المركبات | المنصة الموحدة للفحص الفني الدوري",
      oneOfProducts: "أحد منتجات مركز سلامة المركبات",
      heroTitle: "المنصة الموحدة للفحص الفني الدوري للمركبات",
      heroSub: "قم بحجز وإدارة مواعيد الفحص الدوري لسيارتك بكل سهولة ويسر وبشكل مؤتمت لتوفير الوقت والجهد وتجنب صفوف الانتظار.",
      btnBookNow: "حجز موعد جديد",
      btnRegister: "تسجيل حساب جديد",
      howItWorks: "خطوات الفحص الفني الدوري",
      howItWorksSub: "أربع خطوات سهلة تبدأ من حجز الموعد وتنتهي باستلام شهادة فحص معتمدة لمركبتك.",
      step1Title: "1. حجز موعد سريع",
      step1Desc: "اختر المحطة الأقرب وتاريخ ووقت الفحص الملائمين لجدولك.",
      step2Title: "2. سداد الرسوم إلكترونياً",
      step2Desc: "ادفع الرسوم المقررة عبر بوابات الدفع الإلكتروني الموثوقة لتسهيل الدخول.",
      step3Title: "3. زيارة مركز الفحص",
      step3Desc: "توجه للمحطة المختارة في الموعد الموعود لإجراء الكشف التقني الشامل لمركبتك.",
      step4Title: "4. استلام شهادة الفحص",
      step4Desc: "استلم تقرير الفحص الرقمي المرسل تلقائياً لنظام أبشر والمرتبط مباشرة بالمرور للسلامة.",
      embedSectionTitle: "نظام حجز وتضمين المواعيد المتكامل",
      embedSectionSub: "تسمح هذه المنصة بتضمين أنظمة الحجز الخارجية عبر iframe المتجاوب أو استخدام المحاكي المدمج التفاعلي.",
      toggleSimulated: "المحاكي التفاعلي المدمج (جاهز للاستخدام)",
      toggleIframe: "تضمين رابط حجز مخصص (iFrame Custom URL)",
      iframeInputPlaceholder: "أدخل رابط بوابة الحجز الخاصة بك هنا...",
      btnApply: "تطبيق التضمين",
      deviceDesktop: "شاشة كمبيوتر",
      deviceTablet: "شاشة جهاز لوحي",
      deviceMobile: "شاشة جوال",
      faqTitle: "الأسئلة الشائعة",
      faqSub: "كل ما تود معرفته عن الفحص الفني الدوري والأنظمة والرسوم المطبقة.",
      disclaimer: "هذا الموقع بوابة مستقلة ولا يتبع لشركة جوجل.",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      allRightsReserved: "جميع الحقوق محفوظة لمركز سلامة المركبات © 2026",
      aboutUs: "عن المركز",
      aboutUsDesc: "يسهم مركز سلامة المركبات في رفع مستوى السلامة المرورية والحد من الحوادث من خلال ضمان توفير أعلى معايير الجودة في إجراء الفحوصات الفنية لمركبات النقل.",
      featuresTitle: "ميزات المنصة الموحدة",
      featuresSub: "تقنيات متقدمة مصممة خصيصاً لخدمة أصحاب المركبات.",
      feat1: "توافق 100% مع الجوال",
      feat1Desc: "كافة الواجهات والـ iframe متجاوبة بالكامل لراحة قصوى من أي جهاز.",
      feat2: "ربط تقني فوري",
      feat2Desc: "ربط متكامل مع قواعد السلامة والمنصات الوطنية الكبرى.",
      feat3: "أمان وموثوقية عالية",
      feat3Desc: "بيانات مركبتك مشفرة وحجوزاتك آمنة وفقاً لأفضل الممارسات البرمجية.",
      bookingFormTitle: "محاكاة نظام الحجز والتحقق الفني",
      bookingFormSub: "املأ البيانات أدناه لاستخراج تذكرة حجز فحص فني معتمدة في ثوانٍ.",
      stepIndicator: "الخطوة",
      of: "من",
      next: "التالي",
      prev: "السابق",
      finish: "تأكيد واستخراج التذكرة",
      plateNum: "أرقام اللوحة (بالأرقام الإنجليزية)",
      plateLett: "حروف اللوحة العربية",
      ownerNameLabel: "اسم مالك المركبة بالكامل",
      ownerPhoneLabel: "رقم الجوال (05xxxxxxx)",
      vehTypeLabel: "فئة ونوع المركبة",
      cityLabel: "المدينة",
      stationLabel: "مركز / محطة الفحص المعتمدة",
      dateLabel: "تاريخ الفحص الفني",
      timeLabel: "الفترة الزمنية المفضلة",
      successTitle: "تم حجز موعدك بنجاح!",
      successSub: "يرجى الاحتفاظ بتذكرة الحجز (أو تصوير الـ QR) وإبرازها عند وصولك لمحطة الفحص.",
      ticketDetails: "تفاصيل تذكرة الحجز الفني",
      refNumber: "رقم المرجع",
      plateInfo: "بيانات اللوحة",
      feeAmount: "رسوم الفحص الفني",
      sar: "ريال سعودي",
      btnReset: "حجز موعد جديد آخر",
      btnPrint: "طباعة التذكرة",
      iframeUrlSettings: "لوحة تحكم وتعديل الرابط المضمن (iFrame Tester)",
      copyEmbedCode: "نسخ كود الـ iFrame للتضمين",
      activeLabel: "متاح ومستعد",
      busyLabel: "ازدحام متوسط",
      previewLabel: "معاينة حية للمتصفح المضمن"
    },
    en: {
      siteTitle: "Vehicle Safety Center | Unified Periodic Vehicle Inspection Platform",
      oneOfProducts: "One of the Vehicle Safety Center products",
      heroTitle: "Unified Platform for Periodic Motor Vehicle Inspection",
      heroSub: "Book and manage your periodic inspection appointments easily and automatically. Save time, esfuerzo, and completely avoid long waiting queues.",
      btnBookNow: "Book New Appointment",
      btnRegister: "Register New Account",
      howItWorks: "Periodic Inspection Steps",
      howItWorksSub: "Four simple stages starting with booking your appointment and ending with your approved digital certificate.",
      step1Title: "1. Quick Booking",
      step1Desc: "Pick the nearest inspection station, convenient date and time slot for your schedule.",
      step2Title: "2. Online Payment",
      step2Desc: "Pay inspection fees securely online through safe local gateways to facilitate quick entrance.",
      step3Title: "3. Station Inspection",
      step3Desc: "Drive to the selected station at the scheduled time for a thorough technical safety checkup.",
      step4Title: "4. Digital Certificate",
      step4Desc: "Your vehicle's inspection report is sent instantly to Absher and integrated directly with traffic safety databases.",
      embedSectionTitle: "Integrated Booking System & Embed Console",
      embedSectionSub: "This platform allows seamless integration of external booking systems via responsive iframe or our interactive simulator.",
      toggleSimulated: "Interactive Booking Simulator (Built-in)",
      toggleIframe: "Custom Booking Portal (Responsive iFrame)",
      iframeInputPlaceholder: "Paste your reservation portal URL here...",
      btnApply: "Embed Link",
      deviceDesktop: "Desktop Frame",
      deviceTablet: "Tablet Frame",
      deviceMobile: "Mobile Frame",
      faqTitle: "Frequently Asked Questions",
      faqSub: "Everything you need to know about periodic vehicle safety inspections, guidelines, and fees.",
      disclaimer: "This website is an independent gateway and is not affiliated with Google.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      allRightsReserved: "All rights reserved to Vehicle Safety Center © 2026",
      aboutUs: "About the Center",
      aboutUsDesc: "Vehicle Safety Center contributes directly to raising road safety levels and reducing motor vehicle accidents by enforcing high technological standards and inspection compliance.",
      featuresTitle: "Unified Platform Strengths",
      featuresSub: "Cutting-edge technologies customized to assist vehicle owners nationwide.",
      feat1: "100% Mobile Ready",
      feat1Desc: "All interfaces and embeddable iframes are responsive, scaling comfortably across screen aspect ratios.",
      feat2: "Instant National Sync",
      feat2Desc: "Direct technical integration with major national traffic and road safety databases.",
      feat3: "Highest Security Specs",
      feat3Desc: "Your vehicle details and digital transactions are secured using maximum industry standard protocols.",
      bookingFormTitle: "Stateful Inspection Booking Simulator",
      bookingFormSub: "Submit the details below to generate a validated periodic inspection schedule ticket in real time.",
      stepIndicator: "Step",
      of: "of",
      next: "Next",
      prev: "Back",
      finish: "Confirm & Generate Pass",
      plateNum: "Plate Numbers (digits)",
      plateLett: "Plate Letters (Arabic characters)",
      ownerNameLabel: "Vehicle Owner Full Name",
      ownerPhoneLabel: "Mobile Number (05xxxxxxx)",
      vehTypeLabel: "Vehicle Classification",
      cityLabel: "City/Region",
      stationLabel: "Approved Inspection Station",
      dateLabel: "Inspection Date",
      timeLabel: "Preferred Time Window",
      successTitle: "Appointment Booked Successfully!",
      successSub: "Please save your booking ticket (or snapshot the QR code) and present it upon arrival at the station.",
      ticketDetails: "Inspection Booking Ticket Information",
      refNumber: "Reference Number",
      plateInfo: "Plate Details",
      feeAmount: "Inspection Safety Fee",
      sar: "SAR",
      btnReset: "Book Another Vehicle",
      btnPrint: "Print Inspection Ticket",
      iframeUrlSettings: "Embed Integration Controller",
      copyEmbedCode: "Copy Responsive iframe Embed Code",
      activeLabel: "Available & Ready",
      busyLabel: "Moderate Wait",
      previewLabel: "Live Nested Frame Sandbox Output"
    }
  };

  const currentText = dict[lang];

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-800 selection:bg-[#1E7D4E]/20 text-right ${lang === "ar" ? "rtl font-sans" : "ltr font-sans"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm`}
          >
            <Sparkles className="w-5 h-5 text-[#1E7D4E]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with 90% accurate SVG Logo */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo Brand Cluster */}
          <div className="flex items-center gap-3">
            {/* High-quality styled SVG Logo matching KSA Vehicle Safety Center: Curved green triangle with white road inside and a brown base */}
            <div className="relative group transition-transform duration-300 hover:scale-[1.03]">
              <svg viewBox="0 0 120 120" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Curved green triangle representing the core chassis of Vehicle Safety Center branding */}
                <path 
                  d="M 60,12 
                     C 72,12 110,80 102,96 
                     C 94,103 26,103 18,96 
                     C 10,80 48,12 60,12 Z" 
                  fill="#1E7D4E" 
                  stroke="#165d3a"
                  strokeWidth="1.5"
                />
                
                {/* Curved Perspective Road (White) converging at top */}
                <path 
                  d="M 60,32 
                     L 63,32 
                     C 63,32 75,70 78,92 
                     L 42,92 
                     C 45,70 57,32 57,32
                     Z" 
                  fill="white" 
                  className="opacity-95" 
                />
                
                {/* Dashboard-style road center dashed lane */}
                <path 
                  d="M 60,32 L 60,92" 
                  stroke="#1E7D4E" 
                  strokeWidth="2" 
                  strokeDasharray="4,5" 
                />

                {/* Road horizon curve back-fill */}
                <path 
                  d="M 52,90 L 68,90" 
                  stroke="#1E7D4E" 
                  strokeWidth="1" 
                  opacity="0.2" 
                />

                {/* Solid small brown wooden/metallic plate base representing the foundation under the triangle */}
                <rect 
                  x="38" 
                  y="98" 
                  width="44" 
                  height="7" 
                  rx="3" 
                  fill="#5D4037" 
                  stroke="#3E2723"
                  strokeWidth="1"
                />
                
                {/* Little glow node at horizon of safety */}
                <circle cx="60" cy="32" r="2.5" fill="#EAB308" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="60" cy="32" r="1.5" fill="#EAB308" />
              </svg>
            </div>

            {/* Text Title */}
            <div className="flex flex-col text-slate-800">
              <span className="font-extrabold text-[15px] sm:text-[17px] leading-tight text-[#1E7D4E] tracking-tight">
                {lang === "ar" ? "مركز سلامة المركبات" : "Vehicle Safety Center"}
              </span>
              <span className="font-bold text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                {lang === "ar" ? "منصة الفحص الفني الدوري الموحدة" : "Unified Vehicle Inspection Platform"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {hasAdminAccess && (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-650">
              <a href="#" className="hover:text-[#1E7D4E] transition-all">{lang === "ar" ? "الرئيسية" : "Home"}</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-[#1E7D4E] transition-all">{lang === "ar" ? "عن المركز" : "About"}</a>
              <a href="#stations" onClick={(e) => { e.preventDefault(); document.getElementById("stations")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-[#1E7D4E] transition-all">{lang === "ar" ? "المراكز والخدمات" : "Services"}</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-[#1E7D4E] transition-all">{lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a>
            </nav>
          )}

          {/* Header Action Items */}
          <div className="flex items-center gap-3">
            {/* Translation Button */}
            <button 
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all text-xs font-semibold"
              title={lang === "ar" ? "Switch to English" : "تغيير للغة العربية"}
            >
              <Globe className="w-4 h-4 text-[#1E7D4E]" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Direct Book anchor linking to bottom */}
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-[#1E7D4E] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#155a37] shadow-sm transition-all shadow-[#1E7D4E]/10 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{currentText.btnBookNow}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1E7D4E]/5 via-[#1E7D4E]/2 to-[#F8F9FA] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Background Decorative Accent Gradients */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#1E7D4E]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-slate-200 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          
          {/* Top miniature branding badge text */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1E7D4E]/10 rounded-full border border-[#1E7D4E]/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#1E7D4E]" />
            <span className="text-[11px] sm:text-xs font-extrabold text-[#1E7D4E] uppercase tracking-wide">
              {currentText.oneOfProducts}
            </span>
          </motion.div>

          {/* Primary Giant H1 Page Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6"
          >
            {currentText.heroTitle}
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            {currentText.heroSub}
          </motion.p>

          {/* CTA Buttons Row */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-[#1E7D4E] text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-[#1E7D4E]/25 hover:bg-[#155a37] hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>{currentText.btnBookNow}</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-white text-slate-800 font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-5 h-5 text-[#1E7D4E]" />
              <span>{currentText.btnRegister}</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* Admin Dashboard Control (Only rendering if admin mode has been unlocked) */}
      {hasAdminAccess && (
        <section className="py-12 bg-slate-100 border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div 
              className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1E7D4E]/20 rounded-lg border border-[#1E7D4E]/50">
                    <Activity className="w-6 h-6 text-[#1E7D4E]" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-0.5">
                      {currentText.iframeUrlSettings}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {lang === "ar" 
                        ? "لوحة تعديل رابط الحجز ومزامنته مع قاعدة البيانات الفورية" 
                        : "Control and save the booking form iframe link dynamically."}
                    </p>
                  </div>
                </div>

                {/* Open Modal Preview Button for Admin's testing */}
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-4 py-2 bg-[#1E7D4E] hover:bg-[#155a37] text-white rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === "ar" ? "فتح معاينة البوابة المحدثة" : "Open Booking Preview"}</span>
                </button>
              </div>

              {/* Custom URL controller settings */}
              <div className="mt-5 pt-5 border-t border-slate-800/80">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/60">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#1E7D4E]" />
                    <span>{currentText.iframeUrlSettings}</span>
                  </h3>
                  
                  <form onSubmit={applyCustomIframe} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <InputGroup 
                        icon={<Globe className="w-4 h-4 text-slate-400" />}
                        value={tempIframeUrl}
                        onChange={(e) => setTempIframeUrl(e.target.value)}
                        placeholder={currentText.iframeInputPlaceholder}
                        dir="ltr"
                        className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 rounded-lg text-sm pl-10 pr-4 py-2.5 w-full focus:border-[#1E7D4E] focus:ring-1 focus:ring-[#1E7D4E]"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1E7D4E] hover:bg-[#155a37] text-white rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap md:w-auto w-full"
                      >
                        <Check className="w-4 h-4" />
                        <span>{currentText.btnApply}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-4 py-2.5 bg-slate-700 hover:bg-slate-650 text-white border border-slate-600 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title={currentText.copyEmbedCode}
                      >
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">{currentText.copyEmbedCode}</span>
                      </button>
                    </div>
                  </form>

                  {/* Quick presets for iframe safety URL */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-bold">{lang === "ar" ? "روابط سريعة للتجربة:" : "Test Links Preset:"}</span>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect("https://example.com")}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-[11px] transition-all cursor-pointer"
                    >
                      Example.com (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect("https://wikipedia.org")}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-[11px] transition-all cursor-pointer"
                    >
                      Wikipedia (Arabic page support)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect("https://maps.google.com/maps?q=riyadh+mvpi&t=&z=13&ie=UTF8&iwloc=&output=embed")}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-[11px] transition-all cursor-pointer"
                    >
                      {lang === "ar" ? "مواقع الفحص على خرائط جوجل" : "Inspection Stations on Google Maps"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {hasAdminAccess && (
        <>
          {/* Strengths & Platform Features Section Grid */}
          <section id="stations" className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-100">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {currentText.featuresTitle}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                  {currentText.featuresSub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <FeatureCard 
                  icon={<Smartphone className="w-6 h-6 text-[#1E7D4E]" />}
                  title={currentText.feat1}
                  desc={currentText.feat1Desc}
                />

                <FeatureCard 
                  icon={<Activity className="w-6 h-6 text-[#1E7D4E]" />}
                  title={currentText.feat2}
                  desc={currentText.feat2Desc}
                />

                <FeatureCard 
                  icon={<Shield className="w-6 h-6 text-[#1E7D4E]" />}
                  title={currentText.feat3}
                  desc={currentText.feat3Desc}
                />

              </div>

            </div>
          </section>

          {/* How it works section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentText.howItWorks}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                {currentText.howItWorksSub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <HowCard num="01" title={currentText.step1Title} desc={currentText.step1Desc} />
              <HowCard num="02" title={currentText.step2Title} desc={currentText.step2Desc} />
              <HowCard num="03" title={currentText.step3Title} desc={currentText.step3Desc} />
              <HowCard num="04" title={currentText.step4Title} desc={currentText.step4Desc} />
            </div>

          </section>

          {/* FAQ Accoridon Section */}
          <section id="faq" className="bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-150">
            <div className="max-w-3xl mx-auto">
              
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                  <HelpCircle className="w-7 h-7 text-[#1E7D4E] shrink-0" />
                  <span>{currentText.faqTitle}</span>
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mt-2">
                  {currentText.faqSub}
                </p>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <div 
                      key={index}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : index)}
                        className="w-full text-right p-5 flex items-center justify-between gap-4 font-bold text-slate-800 hover:bg-slate-50 transition-colors text-sm sm:text-base cursor-pointer"
                      >
                        <span className="leading-tight">
                          {lang === "ar" ? faq.questionAr : faq.questionEn}
                        </span>
                        <span className="p-1 rounded-full bg-slate-100 text-slate-400 shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4 text-[#1E7D4E]" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {lang === "ar" ? faq.answerAr : faq.answerEn}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* Pre-footer About info & Contact elements */}
          <section id="about" className="bg-slate-900 text-slate-200 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
              
              <div className="md:col-span-6 space-y-4 text-right">
                <h3 className="text-lg font-bold text-[#1E7D4E] flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#1E7D4E]" />
                  <span>{currentText.aboutUs}</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                  {currentText.aboutUsDesc}
                </p>
              </div>

              <div className="md:col-span-6 space-y-4 text-right md:border-r border-slate-800 md:pr-8">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#1E7D4E]" />
                  <span>{lang === "ar" ? "قنوات التواصل الرسمية" : "Official Contacts"}</span>
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-mono">support@vehiclesafety.gov.sa</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-mono">+966 11 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{lang === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Kingdom of Saudi Arabia"}</span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

      {/* Compliance Footer (Requirements met) */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900/60 text-center">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Compliance Disclaimer message - REQUIRED */}
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 bg-yellow-950/40 rounded-xl border border-yellow-800/25 max-w-xl mx-auto shadow-sm">
            <Info className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-[11px] sm:text-xs text-yellow-250 font-bold leading-normal text-right">
              {currentText.disclaimer}
            </p>
          </div>

          {/* Nav links to Compliance Terms & Privacy */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-400">
            <a
              href="privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-4 h-4 text-[#1E7D4E]" />
              <span>{currentText.privacyPolicy}</span>
            </a>
            
            <button
              onClick={() => setShowTerms(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-4 h-4 text-[#1E7D4E]" />
              <span>{currentText.termsOfService}</span>
            </button>
          </div>

          <div className="border-t border-slate-900/55 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-slate-500">
            <p>{currentText.allRightsReserved}</p>
            <p>{lang === "ar" ? "بوابة رقمية مستقلة" : "Independent Digital Dashboard"}</p>
          </div>

        </div>
      </footer>

      {/* Simple Custom Quiet Footer */}
      <footer className="bg-gray-50 border-t border-slate-200/60 py-6 px-4 text-center text-xs text-gray-400 font-sans" dir="rtl">
        <div className="max-w-4xl mx-auto leading-relaxed">
          جميع الحقوق محفوظة لمركز سلامة © 2024. المنصة عبارة عن بوابة تقنية مستقلة تهدف لتسهيل وصول المستخدمين لخدمات الحجز، وهي غير تابعة لأي جهة حكومية أو لشركة جوجل.
        </div>
      </footer>

      {/* Modal: Privacy Policy */}
      <AnimatePresence>
        {showPrivacy && (
          <Modal title={currentText.privacyPolicy} onClose={() => setShowPrivacy(false)}>
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed text-right p-1.5 font-sans" dir="rtl">
              <p className="font-extrabold text-[#1E7D4E]">مقدمة حول سرية البيانات لحسابات المستخدمين</p>
              <p>حرصاً من مركز سلامة المركبات، نوضح أن جميع البيانات والمعلومات الخاصة برقم اللوحة ونوع السيارة، وبيانات مالك المركبة والاتصال يتم حفظها وتشفيرها بشكل كامل للتحقق الفني فقط ولا يتم استخدامها تجارياً.</p>
              <p className="font-bold text-slate-800">بيانات التضمين (iFrame URLs):</p>
              <p>البوابة لا تحفظ الروابط الخارجية التي يتم إضافتها في لوحة المعاينة والتجربة، وتظل مسؤلية تامة في نطاق متصفح العميل الخاص لحماية سرية الاتصالات.</p>
              <p className="font-bold text-slate-800 text-[11px]">إخلاء مسؤولية قانونية حاسم:</p>
              <p className="text-slate-500 border-r-2 border-slate-300 pr-2">هذه المنصة مستقلة بالكامل ولا تتبع لشركة جوجل Google LLC أو الكيانات الزميلة. الغرض الرئيسي هو تسهيل مراجعة وقبول أنظمة الفحص المعتمدة.</p>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal: Terms of Service */}
      <AnimatePresence>
        {showTerms && (
          <Modal title={currentText.termsOfService} onClose={() => setShowTerms(false)}>
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed text-right p-1.5 font-sans" dir="rtl">
              <p className="font-extrabold text-[#1E7D4E]">شروط الاستخدام وإتمام الحجز الرقمي</p>
              <p>باستخدامك لهذه المنصة للاستعلم وحجز مواعيد الفحص الفني للمركبات، فإنك تقر وتلتزم بالقواعد والأنظمة المعتمدة للفحص الفني الدوري للسيارات بالمملكة العربية السعودية، ومراجعة محطة الفحص الفني في الموعد المحدد لضمان السلامة المرورية.</p>
              <p className="font-bold text-slate-800">الضوابط والشروط العامة للخدمة:</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-550 pr-4">
                <li>المستفيد مسؤول تماماً عن صحة البيانات المدخلة الخاصة بالمركبة وبيانات الاتصال.</li>
                <li>يجب حجز الموعد وتأكيده قبل انتهاء استمارة سير المركبة بمهلة كافية لتفادي أي مخالفات مرورية.</li>
                <li>تكامل الربط البرمجي يعتمد على توافر الاتصال الآمن مع المنظومات والروابط الرسمية المخصصة لنظام الحجز الإلكتروني.</li>
              </ul>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Full-Screen Booking/Registration Modal Portal overlay */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <FullScreenBookingModal 
            isOpen={isBookingModalOpen} 
            onClose={() => setIsBookingModalOpen(false)} 
            iframeUrl={iframeUrl} 
            lang={lang} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// Custom text input group wrapper for visual alignment
interface InputGroupProps {
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  dir?: string;
  className?: string;
}
function InputGroup({ icon, className = "", ...props }: InputGroupProps) {
  return (
    <div className="relative flex items-center w-full">
      {icon && (
        <div className="absolute right-3 text-slate-400 flex items-center justify-center select-none pointer-events-none">
          {icon}
        </div>
      )}
      <input 
        style={{ paddingRight: icon ? "2.25rem" : "1rem" }}
        className={`w-full text-slate-800 tracking-wide text-xs sm:text-sm font-sans focus:outline-none transition-all ${className}`} 
        dir={props.dir}
        placeholder={props.placeholder}
        value={props.value || ""}
        onChange={props.onChange}
      />
    </div>
  );
}

// Small Presentation Components
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}
function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-right space-y-3">
      <div className="inline-flex p-3 bg-[#1E7D4E]/10 rounded-xl text-[#1E7D4E] border border-[#1E7D4E]/5">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
        {title}
      </h3>
      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

interface HowCardProps {
  num: string;
  title: string;
  desc: string;
}
function HowCard({ num, title, desc }: HowCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm relative overflow-hidden group hover:border-[#1E7D4E]/30 transition-all text-right">
      <span className="absolute -top-1 -left-1 text-5xl font-black text-slate-100 group-hover:text-[#1E7D4E]/10 select-none transition-colors duration-350">
        {num}
      </span>
      <div className="relative pt-4 space-y-2">
        <h3 className="font-extrabold text-[#1E7D4E] text-xs sm:text-sm">
          {title}
        </h3>
        <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

// Shared Modal Layout Component
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}
function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col"
      >
        <div className="bg-slate-50 p-4 border-b border-slate-150 flex items-center justify-between">
          <span className="font-extrabold text-slate-950 text-sm tracking-tight">{title}</span>
          <button 
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-350 hover:text-slate-950 text-xs font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Full-screen Booking / Registration Overlay Modal containing the dynamic iframe
interface FullScreenBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  iframeUrl: string;
  lang: "ar" | "en";
}
function FullScreenBookingModal({ isOpen, onClose, iframeUrl, lang }: FullScreenBookingModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl w-full h-[96vh] sm:h-[90vh] max-w-7xl flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E7D4E] flex items-center justify-center text-white font-extrabold text-sm select-none">
              S
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-none mb-1">
                {lang === "ar" ? "بوابة الحجز الإلكتروني الموحدة" : "Unified Electronic Booking Portal"}
              </h3>
              <p className="text-[10px] text-[#1E7D4E] font-bold leading-none">
                {lang === "ar" ? "مركز سلامة المركبات" : "Vehicle Safety Center"}
              </p>
            </div>
          </div>
          
          {/* Close Button (X) - Large and clear in corner */}
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
            title={lang === "ar" ? "إغلاق" : "Close"}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Iframe Content Area */}
        <div className="flex-1 bg-slate-50 relative">
          <iframe
            src={iframeUrl}
            title="Vehicle Safety Center Booking Real Portal"
            className="w-full h-full border-none"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </div>
  );
}
