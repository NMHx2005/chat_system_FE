import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { Group, Channel, Message } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <mat-card class="dashboard-header">
        <div class="welcome-section">
          <mat-card-title>Welcome back, {{ currentUser?.username }}!</mat-card-title>
          <mat-card-subtitle class="user-role">{{ getRoleDisplayName() }}</mat-card-subtitle>
          <mat-card-subtitle class="last-login">Last login: {{ formatDate(currentUser?.updatedAt) }}</mat-card-subtitle>
        </div>
        
        <div class="user-actions">
          <button mat-button color="primary" routerLink="/profile" matTooltip="View your profile">
            <mat-icon>person</mat-icon>
            Profile
          </button>
          <button mat-button color="warn" (click)="logout()" matTooltip="Sign out">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
      </mat-card>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon class="stat-icon">groups</mat-icon>
          <div class="stat-content">
            <h3>{{ myGroups.length }}</h3>
            <p>My Groups</p>
          </div>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-icon class="stat-icon">chat</mat-icon>
          <div class="stat-content">
            <h3>{{ totalChannels }}</h3>
            <p>Channels</p>
          </div>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-icon class="stat-icon">message</mat-icon>
          <div class="stat-content">
            <h3>{{ totalMessages }}</h3>
            <p>Messages</p>
          </div>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-icon class="stat-icon">people</mat-icon>
          <div class="stat-content">
            <h3>{{ totalMembers }}</h3>
            <p>Members</p>
          </div>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <mat-card class="quick-actions">
        <mat-card-title>Quick Actions</mat-card-title>
        <div class="actions-grid">
          <button mat-raised-button class="action-btn" routerLink="/chat" matTooltip="Start chatting in a channel">
            <mat-icon>chat</mat-icon>
            <span>Start Chatting</span>
          </button>
          
          <button mat-raised-button class="action-btn" routerLink="/groups" matTooltip="Browse available groups">
            <mat-icon>groups</mat-icon>
            <span>Browse Groups</span>
          </button>
          
          <button *ngIf="isGroupAdmin || isSuperAdmin" mat-raised-button class="action-btn" routerLink="/admin" matTooltip="Access admin panel">
            <mat-icon>settings</mat-icon>
            <span>Admin Panel</span>
          </button>
          
          <button *ngIf="isSuperAdmin" mat-raised-button class="action-btn" routerLink="/admin/users" matTooltip="Manage all users">
            <mat-icon>person</mat-icon>
            <span>Manage Users</span>
          </button>
          
          <button *ngIf="isGroupAdmin || isSuperAdmin" mat-raised-button class="action-btn" routerLink="/admin/groups" matTooltip="Manage groups">
            <mat-icon>build</mat-icon>
            <span>Manage Groups</span>
          </button>
        </div>
      </mat-card>

      <!-- My Groups Section -->
      <mat-card class="section">
        <div class="section-header">
          <mat-card-title>My Groups</mat-card-title>
          <button *ngIf="isGroupAdmin || isSuperAdmin" mat-raised-button color="primary" routerLink="/admin/groups" matTooltip="Create a new group">
            <mat-icon>add</mat-icon>
            Create New Group
          </button>
        </div>
        
        <div class="groups-grid">
          <mat-card *ngFor="let group of myGroups" class="group-card">
            <mat-card-header>
              <mat-card-title>{{ group.name }}</mat-card-title>
              <mat-chip class="member-count">{{ group.members.length }} members</mat-chip>
            </mat-card-header>
            <mat-card-content>
              <p class="group-description">{{ group.description || 'No description available' }}</p>
              
              <div class="group-channels">
                <h4>Channels:</h4>
                <div class="channels-list">
                  <mat-chip *ngFor="let channelId of group.channels" class="channel-tag">
                    # {{ getChannelName(channelId) }}
                  </mat-chip>
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-button color="primary" (click)="viewGroup(group.id)" matTooltip="View group details">
                <mat-icon>visibility</mat-icon>
                View Group
              </button>
              <button mat-button color="accent" (click)="joinChat(group.id)" matTooltip="Join group chat">
                <mat-icon>chat</mat-icon>
                Join Chat
              </button>
            </mat-card-actions>
          </mat-card>
          
          <div *ngIf="myGroups.length === 0" class="empty-state">
            <mat-icon class="empty-icon">groups</mat-icon>
            <h3>No Groups Yet</h3>
            <p>You haven't joined any groups yet. Start exploring!</p>
            <button mat-raised-button color="primary" routerLink="/groups" matTooltip="Browse available groups">
              <mat-icon>explore</mat-icon>
              Browse Groups
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Recent Activity -->
      <mat-card class="section">
        <mat-card-title>Recent Activity</mat-card-title>
        <div class="activity-list">
          <div *ngFor="let activity of recentActivity" class="activity-item">
            <mat-icon class="activity-icon">{{ activity.icon }}</mat-icon>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
            </div>
          </div>
          
          <div *ngIf="recentActivity.length === 0" class="empty-state">
            <p>No recent activity</p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      background: #f8f9fa;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .welcome-section mat-card-title {
      font-size: 2rem;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .user-role {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .last-login {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .user-actions {
      display: flex;
      gap: 12px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background: white;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 32px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #667eea;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1.8rem;
      color: #333;
      font-weight: 500;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .quick-actions {
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      margin-bottom: 24px;
      background: white;
    }

    .quick-actions mat-card-title {
      color: #333;
      font-size: 1.5rem;
      margin-bottom: 16px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      background: #f5f5f5;
      color: #333;
    }

    .action-btn:hover {
      background: #e3f2fd;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
    }

    .section {
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      margin-bottom: 24px;
      background: white;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 16px;
    }

    .group-card {
      border-radius: 12px;
      transition: all 0.3s ease;
      background: white;
    }

    .group-card:hover {
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .group-header mat-card-title {
      font-size: 1.3rem;
      color: #333;
    }

    .member-count {
      background: #667eea !important;
      color: white !important;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .group-description {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .group-channels h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1rem;
    }

    .channels-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .channel-tag {
      background: #e3f2fd !important;
      color: #1976d2 !important;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .group-actions {
      display: flex;
      gap: 12px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      color: #ddd;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .empty-state p {
      margin: 0 0 16px 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .activity-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 50%;
      color: #667eea;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .activity-time {
      color: #666;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }
      
      .dashboard-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
      
      .welcome-section mat-card-title {
        font-size: 1.8rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .groups-grid {
        grid-template-columns: 1fr;
      }
      
      .section-header {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  myGroups: Group[] = [];
  totalChannels = 0;
  totalMessages = 0;
  totalMembers = 0;
  recentActivity: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  get isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  get isGroupAdmin(): boolean {
    return this.authService.isGroupAdmin();
  }

  getRoleDisplayName(): string {
    if (this.isSuperAdmin) return 'Super Administrator';
    if (this.isGroupAdmin) return 'Group Administrator';
    return 'User';
  }

  loadDashboardData(): void {
    this.loadMockGroups();
    this.calculateStats();
    this.loadRecentActivity();
  }

  loadMockGroups(): void {
    this.myGroups = [
      {
        id: '1',
        name: 'Development Team',
        description: 'Main development team for the chat system project.',
        category: 'technology',
        status: 'active' as any,
        createdBy: 'super',
        admins: ['super', 'admin'],
        members: ['super', 'admin', 'user'],
        channels: ['general', 'frontend', 'backend'],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: '2',
        name: 'Design Team',
        description: 'Creative discussions and design feedback.',
        category: 'design',
        status: 'active' as any,
        createdBy: 'admin',
        admins: ['admin'],
        members: ['admin', 'user'],
        channels: ['general', 'ui-ux', 'inspiration'],
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date(),
        isActive: true
      }
    ];
  }

  calculateStats(): void {
    this.totalChannels = this.myGroups.reduce((total, group) => total + group.channels.length, 0);
    this.totalMessages = 156;
    this.totalMembers = this.myGroups.reduce((total, group) => total + group.members.length, 0);
  }

  loadRecentActivity(): void {
    this.recentActivity = [
      {
        icon: 'chat',
        text: 'New message in #general channel',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        icon: 'groups',
        text: 'Joined Development Team group',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        icon: 'add_circle',
        text: 'Created new channel #frontend',
        timestamp: new Date(Date.now() - 7200000)
      }
    ];
  }

  getChannelName(channelId: string): string {
    const channelNames: { [key: string]: string } = {
      'general': 'general',
      'frontend': 'frontend',
      'backend': 'backend',
      'ui-ux': 'ui-ux',
      'inspiration': 'inspiration'
    };
    return channelNames[channelId] || channelId;
  }

  viewGroup(groupId: string): void {
    this.router.navigate(['/groups'], { queryParams: { group: groupId } });
  }

  joinChat(groupId: string): void {
    const group = this.myGroups.find(g => g.id === groupId);
    if (group && group.channels.length > 0) {
      this.router.navigate(['/group', groupId, 'channel', group.channels[0]]);
    } else {
      this.router.navigate(['/chat']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}