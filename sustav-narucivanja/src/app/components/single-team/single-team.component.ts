import { Component, Input, OnInit } from '@angular/core';
import { ISingleTeam } from 'src/app/interfaces/single-team';

@Component({
  selector: 'app-single-team',
  templateUrl: './single-team.component.html',
  styleUrls: ['./single-team.component.scss'],
})
export class SingleTeamComponent {
  @Input() public data?: ISingleTeam;

  constructor() {}
}
