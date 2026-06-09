import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamModal } from './team-modal';

describe('TeamModal', () => {
  let component: TeamModal;
  let fixture: ComponentFixture<TeamModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
