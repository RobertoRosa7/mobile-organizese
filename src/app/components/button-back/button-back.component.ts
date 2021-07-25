import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-back',
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.scss'],
})
export class ButtonBackComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {}

  public goBack(): void {
    this.location.back();
  }
}
