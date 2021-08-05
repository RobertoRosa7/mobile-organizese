import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HighchartsEmptyComponent } from './highcharts-empty.component';

describe('HighchartsEmptyComponent', () => {
  let component: HighchartsEmptyComponent;
  let fixture: ComponentFixture<HighchartsEmptyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HighchartsEmptyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HighchartsEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
