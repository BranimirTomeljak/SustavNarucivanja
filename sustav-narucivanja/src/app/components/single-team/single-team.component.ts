import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISingleTeam } from 'src/app/interfaces/single-team';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Component({
  selector: 'app-single-team',
  templateUrl: './single-team.component.html',
  styleUrls: ['./single-team.component.scss'],
})
export class SingleTeamComponent implements OnDestroy {
  private readonly subscription = new Subscription();
  @Input() public data?: ISingleTeam;

  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly router: Router
  ) {}

  public onDeleteClick() {
    const deleteSubscription = this.doctorsService
      .deleteTeam(this.data?.teamId as number)
      .subscribe(() => this.router.navigate(['/admin/teams']));
    this.subscription.add(deleteSubscription);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
