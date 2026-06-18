export interface Station {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  status: "active" | "busy" | "maintenance";
  addressAr: string;
  addressEn: string;
  workingHours: string;
}

export interface Appointment {
  id: string;
  plateNumber: string;
  plateLettersAr: string;
  plateLettersEn: string;
  vehicleType: string;
  ownerName: string;
  ownerPhone: string;
  stationId: string;
  date: string;
  timeSlot: string;
  createdAt: string;
  qrCodeValue: string;
  referenceNumber: string;
}

export interface FAQItem {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}
