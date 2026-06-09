import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface SystemSetting {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) { }

  getSetting(key: string): Observable<SystemSetting> {
    return this.http.get<SystemSetting>(`${this.apiUrl}/${key}`);
  }

  updateSetting(key: string, value: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${key}`, { value });
  }
}
