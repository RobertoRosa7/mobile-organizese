import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';

@NgModule({
  declarations: [SidepanelComponent],
  imports: [CommonModule],
  exports: [SidepanelComponent],
})
export class SharedModule {}
