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
  public user$ = this._user$
    .asObservable()
    .pipe(tap((user) => (this.id = user?.id)));
  public id?: number;

  constructor(private http: HttpClient) {}

  public getUser() {
    return this.http.get<IUser>('/api/user').pipe(
      tap((resp) => {
        this._user$.next(resp);
      })
    );
  }

  public getPatientDoctorId(): Observable<any> {
    return this.http
      .get('/api/user/doctor')
      .pipe(tap((resp) => console.log(resp)));
  }

  public login(data: ILoginData) {
    return this.http.post<IUser>('/api/login', data).pipe(
      tap((resp) => {
        this._user$.next(resp);
      })
    );
  }

  public register(data: IRegisterData) {
    return this.http.post<IUser>('/api/register', data).pipe(
      tap((resp) => {
        this._user$.next(resp);
      })
    );
  }

  public createDoctor(data: IDoctorNurseData) {
    return this.http.post<IUser>('/api/register/doctor', data);
  }

  public createNurse(data: IDoctorNurseData) {
    return this.http.post<IUser>('/api/register/nurse', data);
  }

  public logout() {
    return this.http.get('/api/logout').pipe(
      tap(() => {
        this._user$.next(null);
      })
    );
  }
}
