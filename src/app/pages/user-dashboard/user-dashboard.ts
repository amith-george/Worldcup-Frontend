import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PollService, Poll } from '../../services/poll';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html'
})
export class UserDashboard implements OnInit {
  activePolls: Poll[] = [];
  isLoading = true;

  constructor(
    private pollService: PollService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPolls();
  }

  fetchPolls() {
    this.isLoading = true;
    this.pollService.getPolls().subscribe({
      next: (polls) => {
        this.activePolls = polls.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load polls", err);
        this.isLoading = false;
      }
    });
  }

  goToPoll(pollId: number) {
    this.router.navigate(['/user-poll', pollId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
