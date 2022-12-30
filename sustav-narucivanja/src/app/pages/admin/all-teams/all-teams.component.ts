import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Component({
  selector: 'app-all-teams',
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.scss'],
})
export class AllTeamsComponent {
  public teams$ = this.doctorsService.getAllTeams();

  constructor(private readonly doctorsService: DoctorsService) {}
}
