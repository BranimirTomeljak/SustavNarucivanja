import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ISingleTeam } from 'src/app/interfaces/single-team';
import { ITeamCreateData } from 'src/app/interfaces/team-create-data';
import { IDoctorRule } from 'src/app/interfaces/doctor-rule-data';
import { ITeamData } from 'src/app/interfaces/team-data';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  constructor(private http: HttpClient) {}

  public getAllDoctors(): Observable<Array<any>> {
    return this.http.get<Array<any>>('/api/doctor/all');
  }

  public getDoctorById(id: number) {
    return this.http.get(`/api/doctor/${id}`);
  }

  public getAllNurses(): Observable<Array<any>> {
    return this.http.get<Array<any>>('/api/nurse/all');
  }

  public getNurseById(id: number) {
    return this.http.get(`/api/nurse/${id}`);
  }

  public getNurseTeam() {
    return this.http.get('/api/user/nurse/teamId');
  }

  public createTeam(data: ITeamCreateData) {
    return this.http.post('/api/team/create', data);
  }

  public getTeamById(id: number): Observable<ISingleTeam> {
    return this.http.get<ISingleTeam>(`/api/team/${id}`);
  }

  public getAllTeams(): Observable<Array<ISingleTeam>> {
    return this.http.get<Array<ISingleTeam>>('/api/team/all');
  }

  public deleteTeam(id: number) {
    return this.http.delete(`/api/team/delete/${id}`);
  }

  public editTeam(id: number, data: ITeamCreateData) {
    return this.http.post(`/api/team/edit/${id}`, data);
  }

  public setDoctorRule(data : IDoctorRule) {
    return this.http.post('/api/doctor/set_rule', data);
  }


  public getDoctorRule(id : number): Observable<any> {
    return this.http.get<any>(`/api/doctor/get_rule/${id}`);
  }

}
