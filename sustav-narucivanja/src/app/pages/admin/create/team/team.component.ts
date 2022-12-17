import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Subscription, Observable } from 'rxjs';
import { ITeamData } from 'src/app/interfaces/team-data';
import { AuthService } from 'src/app/services/auth.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnDestroy, OnInit{
  private readonly subscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  public form: FormGroup = new FormGroup({
    doctor: new FormControl('', [Validators.required]),
    tech: new FormControl('', [Validators.required]),
  });

  public onFormSubmit(): void {
    if (this.form.invalid) {
      this.snackBar.open('Unesite sve potrebne podatke', 'Zatvori', {
        duration: 2000,
      });
      return;
    }

    const data: ITeamData = {
      doctorId: 1,
      nurseId: 1
    };

    console.log(data);

    // TODO kad cemo imat api za timove
    /*
    const createTeamSubscription = this.authService
      .register(data)
      .pipe(
        catchError(() => {
          this.snackBar.open('Unesite sve potrbene podatke', 'Zatvori', {
            duration: 2000,
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.router.navigate(['/admin']);
      });
    this.subscription.add(createTeamSubscription);
    */
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  myControl = new FormControl('');


  // TODO napuniti polja pravim doktorima/tehnicarima
  // dohvatit (id) ime + prezime => tkda biramo imena, a vracamo id

  doctors : string[] = [
    'Dr. One',
    'Dr. Two',
    'Dr. Three',
    'Dr. Four',
    'Dr. Five', 
    'Dr. Six'
  ]

  techs : string[] = [
    'Tech One',
    'Tech Two',
    'Tech Three',
    'Tech Four',
    'Tech Five',
    'Tech Six'
  ]

  techOptions!: Observable<string[]>;
  doctorOptions!: Observable<string[]>;
  
 

  ngOnInit() {
    this.techOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTechs(value || ''))
    );

    this.doctorOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterDoctors(value || ''))
    );

  }

  private _filterTechs(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.techs.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterDoctors(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.doctors.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

}
