import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DoctorGuard implements CanActivate {
  constructor(
    private router: Router,
    private readonly authService: AuthService
  ) {}

  public canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user$.pipe(
      map((user) => {
        if (user?.type === 'doctor') {
          return true;
        }

        return this.router.createUrlTree(['/', 'login']);
      })
    );
  }
}
