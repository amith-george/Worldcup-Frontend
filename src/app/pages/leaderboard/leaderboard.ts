import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TeamService, TeamResult } from '../../services/team.service';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';
import { TeamModal } from '../../components/team-modal/team-modal';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TeamModal],
  templateUrl: './leaderboard.html'
})
export class Leaderboard implements OnInit {
  results: TeamResult[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  serverUrl = 'http://localhost:5024';
  pollId: number | null = null;
  isAdmin = false;
  isModalVisible = false;
  isRevealed = false;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location,
    private settingsService: SettingsService
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    this.isAdmin = currentUser?.role === 'Admin';

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('pollId');
      if (idParam) {
        this.pollId = parseInt(idParam, 10);
      }
      this.fetchResults();
      
      if (this.isAdmin) {
        this.fetchRevealStatus();
      }
    });
  }

  fetchRevealStatus() {
    this.settingsService.getSetting('AreResultsRevealed').subscribe({
      next: (setting) => {
        this.isRevealed = setting.value.toLowerCase() === 'true';
      },
      error: () => {
        this.isRevealed = false;
      }
    });
  }

  toggleReveal() {
    const action = this.isRevealed ? "hide" : "reveal";
    if (confirm(`Are you sure you want to ${action} the results for all polls?`)) {
      const newValue = this.isRevealed ? "false" : "true";
      this.settingsService.updateSetting('AreResultsRevealed', newValue).subscribe({
        next: () => {
          this.isRevealed = !this.isRevealed;
          this.fetchResults(); // Refresh list to ensure we show results if just revealed
        },
        error: (err) => {
          console.error("Failed to update reveal status", err);
          alert("Failed to update reveal status.");
        }
      });
    }
  }

  deleteTeam(teamId: number, event: Event) {
    event.stopPropagation();
    if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      this.teamService.deleteTeam(teamId).subscribe({
        next: () => {
          this.fetchResults();
        },
        error: (err) => {
          console.error("Failed to delete team", err);
          alert("Failed to delete team.");
        }
      });
    }
  }

  fetchResults() {
    this.isLoading = true;
    this.errorMessage = null;
    this.teamService.getResults(this.pollId ?? undefined).subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = "The voting results have not been revealed yet.";
        } else {
          this.errorMessage = "Failed to load leaderboard. Please try again later.";
        }
        this.isLoading = false;
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

  openAddTeamModal() {
    this.isModalVisible = true;
  }

  closeAddTeamModal() {
    this.isModalVisible = false;
  }

  onTeamAdded() {
    this.fetchResults();
  }
}
