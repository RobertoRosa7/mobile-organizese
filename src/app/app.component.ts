import { Component } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private deepLink: Deeplinks) {}
}
