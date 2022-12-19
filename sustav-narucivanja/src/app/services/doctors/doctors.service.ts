import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  constructor(private http: HttpClient) {}

  public getAllDoctors() {
    return this.http.get('/api/register/doctors');
  }

  public getAllNurses() {
    return this.http.get('/api/register/nurses');
  }
}
