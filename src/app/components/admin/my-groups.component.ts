import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { Group } from '../../models';

@Component({
  selector: 'app-admin-my-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout 
      pageTitle="My Groups Management" 
      pageDescription="Manage groups where you are an admin or member">
      
      <!-- Quick Stats -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">👑</div>
          <div class="stat-content">
            <h3>Admin Groups</h3>
            <p class="stat-number">{{ adminGroups.length }}</p>
            <p class="stat-label">Groups you manage</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Member Groups</h3>
            <p class="stat-number">{{ memberGroups.length }}</p>
            <p class="stat-label">Groups you belong to</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📺</div>
          <div class="stat-content">
            <h3>Total Channels</h3>
            <p class="stat-number">{{ totalChannels }}</p>
            <p class="stat-label">Across all groups</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-content">
            <h3>Total Members</h3>
            <p class="stat-number">{{ totalMembers }}</p>
            <p class="stat-label">Across all groups</p>
          </div>
        </div>
      </div>

      <!-- Admin Groups Section -->
      <div class="section">
        <div class="section-header">
          <h2>Groups You Admin</h2>
          <button class="btn-success" (click)="createNewGroup()">Create New Group</button>
        </div>
        
        <div class="groups-grid">
          <div *ngFor="let group of adminGroups" class="group-card admin">
            <div class="group-header">
              <div class="group-avatar">
                {{ group.name.charAt(0).toUpperCase() }}
              </div>
              <div class="group-info">
                <h3>{{ group.name }}</h3>
                <span class="group-id">ID: {{ group.id }}</span>
              </div>
              <div class="group-status">
                <span class="status-badge" [class]="group.isActive ? 'active' : 'inactive'">
                  {{ group.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            
            <p class="group-description">{{ group.description }}</p>
            
            <div class="group-stats">
              <div class="stat-item">
                <span class="stat-label">Members:</span>
                <span class="stat-value">{{ group.members.length || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Channels:</span>
                <span class="stat-value">{{ group.channels.length || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Created:</span>
                <span class="stat-value">{{ formatDate(group.createdAt) }}</span>
              </div>
            </div>
            
            <div class="group-actions">
              <button class="btn-primary" (click)="manageGroup(group)">Manage Group</button>
              <button class="btn-secondary" (click)="viewMembers(group)">View Members</button>
              <button class="btn-info" (click)="manageChannels(group)">Manage Channels</button>
              <button class="btn-danger" (click)="deleteGroup(group)">Delete Group</button>
            </div>
          </div>
          
          <div *ngIf="adminGroups.length === 0" class="empty-state">
            <div class="empty-icon">👑</div>
            <h3>No Admin Groups</h3>
            <p>You haven't created or been assigned to manage any groups yet.</p>
            <button class="btn-success" (click)="createNewGroup()">Create Your First Group</button>
          </div>
        </div>
      </div>

      <!-- Member Groups Section -->
      <div class="section">
        <div class="section-header">
          <h2>Groups You're a Member Of</h2>
          <button class="btn-primary" (click)="browseAllGroups()">Browse All Groups</button>
        </div>
        
        <div class="groups-grid">
          <div *ngFor="let group of memberGroups" class="group-card member">
            <div class="group-header">
              <div class="group-avatar">
                {{ group.name.charAt(0).toUpperCase() }}
              </div>
              <div class="group-info">
                <h3>{{ group.name }}</h3>
                <span class="group-id">ID: {{ group.id }}</span>
              </div>
              <div class="group-status">
                <span class="status-badge" [class]="group.isActive ? 'active' : 'inactive'">
                  {{ group.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            
            <p class="group-description">{{ group.description }}</p>
            
            <div class="group-stats">
              <div class="stat-item">
                <span class="stat-label">Members:</span>
                <span class="stat-value">{{ group.members.length || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Channels:</span>
                <span class="stat-value">{{ group.channels.length || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Admin:</span>
                <span class="stat-value">{{ getAdminName(group.createdBy) }}</span>
              </div>
            </div>
            
            <div class="group-actions">
              <button class="btn-primary" (click)="viewGroup(group)">View Group</button>
              <button class="btn-secondary" (click)="leaveGroup(group)">Leave Group</button>
              <button class="btn-info" (click)="viewChannels(group)">View Channels</button>
            </div>
          </div>
          
          <div *ngIf="memberGroups.length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>No Member Groups</h3>
            <p>You haven't joined any groups yet.</p>
            <button class="btn-primary" (click)="browseAllGroups()">Browse Available Groups</button>
          </div>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .stats-section {
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

    .section {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #667eea;
    }

    .section-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 300;
    }

    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .group-card {
      background: white;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .group-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .group-card.admin {
      border-color: #667eea;
    }

    .group-card.admin:hover {
      border-color: #5a6fd8;
    }

    .group-card.member {
      border-color: #27ae60;
    }

    .group-card.member:hover {
      border-color: #229954;
    }

    .group-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .group-avatar {
      width: 50px;
      height: 50px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .group-info {
      flex: 1;
    }

    .group-info h3 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .group-id {
      font-size: 0.8rem;
      color: #95a5a6;
    }

    .group-status {
      flex-shrink: 0;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background: #27ae60;
      color: white;
    }

    .status-badge.inactive {
      background: #95a5a6;
      color: white;
    }

    .group-description {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .group-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-weight: 600;
      color: #2c3e50;
    }

    .group-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      background: #f8f9fa;
      border-radius: 12px;
      border: 2px dashed #dee2e6;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: #7f8c8d;
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
    }

    .btn-primary, .btn-secondary, .btn-success, .btn-info, .btn-danger {
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

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-success:hover {
      background: #229954;
      transform: translateY(-2px);
    }

    .btn-info {
      background: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background: #138496;
      transform: translateY(-2px);
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background: #c0392b;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .stats-section {
        grid-template-columns: 1fr;
      }
      
      .groups-grid {
        grid-template-columns: 1fr;
      }
      
      .section-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .group-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminMyGroupsComponent implements OnInit {
  adminGroups: Group[] = [];
  memberGroups: Group[] = [];
  availableAdmins: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadFakeData();
  }

  get totalChannels(): number {
    const allGroups = [...this.adminGroups, ...this.memberGroups];
    return allGroups.reduce((total, group) => total + (group.channels?.length || 0), 0);
  }

  get totalMembers(): number {
    const allGroups = [...this.adminGroups, ...this.memberGroups];
    return allGroups.reduce((total, group) => total + (group.members?.length || 0), 0);
  }

  loadFakeData(): void {
    this.availableAdmins = [
      { id: 'super', username: 'super' },
      { id: 'dev1', username: 'dev1' },
      { id: 'marketing1', username: 'marketing1' },
      { id: 'support1', username: 'support1' },
      { id: 'qa1', username: 'qa1' },
      { id: 'product1', username: 'product1' }
    ];

    // Groups where current user is admin
    this.adminGroups = [
      {
        id: '1',
        name: 'Development Team',
        description: 'Main development team for the chat system project. All developers and designers collaborate here.',
        createdBy: 'super',
        admins: ['super', 'dev1'],
        members: ['super', 'dev1', 'dev2', 'dev3', 'designer1'],
        channels: ['general', 'frontend', 'backend', 'design'],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-31'),
        isActive: true
      },
      {
        id: '2',
        name: 'Marketing Team',
        description: 'Marketing and communication team. Plan campaigns and manage social media presence.',
        createdBy: 'super',
        admins: ['super', 'marketing1'],
        members: ['marketing1', 'marketing2', 'super', 'content1'],
        channels: ['general', 'campaigns', 'social-media', 'analytics'],
        createdAt: new Date('2025-02-15'),
        updatedAt: new Date('2025-08-30'),
        isActive: true
      }
    ];

    // Groups where current user is member
    this.memberGroups = [
      {
        id: '3',
        name: 'Support Team',
        description: 'Customer support and technical assistance team. Help users with their questions and issues.',
        createdBy: 'support1',
        admins: ['support1'],
        members: ['support1', 'support2', 'support3', 'super'],
        channels: ['general', 'tickets', 'faq', 'training'],
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-08-29'),
        isActive: true
      },
      {
        id: '4',
        name: 'QA Team',
        description: 'Quality assurance and testing team. Ensure the highest quality standards for our products.',
        createdBy: 'qa1',
        admins: ['qa1'],
        members: ['qa1', 'qa2', 'qa3', 'qa4', 'super'],
        channels: ['general', 'testing', 'bugs', 'releases'],
        createdAt: new Date('2025-04-01'),
        updatedAt: new Date('2025-08-28'),
        isActive: true
      }
    ];
  }

  getAdminName(adminId: string): string {
    const admin = this.availableAdmins.find(a => a.id === adminId);
    return admin ? admin.username : 'Unknown';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  createNewGroup(): void {
    alert('Create new group functionality will be implemented in Phase 2');
  }

  manageGroup(group: Group): void {
    alert(`Manage group: ${group.name}`);
  }

  viewMembers(group: Group): void {
    alert(`View members for group: ${group.name}`);
  }

  manageChannels(group: Group): void {
    alert(`Manage channels for group: ${group.name}`);
  }

  deleteGroup(group: Group): void {
    if (confirm(`Are you sure you want to delete group: ${group.name}?`)) {
      this.adminGroups = this.adminGroups.filter(g => g.id !== group.id);
      alert(`Group ${group.name} deleted successfully`);
    }
  }

  viewGroup(group: Group): void {
    alert(`View group: ${group.name}`);
  }

  leaveGroup(group: Group): void {
    if (confirm(`Are you sure you want to leave group: ${group.name}?`)) {
      this.memberGroups = this.memberGroups.filter(g => g.id !== group.id);
      alert(`Left group: ${group.name}`);
    }
  }

  viewChannels(group: Group): void {
    alert(`View channels for group: ${group.name}`);
  }

  browseAllGroups(): void {
    alert('Browse all groups functionality will be implemented in Phase 2');
  }
}
