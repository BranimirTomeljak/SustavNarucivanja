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
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    if (JSON.parse(localStorage.getItem('user') || '{}').type === 'admin') {
      this.links = [
        { title: 'Naslovna', path: '/' },
        { title: 'Admin', path: '/admin' },
        { title: 'Profil', path: '/profile' },
      ];
    } else {
      this.links = [
        { title: 'Naslovna', path: '/' },
        { title: 'Kalendar', path: '/patient' },
        { title: 'Profil', path: '/profile' },
      ];
    }
  }

  public links: Array<{ title: string; path: string }> = [];

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
