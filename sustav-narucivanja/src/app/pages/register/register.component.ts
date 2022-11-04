import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatedPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
  });

  public onFormSubmit(): void {
    const data = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      repeatedPassword: this.form.get('repeatedPassword')?.value,
      name: this.form.get('name')?.value,
      surname: this.form.get('surname')?.value,
      sex: this.form.get('sex')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
    };

    console.log(data);
  }
}
