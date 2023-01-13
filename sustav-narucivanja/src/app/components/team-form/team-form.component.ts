import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
          const doctors: any[] = [];
          result.forEach((doctor: any) => {
            if (!doctor.teamid || this.dataDoctors.includes(doctor.id)) {
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
          result.forEach((nurse: any) => {
            if (!nurse.teamid || this.dataNurses.includes(nurse.id)) {
              nurses.push(nurse);
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
    this.form = this.formInit();
    this.trigger$.next(null);
  }

  private formInit(): FormGroup {
    let form = new FormGroup({
      name: new FormControl(this.data?.name, [Validators.required]),
      doctorId: new FormControl(this.data?.doctors[0].id, [
        Validators.required,
      ]),
      nurseId: new FormControl(this.data?.nurses[0].id, [Validators.required]),
    });

    return form;
  }

  public form = new FormGroup({
    name: new FormControl(this.data?.name, [Validators.required]),
    doctorId: new FormControl(this.data?.doctors[0].id, [Validators.required]),
    nurseId: new FormControl(this.data?.nurses[0].id, [Validators.required]),
  });

  get dataDoctors(): Array<any> {
    const doctors: Array<any> = [];
    this.data?.doctors.forEach((doctor) => {
      doctors.push(doctor.id);
    });
    return doctors;
  }

  get dataNurses(): Array<any> {
    const nurses: Array<any> = [];
    this.data?.nurses.forEach((nurse) => {
      nurses.push(nurse.id);
    });
    return nurses;
  }

  public onSubmit(): void {
    const data: ITeamCreateData = {
      name: this.form.get('name')?.value as string,
      doctorIds: [this.form.get('doctorId')?.value as number],
      nurseIds: [this.form.get('nurseId')?.value as number],
    };

    if (this.editMode) {
      const teamSubscription = this.doctorsService
        .editTeam(this.teamId as number, data)
        .subscribe(() => this.router.navigate(['/admin/teams']));
      this.subscription.add(teamSubscription);
    } else {
      const teamSubscription = this.doctorsService
        .createTeam(data)
        .subscribe(() => this.router.navigate(['/admin']));
      this.subscription.add(teamSubscription);
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
