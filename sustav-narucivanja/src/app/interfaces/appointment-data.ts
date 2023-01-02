export interface IAppointmentData {
    patientId: number;
    doctorid: number;
    nurseid: number;
    time: string;
    duration: object;
    created_on: Date;
    pending_accept: boolean;
    type: string;
    patient_came: boolean;
  }
  