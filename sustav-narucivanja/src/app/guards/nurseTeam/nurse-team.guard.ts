import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { map, Observable, switchMap, tap } from 'rxjs';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Injectable({
  providedIn: 'root',
})
export class NurseTeamGuard implements CanActivate {
  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly doctorsService: DoctorsService
  ) {}

  public canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let user: IUser | null = null;
    return this.authService.user$.pipe(
      tap((resp) => (user = resp)),
      switchMap(() => this.doctorsService.getNurseTeam()),
      map((resp) => {
        console.log(resp);
        if (user?.type === 'nurse' && !resp) {
          return true;
        }

        return this.router.createUrlTree(['/', 'nurse']);
      })
    );
  }
}
