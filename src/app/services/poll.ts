import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Poll {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = `${environment.apiUrl}/polls`;

  constructor(private http: HttpClient) { }

  getPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.apiUrl);
  }

  createPoll(title: string): Observable<Poll> {
    return this.http.post<Poll>(this.apiUrl, { title });
  }
}
