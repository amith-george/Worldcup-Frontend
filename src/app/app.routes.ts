import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Leaderboard } from './pages/leaderboard/leaderboard';
import { PollManagement } from './pages/poll-management/poll-management';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'leaderboard/:pollId', component: Leaderboard },
  { path: 'admin-poll-management', component: PollManagement },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
