import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnDestroy {
  private readonly subscription = new Subscription();
  public teamId = null;

  constructor(private readonly route: ActivatedRoute) {
    const paramSub = this.route.params.subscribe(
      (params) => (this.teamId = params['id'])
    );
    this.subscription.add(paramSub);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
