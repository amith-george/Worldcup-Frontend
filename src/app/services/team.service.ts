import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface TeamResult {
  id: number;
  teamName: string;
  logoUrl: string;
  voteCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) { }

  getResults(pollId?: number): Observable<TeamResult[]> {
    const url = pollId ? `${this.apiUrl}/results?pollId=${pollId}` : `${this.apiUrl}/results`;
    return this.http.get<TeamResult[]>(url);
  }

  getTeamsByPoll(pollId: number): Observable<TeamResult[]> {
    return this.http.get<TeamResult[]>(`${this.apiUrl}/poll/${pollId}`);
  }

  createTeam(teamData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, teamData);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
