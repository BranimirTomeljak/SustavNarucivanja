import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  constructor(private http: HttpClient) {}

  public getAllDoctors() {
    return this.http.get('/api/doctor/all');
  }

  public getAllNurses() {
    return this.http.get('/api/register/nurses');
  }
}
