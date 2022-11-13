import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ILoginData } from 'src/app/interfaces/login-data';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  private subscription = new Subscription();
  hide = true;
  public error?: string;

  constructor(private readonly authService: AuthService) {}

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public onFormSubmit(): void {
    const data: ILoginData = {
      email: this.form.get('email')?.value as string,
      password: this.form.get('password')?.value as string,
    };

    console.log(data);

    const loginSubscription = this.authService.login(data).subscribe();

    this.subscription.add(loginSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
