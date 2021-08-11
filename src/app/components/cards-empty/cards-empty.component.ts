import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-empty',
  templateUrl: './cards-empty.component.html',
  styleUrls: ['./cards-empty.component.scss'],
})
export class CardsEmptyComponent implements OnInit {
  public cards: any[] = [
    {
      title: 'Consolidado',
      icon: '',
      show: true,
      value: 0,
      type: 'consolidado',
      percent: 0,
    },
  ];
  constructor() { }

  ngOnInit() {}

}
