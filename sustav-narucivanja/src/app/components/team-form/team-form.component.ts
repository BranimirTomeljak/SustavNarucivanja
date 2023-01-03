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
          const doctorIds: number[] = [];
          result.forEach((doctor: any) => {
            if (
              (!doctor.teamid || this.dataDoctors.includes(doctor.id)) &&
              !doctorIds.includes(doctor.id)
            ) {
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
          const nurseIds: number[] = [];
          result.forEach((nurse: any) => {
            if (
              (!nurse.teamid || this.dataNurses.includes(nurse.id)) &&
              !nurseIds.includes(nurse.id)
            ) {
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
    // this.setFormValues();
    this.trigger$.next(null);
  }

  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    doctorId: new FormControl(this.data?.doctors[0].id, [Validators.required]),
    nurseId: new FormControl(this.data?.nurses[0].id, [Validators.required]),
  });

  // get doctorIds(): FormArray {
  //   return this.form.get('doctorIds') as FormArray;
  // }

  // get nurseIds(): FormArray {
  //   return this.form.get('nurseIds') as FormArray;
  // }

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

  // private setFormValues(): void {
  //   if (this.data) {
  //     this.form.get('name')?.setValue(this.data.name);
  //     this.data.doctors.forEach((doctor) => {
  //       this.doctorIds.push(new FormControl(doctor.id, [Validators.required]));
  //     });
  //     this.data.nurses.forEach((nurse) => {
  //       this.nurseIds.push(new FormControl(nurse.id, [Validators.required]));
  //     });
  //   }
  // }

  // public addDoctorId(): void {
  //   this.doctorIds.push(new FormControl(null, [Validators.required]));
  // }

  // public addNurseId(): void {
  //   this.nurseIds.push(new FormControl(null, [Validators.required]));
  // }

  // public onDoctorRemoveClick(index: number): void {
  //   const doctors = this.form.get('doctorIds') as FormArray;
  //   doctors.removeAt(index);
  // }

  // public onNurseRemoveClick(index: number): void {
  //   const nurses = this.form.get('nurseIds') as FormArray;
  //   nurses.removeAt(index);
  // }

  public onSubmit(): void {
    const data: ITeamCreateData = {
      name: this.form.get('name')?.value as string,
      doctorIds: [this.form.get('doctorId')?.value as number],
      nurseIds: [this.form.get('nurseId')?.value as number],
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
