import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  filter,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ITeamCreateData } from 'src/app/interfaces/team-create-data';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
})
export class TeamFormComponent implements OnDestroy {
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

  addDoctorId(): void {
    this.doctorIds.push(new FormControl(null, [Validators.required]));
  }

  addNurseId(): void {
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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
