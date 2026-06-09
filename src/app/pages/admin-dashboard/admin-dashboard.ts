import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollService, Poll } from '../../services/poll';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  polls: Poll[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private pollService: PollService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUser();
    if (!currentUser || currentUser.role !== 'Admin') {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadPolls();
  }

  loadPolls() {
    this.isLoading = true;
    this.errorMessage = null;
    this.pollService.getPolls().subscribe({
      next: (results) => {
        this.polls = results;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load polls.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
