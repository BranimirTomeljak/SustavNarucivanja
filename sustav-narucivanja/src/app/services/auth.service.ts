import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ILoginData } from '../interfaces/login-data';
import { IRegisterData } from '../interfaces/register-data';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = '';
  private readonly _user$ = new BehaviorSubject<IUser | null>(null);
  public user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  public login(data: ILoginData): Observable<IUser | null> {
    return this.http
      .post<IUser>(this.URL, data)
      .pipe(tap((resp) => this._user$.next(resp)));
  }

  public register(data: IRegisterData): Observable<IUser | null> {
    return this.http
      .post<IUser>(this.URL, data)
      .pipe(tap((resp) => this._user$.next(resp)));
  }
}
