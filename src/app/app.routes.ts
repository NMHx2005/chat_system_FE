import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'channels',
    loadComponent: () => import('./components/channels/channels.component').then(m => m.ChannelsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'groups',
    loadComponent: () => import('./components/groups/group-interest.component').then(m => m.GroupInterestComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/:groupId',
    loadComponent: () => import('./components/groups/client-group-detail.component').then(m => m.ClientGroupDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'group/:groupId/channel/:channelId',
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/interest',
    loadComponent: () => import('./components/groups/group-interest.component').then(m => m.GroupInterestComponent),
    canActivate: [AuthGuard],
    data: { roles: [UserRole.USER] }
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] },
    children: [
      {
        path: '',
        loadComponent: () => import('./components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/admin/manage-users.component').then(m => m.ManageUsersComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      },
      {
        path: 'groups',
        loadComponent: () => import('./components/admin/manage-groups.component').then(m => m.ManageGroupsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      },
      {
        path: 'groups/:groupId',
        loadComponent: () => import('./components/admin/admin-group-detail.component').then(m => m.AdminGroupDetailComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      },
      {
        path: 'groups/:groupId/edit',
        loadComponent: () => import('./components/admin/edit-group.component').then(m => m.EditGroupComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      },
      {
        path: 'channels',
        loadComponent: () => import('./components/admin/manage-channels.component').then(m => m.ManageChannelsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      },
      {
        path: 'channels/:channelId/edit',
        loadComponent: () => import('./components/admin/edit-channel.component').then(m => m.EditChannelComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      },
      {
        path: 'groups/:groupId/channels',
        loadComponent: () => import('./components/admin/manage-channels.component').then(m => m.ManageChannelsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      },
      {
        path: 'group-requests',
        loadComponent: () => import('./components/admin/manage-group-requests.component').then(m => m.ManageGroupRequestsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.GROUP_ADMIN, UserRole.SUPER_ADMIN] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
