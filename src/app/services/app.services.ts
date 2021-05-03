import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient, private constants: Constants) {}

  public isOnline(): Observable<boolean> {
    return this.http.get<any>(this.constants.get('fetchIsOnline'));
  }

  public getImages(params?: any): Observable<any> {
    const content = { ['Content-Type']: 'image/svg+xml' };
    return this.http.get<any>(
      `${this.constants.get('file_images')}${this.convertJsonToUrl(params)}`,
      { headers: content }
    );
  }

  public downloadList(): Observable<any> {
    return this.http.get<any>(this.constants.get('fileDownloadList'));
  }
  private convertJsonToUrl(payload?: any): string {
    if (!payload) {
      return '';
    }
    return (
      '?' +
      Object.entries(payload)
        .map((e) => e.join('='))
        .join('&')
    );
  }
}
