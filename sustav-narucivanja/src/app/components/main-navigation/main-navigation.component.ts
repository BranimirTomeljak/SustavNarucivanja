import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent implements OnDestroy {
  private readonly subscription = new Subscription();
  public user$ = this.authService.user$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public links = {
    admin: [
      { title: 'Naslovna', path: '/' },
      { title: 'Admin', path: '/admin' },
    ],
    patient: [
      { title: 'Naslovna', path: '/' },
      { title: 'Kalendar', path: '/patient' },
    ],
    doctor: [
      { title: 'Naslovna', path: '/' },
      { title: 'Kalendar', path: '/doctor' },
    ],
    nurse: [
      { title: 'Naslovna', path: '/' },
      { title: 'Kalendar', path: '/nurse' },
    ],
  };

  public onLogoutClick() {
    const logoutSubscription = this.authService
      .logout()
      .subscribe(() => this.router.navigate(['/login']));
    this.subscription.add(logoutSubscription);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
