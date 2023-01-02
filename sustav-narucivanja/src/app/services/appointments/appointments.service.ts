import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { IObservable } from 'mobx';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { IAppointmentData } from 'src/app/interfaces/appointment-data';
import { IRegisterData } from 'src/app/interfaces/register-data';
import { IUser } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  id = localStorage.getItem("id");

  constructor(private http: HttpClient) {}
  
  public getAllApointments(): Observable<Array<any>> {
    return this.http.get<Array<any>>('/api/appointment?role=patient&id=1001');
  }

  public addAppointment(data : IAppointmentData) {
    return this.http.post('/api/appointment/add', data);
  }

  /*
  public addRangeAppointment(data : IRangeData) {
    return this.http.post('/api/appointment/add_range', data);
  }
  */


// TO DO bot ce ih jos....



}
