import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public user$ = this.authService.user$;

  constructor(private readonly authService: AuthService) {}

  public onClick() {
    this.authService.getPatientDoctorId().subscribe();
  }

  public test() {
    this.authService.getPatientNurseId().subscribe();
    this.authService.getPatientNFailedAppointments().subscribe();
  }
}
