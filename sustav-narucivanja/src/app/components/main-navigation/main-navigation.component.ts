import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    if (this.user.type === 'admin') {
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
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
