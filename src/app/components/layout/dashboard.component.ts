import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models';
import { AdminLayoutComponent } from './admin-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  template: `
    <app-admin-layout 
      pageTitle="Dashboard" 
      pageDescription="Welcome to your chat system overview">
      
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h2>Welcome back, {{ currentUser?.username }}!</h2>
          <p>Here's what's happening in your chat system today.</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>My Groups</h3>
            <p class="stat-number">{{ currentUser?.groups?.length || 0 }}</p>
            <p class="stat-label">Active Groups</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📺</div>
          <div class="stat-content">
            <h3>Channels</h3>
            <p class="stat-number">12</p>
            <p class="stat-label">Available Channels</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <h3>Messages</h3>
            <p class="stat-number">47</p>
            <p class="stat-label">Today's Messages</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-content">
            <h3>Online Users</h3>
            <p class="stat-number">8</p>
            <p class="stat-label">Currently Online</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <button class="action-card" routerLink="/chat">
            <span class="action-icon">💬</span>
            <h4>Start Chatting</h4>
            <p>Join a channel and start messaging</p>
          </button>

          <button class="action-card" routerLink="/groups">
            <span class="action-icon">👥</span>
            <h4>Browse Groups</h4>
            <p>Find and join new groups</p>
          </button>

          <button class="action-card" routerLink="/channels">
            <span class="action-icon">📺</span>
            <h4>Explore Channels</h4>
            <p>Discover new channels to join</p>
          </button>

          <button *ngIf="isGroupAdmin()" class="action-card" routerLink="/admin/create-group">
            <span class="action-icon">➕</span>
            <h4>Create Group</h4>
            <p>Start a new group for your team</p>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity-section">
        <h3>Recent Activity</h3>
        <div class="activity-list">
          <div class="activity-item">
            <span class="activity-icon">💬</span>
            <div class="activity-content">
              <p><strong>dev1</strong> joined the <strong>Frontend Development</strong> channel</p>
              <span class="activity-time">2 minutes ago</span>
            </div>
          </div>

          <div class="activity-item">
            <span class="activity-icon">👥</span>
            <div class="activity-content">
              <p><strong>marketing1</strong> created a new group: <strong>Campaign Planning</strong></p>
              <span class="activity-time">15 minutes ago</span>
            </div>
          </div>

          <div class="activity-item">
            <span class="activity-icon">📺</span>
            <div class="activity-content">
              <p><strong>qa1</strong> joined the <strong>Testing</strong> channel</p>
              <span class="activity-time">1 hour ago</span>
            </div>
          </div>

          <div class="activity-item">
            <span class="activity-icon">💬</span>
            <div class="activity-content">
              <p><strong>designer1</strong> sent a message in <strong>Design Discussion</strong></p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .welcome-section {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      text-align: center;
    }

    .welcome-content h2 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 300;
    }

    .welcome-content p {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content h3 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .stat-number {
      color: #667eea;
      margin: 0 0 0.25rem 0;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .stat-label {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.9rem;
    }

    .quick-actions-section {
      margin-bottom: 2rem;
    }

    .quick-actions-section h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
      display: inline-block;
      font-size: 1.5rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      text-align: center;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: block;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      border-color: #667eea;
    }

    .action-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .action-card h4 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
    }

    .action-card p {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .recent-activity-section h3 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
      display: inline-block;
      font-size: 1.5rem;
    }

    .activity-list {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
      margin-top: 0.25rem;
    }

    .activity-content p {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      line-height: 1.5;
    }

    .activity-time {
      font-size: 0.8rem;
      color: #95a5a6;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
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

  isGroupAdmin(): boolean {
    return this.currentUser?.roles?.includes(UserRole.GROUP_ADMIN) || false;
  }
}
