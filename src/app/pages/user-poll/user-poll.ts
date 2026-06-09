import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeamService, TeamResult } from '../../services/team.service';
import { VoteService } from '../../services/vote.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-user-poll',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-poll.html'
})
export class UserPoll implements OnInit {
  teams: TeamResult[] = [];
  pollId: number | null = null;
  isLoading = true;
  hasVoted = false;
  isVoting = false;
  votedTeamId: number | null = null;
  serverUrl = 'http://localhost:5024';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private voteService: VoteService,
    private settingsService: SettingsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('pollId');
      if (idParam) {
        this.pollId = parseInt(idParam, 10);
        this.checkIfRevealed();
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    });
  }

  checkIfRevealed() {
    this.settingsService.getSetting('AreResultsRevealed').subscribe({
      next: (setting) => {
        if (setting.value.toLowerCase() === 'true') {
          // Results are revealed, redirect to leaderboard
          this.router.navigate(['/leaderboard', this.pollId]);
        } else {
          // Not revealed, continue to load voting view
          this.checkVoteStatus();
        }
      },
      error: () => {
        // Fallback to loading voting view if setting fetch fails
        this.checkVoteStatus();
      }
    });
  }

  checkVoteStatus() {
    if (!this.pollId) return;
    
    this.voteService.getMyVote(this.pollId).subscribe({
      next: (vote) => {
        this.hasVoted = true;
        this.votedTeamId = vote.teamId;
        this.fetchTeams();
      },
      error: (err) => {
        if (err.status === 404) {
          // Normal state: user hasn't voted
          this.hasVoted = false;
        }
        this.fetchTeams();
      }
    });
  }

  fetchTeams() {
    if (!this.pollId) return;

    this.teamService.getTeamsByPoll(this.pollId).subscribe({
      next: (data) => {
        this.teams = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch teams", err);
        this.isLoading = false;
      }
    });
  }

  voteForTeam(teamId: number) {
    if (this.hasVoted || this.isVoting) return;

    this.isVoting = true;
    this.voteService.submitVote(teamId).subscribe({
      next: () => {
        this.isVoting = false;
        this.hasVoted = true;
        this.votedTeamId = teamId;
        alert("Your vote has been submitted successfully!");
      },
      error: (err) => {
        this.isVoting = false;
        alert(err.error?.message || err.error || "Failed to submit vote. The poll may not be active.");
      }
    });
  }

  getLogoUrl(logoRelativePath: string | undefined): string {
    if (!logoRelativePath) {
      return 'assets/default-logo.png';
    }
    if (logoRelativePath.startsWith('http')) {
      return logoRelativePath;
    }
    return `${this.serverUrl}${logoRelativePath}`;
  }

  goBack() {
    this.router.navigate(['/user-dashboard']);
  }
}
