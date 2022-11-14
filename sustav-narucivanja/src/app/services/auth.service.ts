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

  public login(data: ILoginData) {
    return this.http.post('http://localhost:3000/login', data);
  }

  public register(data: IRegisterData) {
    return this.http.post('http://localhost:3000/register', data);
  }

  public getAppointment(data: { id: string; role: string }) {
    return this.http.get(
      `http://localhost:3000/appointment?role=${data.role}&id=${data.id}`
    );
  }
}
