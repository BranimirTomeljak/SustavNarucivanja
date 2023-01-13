import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Form, FormBuilder} from '@angular/forms';

type AppForChange = {
  date : string,
  id_from?: number | string,
  id_to?: number | string,
  title_from?: string,
  title_to: string,
  selected?: boolean
}

@Component({
  selector: 'accept-change-dialog',
  templateUrl: './accept-change-dialog.component.html',
  styleUrls: ['./accept-change-dialog.component.scss']
})
export class AcceptChangeDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : {appointments : AppForChange[]},
    private _formBuilder: FormBuilder
  ) {}
  onChange(appointment : AppForChange, attendance : boolean){
    var app = this.data.appointments.find(a => a == appointment);
    if(app != undefined){
      app.selected = attendance;
    }
  }
}