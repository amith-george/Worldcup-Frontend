import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PollService, Poll } from '../../services/poll';

@Component({
  selector: 'app-poll-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './poll-management.html'
})
export class PollManagement implements OnInit {
  polls: Poll[] = [];
  isLoading = true;
  pollForm: FormGroup;
  isSubmitting = false;

  constructor(
    private pollService: PollService, 
    private fb: FormBuilder,
    private location: Location
  ) {
    this.pollForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.fetchPolls();
  }

  fetchPolls() {
    this.isLoading = true;
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  startNewPoll() {
    if (this.pollForm.invalid) return;

    this.isSubmitting = true;
    this.pollService.createPoll(this.pollForm.value.title).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.pollForm.reset();
        this.fetchPolls(); // Refresh list to show new active poll
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
