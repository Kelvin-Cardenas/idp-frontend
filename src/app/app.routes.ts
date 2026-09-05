import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { MemberListComponent } from './features/members/pages/member-list/member-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: DashboardComponent },
      { path: 'members', component: MemberListComponent },

      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
