import { AfterViewInit, Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  public ngAfterViewInit(): void {
    this.addSvgIcon('more_vert')
      .addSvgIcon('train')
      .addSvgIcon('restaurant')
      .addSvgIcon('perm_identity')
      .addSvgIcon('checkroom')
      .addSvgIcon('edit')
      .addSvgIcon('add')
      .addSvgIcon('person_outline')
      .addSvgIcon('sync')
      .addSvgIcon('notifications')
      .addSvgIcon('notifications_none')
      .addSvgIcon('add_white')
      .addSvgIcon('person_outline_white')
      .addSvgIcon('sync_white')
      .addSvgIcon('notifications_white')
      .addSvgIcon('notifications_none_white')
      .addSvgIcon('delete_outline')
      .addSvgIcon('swap_vert')
      .addSvgIcon('drag_indicator')
      .addSvgIcon('account_balance')
      .addSvgIcon('work_outline')
      .addSvgIcon('arrow_back')
      .addSvgIcon('arrow_back_white');
  }
  private addSvgIcon(name: string, alias?: string, namespace?: string): this {
    const path = this.sanitizer.bypassSecurityTrustResourceUrl(
      'assets/icon/' + name + '.svg'
    );
    alias = alias ? alias : name;
    if (namespace) {
      this.matIconRegistry.addSvgIconInNamespace(namespace, alias, path);
    } else {
      this.matIconRegistry.addSvgIcon(alias, path);
    }
    return this;
  }
}
