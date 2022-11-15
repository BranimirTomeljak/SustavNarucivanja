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
  private readonly _user$ = new BehaviorSubject<IUser | null>(null);
  public user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  public login(data: ILoginData) {
    return this.http.post('/api/login', data);
  }

  public register(data: IRegisterData) {
    return this.http.post('/api/register', data);
  }
}
