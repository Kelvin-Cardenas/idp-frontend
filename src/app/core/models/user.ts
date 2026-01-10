export interface User {
  id?: number;

  eventName: string;
  eventDate: string;        // LocalDate → string (ISO)
  eventLocation: string;
  eventCost: number;

  // Participante
  fullName: string;
  documentNumber: string;
  phone: string;
  email: string;

  // Iglesia
  memberRole: string;
  churchCampus: string;

  // Inscripción
  registrationCode: string;
  notes?: string;

  // Pago
  paymentStatus: string;
}
