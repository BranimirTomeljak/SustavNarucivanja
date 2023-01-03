import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISingleTeam } from 'src/app/interfaces/single-team';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss'],
})
export class TeamViewComponent {
  public teamId?: number;
  public data?: ISingleTeam;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorsService: DoctorsService,
    private readonly router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.teamId = params['id'];
      this.doctorsService
        .getTeamById(this.teamId as number)
        .subscribe((result) => {
          this.data = result;
        });
    });
  }

  public onDeleteClick(): void {
    this.doctorsService.deleteTeam(this.teamId as number).subscribe(() => {
      this.router.navigate(['/admin/teams']);
    });
  }
}
