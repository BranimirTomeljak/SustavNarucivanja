import { Component, OnDestroy , OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IRegisterData } from 'src/app/interfaces/register-data';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy, OnInit {
  private readonly subscription = new Subscription();

  constructor(private readonly authService: AuthService) {}

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatedPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    doctor: new FormControl('',[Validators.required])
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

    const regData: IRegisterData = {
      email: this.form.get('email')?.value as string,
      name: this.form.get('name')?.value as string,
    };

    const registerSubscription = this.authService.register(regData).subscribe();
    this.subscription.add(registerSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  myControl = new FormControl("");

  // TO DO
  // napuniti options imenima doktora iz baze
  options: string[] = [
    'Dr. One',
    'Dr. Two',
    'Dr. Three',
    'Dr. Four',
    'Franjo Tudman',
    'Isus Krsit',
    'Dr. Ante Pavlović',
    'Siniša Vuco',
    'Dr. Who',
    'Dr. Doctor'
  ];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
