import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-registers',
  templateUrl: './add-registers.component.html',
  styleUrls: ['./add-registers.component.scss'],
})
export class AddRegistersComponent implements OnInit {
  @Input() public type: string;
  constructor() {}

  ngOnInit() {
    console.log(this.type);
  }
}
