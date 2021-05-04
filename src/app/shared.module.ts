import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ModalComponent } from './components/modal/modal.component';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';
import { WindowsHackerComponent } from './components/windows-hacker/windows-hacker.component';
import { Constants } from './services/constants';

@NgModule({
  declarations: [SidepanelComponent, WindowsHackerComponent, ModalComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [
    SidepanelComponent,
    WindowsHackerComponent,
    CommonModule,
    HttpClientModule,
    ModalComponent,
  ],
  providers: [
    {
      provide: Constants,
    },
  ],
})
export class SharedModule {}
