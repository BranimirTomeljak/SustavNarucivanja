export interface IAppointmentData {
    id?: number | string; // string jer me jebe kalendar, za potrebe prikaza ne treba
    patientid?: number;
    doctorid?: number;
    nurseid?: number;
    time: Date;
    duration: any; // jer dohvacam object a vracam string
    created_on: Date;
    pending_accept: boolean;
    type: string | null;
    patient_came: boolean;
  }
  