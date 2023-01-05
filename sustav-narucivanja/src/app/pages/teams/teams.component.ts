import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  public teamId = null;

  constructor(private readonly route: ActivatedRoute) {
    this.route.params.subscribe((params) => (this.teamId = params['id']));
  }

  ngOnInit(): void {}
}
