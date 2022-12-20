import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ITeamCreateData } from 'src/app/interfaces/team-create-data';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  constructor(private http: HttpClient) {}

  public getAllDoctors() {
    return this.http.get('/api/doctor/all');
  }

  public getDoctorById(id: number) {
    return this.http.get(`/api/doctor/${id}`);
  }

  public getAllNurses() {
    return this.http.get('/api/nurse/all');
  }

  public getNurseById(id: number) {
    return this.http.get(`/api/nurse/${id}`);
  }

  public createTeam(data: ITeamCreateData) {
    return this.http.post('/api/team/create', data);
  }
}
