import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
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
      return this.doctorsService.getAllDoctors();
    })
  );
  public nurses$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.doctorsService.getAllNurses();
    })
  );

  constructor(private readonly doctorsService: DoctorsService) {
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
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
