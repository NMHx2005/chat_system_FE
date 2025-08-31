import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User, UserRole } from '../../models';

@Component({
    selector: 'app-client-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="client-layout">
      <!-- Header Navigation -->
      <header class="client-header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <span class="logo-icon">💬</span>
              <h1>Chat System</h1>
            </div>
          </div>
          
          <nav class="header-nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">🏠</span>
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/groups" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">👥</span>
                  Groups
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/channels" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">📺</span>
                  Channels
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/chat" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">💬</span>
                  Chat
                </a>
              </li>
              
              <!-- Admin Navigation for Super Admin -->
              <li *ngIf="isSuperAdmin()" class="nav-item dropdown">
                <a class="nav-link dropdown-toggle">
                  <span class="nav-icon">⚙️</span>
                  Admin
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a routerLink="/admin/users" class="dropdown-item">
                      <span class="nav-icon">👤</span>
                      Users Management
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/groups" class="dropdown-item">
                      <span class="nav-icon">🏢</span>
                      Groups Management
                    </a>
                  </li>
                </ul>
              </li>
              
              <!-- Admin Navigation for Group Admin -->
              <li *ngIf="isGroupAdmin()" class="nav-item dropdown">
                <a class="nav-link dropdown-toggle">
                  <span class="nav-icon">👥</span>
                  My Admin
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a routerLink="/admin/my-groups" class="dropdown-item">
                      <span class="nav-icon">👥</span>
                      My Groups
                    </a>
                  </li>
                  <li>
                    <a routerLink="/admin/create-group" class="dropdown-item">
                      <span class="nav-icon">➕</span>
                      Create Group
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          
          <div class="header-right">
            <div class="user-info">
              <span class="username">{{ currentUser?.username }}</span>
              <span class="roles">{{ getRolesDisplay() }}</span>
            </div>
            <div class="header-actions">
              <button class="btn-secondary" (click)="logout()">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-content">
          <div class="page-title">
            <h2>{{ pageTitle }}</h2>
            <p>{{ pageDescription }}</p>
          </div>
          <div class="page-actions">
            <ng-content select="[page-actions]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="client-main">
        <ng-content></ng-content>
      </main>
    </div>
  `,
    styles: [`
    .client-layout {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .client-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-left .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 300;
    }

    .header-nav {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .nav-list {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 0.5rem;
    }

    .nav-item {
      position: relative;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      white-space: nowrap;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .nav-icon {
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      padding: 0.5rem 0;
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1001;
    }

    .dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      color: #2c3e50;
      text-decoration: none;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .dropdown-item:hover {
      background: #f8f9fa;
      color: #667eea;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .username {
      font-size: 1rem;
      font-weight: 500;
    }

    .roles {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .page-header {
      background: white;
      border-bottom: 1px solid #e1e5e9;
      padding: 2rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    .page-header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title h2 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .page-title p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }

    .page-actions {
      display: flex;
      gap: 1rem;
    }

    .client-main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .btn-secondary {
      padding: 0.6rem 1.2rem;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    @media (max-width: 1024px) {
      .header-nav {
        display: none;
      }
      
      .header-content {
        justify-content: space-between;
      }
    }

    @media (max-width: 768px) {
      .client-header {
        padding: 1rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .header-right {
        flex-direction: column;
        gap: 1rem;
      }
      
      .user-info {
        align-items: center;
      }
      
      .page-header {
        padding: 1.5rem 1rem;
      }
      
      .page-header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .client-main {
        padding: 1rem;
      }
    }
  `]
})
export class ClientLayoutComponent {
    @Input() pageTitle: string = 'Page Title';
    @Input() pageDescription: string = 'Page description';
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
