import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';
import { WindowsHackerComponent } from './components/windows-hacker/windows-hacker.component';
import { Constants } from './services/constants';

@NgModule({
  declarations: [SidepanelComponent, WindowsHackerComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [
    SidepanelComponent,
    WindowsHackerComponent,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: Constants,
    },
  ],
})
export class SharedModule {}
