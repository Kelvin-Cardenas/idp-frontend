import { Routes } from '@angular/router';
import { UserListComponent } from './features/users/pages/user-list/user-list';
import { UserCreateComponent } from './features/users/pages/user-create/user-create';


export const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent
  },
   {
    path: 'users/create',
    component: UserCreateComponent
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
   {
    path: '**',
    redirectTo: 'users'
  }
];