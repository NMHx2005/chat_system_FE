import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/layout/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'groups',
    loadComponent: () => import('./components/chat/groups.component').then(m => m.GroupsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'channels',
    loadComponent: () => import('./components/chat/channels.component').then(m => m.ChannelsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.GROUP_ADMIN] },
    children: [
      {
        path: 'users',
        loadComponent: () => import('./components/admin/users.component').then(m => m.UsersComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.SUPER_ADMIN] }
      },
      {
        path: 'groups',
        loadComponent: () => import('./components/admin/groups.component').then(m => m.AdminGroupsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.SUPER_ADMIN] }
      },
      {
        path: 'my-groups',
        loadComponent: () => import('./components/admin/my-groups.component').then(m => m.AdminMyGroupsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.SUPER_ADMIN, UserRole.GROUP_ADMIN] }
      },
      {
        path: 'create-group',
        loadComponent: () => import('./components/admin/create-group.component').then(m => m.AdminCreateGroupComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.SUPER_ADMIN, UserRole.GROUP_ADMIN] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
