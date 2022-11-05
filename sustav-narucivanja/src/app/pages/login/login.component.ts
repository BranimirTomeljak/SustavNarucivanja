import { Component,} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  public error?: string;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public onFormSubmit() : void {
    const data = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };

    console.log(data);
  }
}
