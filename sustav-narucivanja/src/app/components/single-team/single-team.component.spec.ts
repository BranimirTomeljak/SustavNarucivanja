import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTeamComponent } from './single-team.component';

describe('SingleTeamComponent', () => {
  let component: SingleTeamComponent;
  let fixture: ComponentFixture<SingleTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
