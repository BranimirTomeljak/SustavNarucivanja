import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent {
  public links = [
    { title: 'Naslovna', path: '/' },
    { title: 'Prijava', path: '/login' },
    { title: 'Registracija', path: '/register' },
    { title: 'Admin', path: '/admin' },
  ];
}
