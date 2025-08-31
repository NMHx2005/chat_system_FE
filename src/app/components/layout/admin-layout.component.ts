import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User, UserRole } from '../../models';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="admin-layout">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-content">
          <div class="header-left">
            <h1>{{ pageTitle }}</h1>
            <p>{{ pageDescription }}</p>
          </div>
          <div class="header-right">
            <div class="user-info">
              <span class="username">{{ currentUser?.username }}</span>
              <span class="roles">{{ getRolesDisplay() }}</span>
            </div>
            <div class="header-actions">
              <button class="btn-secondary" routerLink="/dashboard">Back to Dashboard</button>
              <button class="btn-primary" (click)="logout()">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div class="admin-content">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <nav class="sidebar-nav">
            <h3>Admin Navigation</h3>
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">🏠</span>
                  Dashboard
                </a>
              </li>
              
              <!-- Super Admin Navigation -->
              <li *ngIf="isSuperAdmin()" class="nav-item admin-section">
                <h4>Super Admin</h4>
                <ul class="admin-nav">
                  <li>
                    <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">👤</span>
                      Users Management
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/groups" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">🏢</span>
                      Groups Management
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/roles" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">🔐</span>
                      Role Management
                    </a>
                  </li>
                </ul>
              </li>
              
              <!-- Group Admin Navigation -->
              <li *ngIf="isGroupAdmin()" class="nav-item admin-section">
                <h4>Group Admin</h4>
                <ul class="admin-nav">
                  <li>
                    <a routerLink="/admin/my-groups" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">👥</span>
                      My Groups
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/create-group" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">➕</span>
                      Create Group
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/manage-members" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">👥</span>
                      Manage Members
                    </a>
                  </li>
                </ul>
              </li>

              <!-- General Admin Navigation -->
              <li class="nav-item admin-section">
                <h4>General</h4>
                <ul class="admin-nav">
                  <li>
                    <a routerLink="/groups" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">👥</span>
                      Browse Groups
                    </a>
                  </li>
                  <li>
                    <a routerLink="/channels" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">📺</span>
                      Browse Channels
                    </a>
                  </li>
                  <li>
                    <a routerLink="/chat" routerLinkActive="active" class="nav-link">
                      <span class="nav-icon">💬</span>
                      Chat
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="admin-main">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
    styles: [`
    .admin-layout {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .admin-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-left h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .header-left p {
      margin: 0;
      opacity: 0.9;
      font-size: 1rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .username {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .roles {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .admin-content {
      display: flex;
      min-height: calc(100vh - 100px);
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-sidebar {
      width: 300px;
      background: white;
      border-right: 1px solid #e1e5e9;
      box-shadow: 2px 0 10px rgba(0,0,0,0.05);
      padding: 2rem;
    }

    .sidebar-nav h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
      font-size: 1.3rem;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #2c3e50;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-link:hover {
      background: #f8f9fa;
      color: #667eea;
      transform: translateX(5px);
    }

    .nav-link.active {
      background: #667eea;
      color: white;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    .nav-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
    }

    .admin-section {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e1e5e9;
    }

    .admin-section h4 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .admin-nav {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .admin-nav .nav-link {
      padding-left: 2rem;
      font-size: 0.9rem;
      border-left: 3px solid transparent;
    }

    .admin-nav .nav-link:hover {
      border-left-color: #667eea;
    }

    .admin-nav .nav-link.active {
      border-left-color: white;
    }

    .admin-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .btn-primary, .btn-secondary {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .admin-content {
        flex-direction: column;
      }
      
      .admin-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e1e5e9;
      }
      
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .header-right {
        flex-direction: column;
        gap: 1rem;
      }
      
      .user-info {
        align-items: center;
      }
    }
  `]
})
export class AdminLayoutComponent {
    @Input() pageTitle: string = 'Admin Panel';
    @Input() pageDescription: string = 'Manage your system';
    @Input() currentUser: User | null = null;

    constructor(private router: Router) {
        // Get current user from localStorage (simulated)
        this.currentUser = {
            id: '1',
            username: 'super',
            email: 'super@example.com',
            roles: [UserRole.SUPER_ADMIN],
            groups: ['1', '2'],
            createdAt: new Date('2025-01-01'),
            updatedAt: new Date(),
            isActive: true
        };
    }

    getRolesDisplay(): string {
        if (!this.currentUser?.roles) return '';
        return this.currentUser.roles.map(role => this.getRoleDisplayName(role)).join(', ');
    }

    getRoleDisplayName(role: UserRole): string {
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return 'Super Admin';
            case UserRole.GROUP_ADMIN:
                return 'Group Admin';
            case UserRole.USER:
                return 'User';
            default:
                return 'Unknown';
        }
    }

    isSuperAdmin(): boolean {
        return this.currentUser?.roles?.includes(UserRole.SUPER_ADMIN) || false;
    }

    isGroupAdmin(): boolean {
        return this.currentUser?.roles?.includes(UserRole.GROUP_ADMIN) || false;
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}
