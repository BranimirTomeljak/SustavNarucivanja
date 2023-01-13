import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Form, FormBuilder} from '@angular/forms';

type App = {
  id?: number | string,
  title: string,
  selected?: boolean
}

@Component({
  selector: 'app-record-attendance-dialog',
  templateUrl: './record-attendance-dialog.component.html',
  styleUrls: ['./record-attendance-dialog.component.scss']
})
export class RecordAttendanceDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : {appointments : App[]},
    private _formBuilder: FormBuilder
  ) {}
  onChange(appointment : App, attendance : boolean){
    var app = this.data.appointments.find(a => a == appointment);
    if(app != undefined){
      app.selected = attendance;
    }
  }
}