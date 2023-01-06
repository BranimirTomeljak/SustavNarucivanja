import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAttendanceDialogComponent } from './record-attendance-dialog.component';

describe('RecordAttendanceDialogComponent', () => {
  let component: RecordAttendanceDialogComponent;
  let fixture: ComponentFixture<RecordAttendanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordAttendanceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordAttendanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
