import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollManagement } from './poll-management';

describe('PollManagement', () => {
  let component: PollManagement;
  let fixture: ComponentFixture<PollManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(PollManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
