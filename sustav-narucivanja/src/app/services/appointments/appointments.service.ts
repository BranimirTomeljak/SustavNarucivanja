import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { IObservable } from 'mobx';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { IAppointmentData } from 'src/app/interfaces/appointment-data';
import { IRangeData } from 'src/app/interfaces/range-data';
import { IRegisterData } from 'src/app/interfaces/register-data';
import { IUser } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  id = localStorage.getItem("id");

  constructor(private http: HttpClient) {}
  
  
  public getAllApointments(role: string, id: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`/api/appointment?role=${role}&id=${id}`);
  }
  
  /*
  public getAllApointments(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`/api/appointment?role=patient&id=1001`);
  }
  */

  public getAllDoctorApointments(): Observable<Array<any>> {
    return this.http.get<Array<any>>('/api/appointment?role=doctor&id=10');
  }

  public addAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/add', data);
  }

  public addRangeAppointment(data : IRangeData) {
    return this.http.post('/api/appointment/add_range', data);
  }
  
  public reserveAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/reserve?type=pregled&patientid=1001&doctorid=10', data);
  }

  public cancelAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/cancel', data);
  }

  public changeAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/change', data);
  }

  public acceptChangeAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/accept_change', data);
  }

  public rejectChangeAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/reject_change', data);
  }

  public recordAttendance(data : IAppointmentData) {
    return this.http.post('/api/appointment/record_attendance', data);
  }

  public deleteAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/delete', data);
  }

}
