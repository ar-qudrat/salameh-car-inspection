import { Station, FAQItem } from "./types";

export const STATIONS: Station[] = [
  {
    id: "station-riyadh-1",
    nameAr: "محطة الرياض الأولى - طريق خريص",
    nameEn: "Riyadh Station 1 - Khurais Road",
    cityAr: "الرياض",
    cityEn: "Riyadh",
    status: "active",
    addressAr: "مخرج 28، طريق خريص الفرعي، الرياض",
    addressEn: "Exit 28, Khurais Branch Road, Riyadh",
    workingHours: "07:00 AM - 11:00 PM"
  },
  {
    id: "station-riyadh-2",
    nameAr: "محطة الرياض الثانية - طريق ديراب",
    nameEn: "Riyadh Station 2 - Deyrab Road",
    cityAr: "الرياض",
    cityEn: "Riyadh",
    status: "active",
    addressAr: "الشفا، طريق ديراب، الرياض",
    addressEn: "Al Shifa, Deyrab Road, Riyadh",
    workingHours: "07:00 AM - 07:00 PM"
  },
  {
    id: "station-jeddah-1",
    nameAr: "محطة جدة الأولى - طريق عسفان",
    nameEn: "Jeddah Station 1 - Asfan Road",
    cityAr: "جدة",
    cityEn: "Jeddah",
    status: "active",
    addressAr: "حي المروة، طريق عسفان، جدة",
    addressEn: "Al Marwah District, Asfan Road, Jeddah",
    workingHours: "07:00 AM - 11:00 PM"
  },
  {
    id: "station-jeddah-2",
    nameAr: "محطة جدة الثانية - طريق الليث",
    nameEn: "Jeddah Station 2 - Al Lith Road",
    cityAr: "جدة",
    cityEn: "Jeddah",
    status: "busy",
    addressAr: "حي السرورية، طريق مكة الليث، جدة",
    addressEn: "Al Sarooriyah Dist, Makkah Al-Lith Rd, Jeddah",
    workingHours: "07:00 AM - 04:00 PM"
  },
  {
    id: "station-dammam",
    nameAr: "محطة الدمام - طريق أبو حدرية",
    nameEn: "Dammam Station - Abu Hadriyah Road",
    cityAr: "الدمام",
    cityEn: "Dammam",
    status: "active",
    addressAr: "المنطقة الصناعية، طريق أبو حدرية، الدمام",
    addressEn: "Industrial Area, Abu Hadriyah Road, Dammam",
    workingHours: "07:00 AM - 11:00 PM"
  },
  {
    id: "station-makkah",
    nameAr: "محطة مكة المكرمة - الكعكية",
    nameEn: "Makkah Station - Al Kakiah",
    cityAr: "مكة المكرمة",
    cityEn: "Makkah",
    status: "active",
    addressAr: "حي الكعكية، مكة المكرمة",
    addressEn: "Al Kakiah District, Makkah",
    workingHours: "07:00 AM - 09:00 PM"
  },
  {
    id: "station-madinah",
    nameAr: "محطة المدينة المنورة - طريق تبوك",
    nameEn: "Madinah Station - Tabuk Road",
    cityAr: "المدينة المنورة",
    cityEn: "Madinah",
    status: "active",
    addressAr: "حي العاقول، طريق تبوك، المدينة المنورة",
    addressEn: "Al Aqool, Tabuk Road, Madinah",
    workingHours: "07:00 AM - 09:00 PM"
  }
];

export const VEHICLE_TYPES = [
  { id: "private", nameAr: "سيارة خصوصي (صالون/جيب)", nameEn: "Private Car", price: 115 },
  { id: "taxi", nameAr: "سيارة أجرة (تاكسي)", nameEn: "Taxi", price: 115 },
  { id: "light-transport", nameAr: "نقل خاص خفيف", nameEn: "Light Transport", price: 138 },
  { id: "heavy-transport", nameAr: "نقل ثقيل", nameEn: "Heavy Transport", price: 235 },
  { id: "microbus", nameAr: "حافلة صغيرة (ميكروباص)", nameEn: "Microbus", price: 115 },
  { id: "large-bus", nameAr: "حافلة كبيرة", nameEn: "Large Bus", price: 235 },
  { id: "motorcycle", nameAr: "دراجة نارية", nameEn: "Motorcycle", price: 57 }
];

export const FAQS: FAQItem[] = [
  {
    questionAr: "ما هي الأوراق المطلوبة عند التوجه للفحص الفني؟",
    questionEn: "What documents are required for the periodic inspection?",
    answerAr: "يتطلب إحضار رخصة سير المركبة (الاستمارة) الأصلية أو الرقمية عبر أبشر، بالإضافة إلى هوية مالك المركبة أو السائق.",
    answerEn: "You need to bring the original or digital vehicle registration (Istimarh) via Absher, along with the owner's or driver's ID."
  },
  {
    questionAr: "ماذا يحدث في حال عدم اجتياز الفحص في المحاولة الأولى؟",
    questionEn: "What happens if the vehicle fails the inspection on the first attempt?",
    answerAr: "يمنح صاحب المركبة مهلة قدرها 14 يوماً عمل لإصلاح الأعطال وإعادة الفحص برسم مخفض مخصص لإعادة الفحص.",
    answerEn: "The vehicle owner is given 14 working days to repair the faults and re-inspect the vehicle for a discounted re-inspection fee."
  },
  {
    questionAr: "هل يمكنني إلغاء أو تغيير موعد الفحص بعد حجز ؟",
    questionEn: "Can I cancel or change the inspection appointment after booking?",
    answerAr: "نعم، تتيح المنصة إمكانية تعديل الموعد أو إلغائه بالكامل دون أي رسوم إضافية قبل الموعد بـ 4 ساعات على الأقل.",
    answerEn: "Yes, the platform allows you to modify or cancel the appointment entirely without any additional fees, at least 4 hours before the scheduled time."
  },
  {
    questionAr: "ما هي الفترة الزمنية الدورية المطلوبة للفحص الفني للمركبة؟",
    questionEn: "How often is periodic vehicle inspection required?",
    answerAr: "يجب فحص السيارات الخاصة والدرجات النارية سنوياً (كل سنة) بعد مرور 3 سنوات من ترخيصها لأول مرة. بينما مركبات النقل العام والأجرة تفحص سنوياً فور الترخيص.",
    answerEn: "Private passenger cars and motorcycles must be inspected annually (every year) starting 3 years after their first licensing. Public transport and taxis must be inspected annually from the first year."
  },
  {
    questionAr: "كيف يمكنني تفعيل حجز موعد عبر نظام الإرسال الخارجي (iFrame)؟",
    questionEn: "How do I activate appointment booking via an external system (iFrame)?",
    answerAr: "توفر المنصة قسماً متكاملاً ومتحكماً بالكامل لعرض روابط الفحص المخصصة. يمكنك لصق رابط بوابة الحجز الخاصة بجهة الاتصال وتضمينها بشكل فوري.",
    answerEn: "The platform provides an integrated, controllable section to display custom booking links. You can paste your custom booking portal link and embed it instantly."
  }
];

export const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة"];

export const TIME_SLOTS = [
  "07:30 - 08:30",
  "08:30 - 09:30",
  "09:30 - 10:30",
  "10:30 - 11:30",
  "13:30 - 14:30",
  "14:30 - 15:30",
  "15:30 - 16:30",
  "16:30 - 17:30",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00"
];
