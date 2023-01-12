import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseWorkingHoursComponent } from './nurse-working-hours.component';

describe('NurseWorkingHoursComponent', () => {
  let component: NurseWorkingHoursComponent;
  let fixture: ComponentFixture<NurseWorkingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NurseWorkingHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NurseWorkingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
