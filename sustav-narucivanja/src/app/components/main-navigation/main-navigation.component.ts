import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  public links = [
    { title: 'Naslovna', path: '/' },
    { title: 'Profil', path: '/patient' },
  ];

  public onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
