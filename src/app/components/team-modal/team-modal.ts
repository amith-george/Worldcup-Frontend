import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team-modal.html',
  styleUrl: './team-modal.css',
})
export class TeamModal {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() teamAdded = new EventEmitter<void>();

  teamForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  selectedFile: File | null = null;

  @Input() pollId: number | null = null;

  constructor(private fb: FormBuilder, private teamService: TeamService) {
    this.teamForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  closeModal() {
    this.close.emit();
    this.teamForm.reset();
    this.selectedFile = null;
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    if (this.pollId === null) {
      this.errorMessage = "Cannot add team without a poll context.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('TeamName', this.teamForm.get('teamName')?.value);
    formData.append('PollId', this.pollId.toString());
    
    if (this.selectedFile) {
      formData.append('Logo', this.selectedFile);
    }

    this.teamService.createTeam(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.teamAdded.emit();
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error || 'Failed to add team.';
      }
    });
  }
}
