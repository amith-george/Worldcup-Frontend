import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface VoteResponse {
  id: number;
  userId: number;
  username: string;
  teamId: number;
  teamName: string;
  logoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = `${environment.apiUrl}/votes`;

  constructor(private http: HttpClient) { }

  submitVote(teamId: number): Observable<any> {
    return this.http.post(this.apiUrl, { teamId });
  }

  getMyVote(pollId: number): Observable<VoteResponse> {
    return this.http.get<VoteResponse>(`${this.apiUrl}/my-vote/${pollId}`);
  }
}
