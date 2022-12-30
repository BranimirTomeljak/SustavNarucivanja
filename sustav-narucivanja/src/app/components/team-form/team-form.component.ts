import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription, switchMap } from 'rxjs';
import { ISingleTeam } from 'src/app/interfaces/single-team';
import { ITeamCreateData } from 'src/app/interfaces/team-create-data';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
})
export class TeamFormComponent implements OnDestroy, OnChanges {
  @Input() public editMode: boolean = false;
  @Input() public teamId?: number;
  @Input() public data?: ISingleTeam;

  private readonly subscription = new Subscription();
  private readonly trigger$ = new BehaviorSubject<any>(null);
  public doctors$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.doctorsService.getAllDoctors().pipe(
        switchMap((result) => {
          let doctors: Array<any> = [];
          result.forEach((doctor: any) => {
            if (!doctor.teamid) {
              doctors.push(doctor);
            }
          });
          return of(doctors);
        })
      );
    })
  );
  public nurses$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.doctorsService.getAllNurses().pipe(
        switchMap((result) => {
          let nurses: Array<any> = [];
          result.forEach((doctor: any) => {
            if (!doctor.teamid) {
              nurses.push(doctor);
            }
          });
          return of(nurses);
        })
      );
    })
  );

  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly router: Router
  ) {
    this.trigger$.next(null);
  }

  public ngOnChanges(): void {
    this.setFormValues();
  }

  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    doctorIds: new FormArray([]),
    nurseIds: new FormArray([]),
  });

  get doctorIds(): FormArray {
    return this.form.get('doctorIds') as FormArray;
  }

  get nurseIds(): FormArray {
    return this.form.get('nurseIds') as FormArray;
  }

  private setFormValues(): void {
    if (this.data) {
      console.log('data', this.data);
      this.form.get('name')?.setValue(this.data.name);
      this.data.doctors.forEach((doctor) => {
        this.doctorIds.push(new FormControl(doctor.id, [Validators.required]));
      });
      this.data.nurses.forEach((nurse) => {
        this.nurseIds.push(new FormControl(nurse.id, [Validators.required]));
      });
    }
  }

  public addDoctorId(): void {
    this.doctorIds.push(new FormControl(null, [Validators.required]));
  }

  public addNurseId(): void {
    this.nurseIds.push(new FormControl(null, [Validators.required]));
  }

  public onSubmit(): void {
    const data: ITeamCreateData = {
      name: this.form.get('name')?.value as string,
      doctorIds: this.form.get('doctorIds')?.value as Array<number>,
      nurseIds: this.form.get('nurseIds')?.value as Array<number>,
    };

    const teamSubscription = this.doctorsService.createTeam(data).subscribe();
    this.subscription.add(teamSubscription);
    this.router.navigate(['/admin']);
  }

  public test(): void {
    console.log(this.data);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
