import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  public highchartData$: Subject<any> = new Subject();
  public extractData$: BehaviorSubject<any> = new BehaviorSubject(null);

  public setExtract(payload: any) {
    this.extractData$.next(payload);
  }

  public getExtract() {
    return this.extractData$;
  }
}
