import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IDoctorNurseData } from 'src/app/interfaces/doctor_nurse-data';
import { ILoginData } from 'src/app/interfaces/login-data';
import { IRegisterData } from 'src/app/interfaces/register-data';
import { IUser } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user$ = new BehaviorSubject<IUser | null>(null);
  public user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  public getUser() {
    return this.http.get('/api/user').pipe(
      tap((resp) => {
        console.log(resp);
        this._user$.next(resp);
      })
    );
  }

  public login(data: ILoginData) {
    return this.http.post('/api/login', data).pipe(
      tap((resp) => {
        console.log(resp);
        localStorage.setItem('user', JSON.stringify(resp));
        this._user$.next(resp);
      })
    );
  }

  public register(data: IRegisterData) {
    return this.http.post('/api/register', data).pipe(
      tap((resp) => {
        console.log(resp);
        localStorage.setItem('user', JSON.stringify(resp));
        this._user$.next(resp);
      })
    );
  }

  public createDoctor(data: IDoctorNurseData) {
    return this.http.post('/api/register/doctor', data).pipe(
      tap((resp) => {
        localStorage.setItem('user', JSON.stringify(resp));
        this._user$.next(resp);
      })
    );
  }

  public createNurse(data: IDoctorNurseData) {
    return this.http.post('/api/register/nurse', data).pipe(
      tap((resp) => {
        localStorage.setItem('user', JSON.stringify(resp));
        this._user$.next(resp);
      })
    );
  }

  public logout() {
    return this.http.get('/api/logout').pipe(
      tap(() => {
        localStorage.removeItem('user');
        this._user$.next(null);
      })
    );
  }
}
