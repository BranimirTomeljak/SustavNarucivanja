import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptChangeDialogComponent } from './accept-change-dialog.component';

describe('AcceptChangeDialogComponent', () => {
  let component: AcceptChangeDialogComponent;
  let fixture: ComponentFixture<AcceptChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptChangeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
