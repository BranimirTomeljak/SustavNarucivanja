import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISingleTeam } from 'src/app/interfaces/single-team';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss'],
})
export class TeamViewComponent implements OnDestroy {
  private readonly subscription = new Subscription();
  public teamId?: number;
  public data?: ISingleTeam;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorsService: DoctorsService,
    private readonly router: Router
  ) {
    const routeSub = this.route.params.subscribe((params) => {
      this.teamId = params['id'];
      const docSub = this.doctorsService
        .getTeamById(this.teamId as number)
        .subscribe((result) => {
          this.data = result;
        });
      this.subscription.add(docSub);
    });
    this.subscription.add(routeSub);
  }

  public onDeleteClick(): void {
    this.doctorsService.deleteTeam(this.teamId as number).subscribe(() => {
      this.router.navigate(['/admin/teams']);
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
