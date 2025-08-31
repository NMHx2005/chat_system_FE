import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from '../../models';
import { ClientLayoutComponent } from '../layout/client-layout.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientLayoutComponent],
  template: `
    <app-client-layout 
      pageTitle="Groups Management" 
      pageDescription="Manage your groups and join new ones">
      
      <div page-actions>
        <button class="btn-primary" routerLink="/admin/create-group">Create New Group</button>
        <button class="btn-secondary" routerLink="/channels">View Channels</button>
      </div>

      <!-- My Groups Section -->
      <div class="section">
        <h2>My Groups</h2>
        <div class="groups-grid">
          <div *ngFor="let group of myGroups" class="group-card">
            <div class="group-header">
              <h3>{{ group.name }}</h3>
              <span class="member-count">{{ group.members.length }} members</span>
            </div>
            <p class="group-description">{{ group.description }}</p>
            <div class="group-actions">
              <button class="btn-primary" (click)="viewGroup(group.id)">View Group</button>
              <button class="btn-secondary" (click)="viewChannels(group.id)">Channels</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Groups Section -->
      <div class="section">
        <h2>Available Groups</h2>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search groups..." 
            [(ngModel)]="searchTerm"
            class="search-input">
        </div>
        <div class="groups-grid">
          <div *ngFor="let group of availableGroups" class="group-card available">
            <div class="group-header">
              <h3>{{ group.name }}</h3>
              <span class="member-count">{{ group.members.length }} members</span>
            </div>
            <p class="group-description">{{ group.description }}</p>
            <div class="group-actions">
              <button class="btn-success" (click)="joinGroup(group.id)">Join Group</button>
              <button class="btn-info" (click)="viewGroupDetails(group.id)">Details</button>
            </div>
          </div>
        </div>
      </div>
    </app-client-layout>
  `,
  styles: [`
    .section {
      margin-bottom: 3rem;
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }

    .section h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #667eea;
      display: inline-block;
    }

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
      border-color: #667eea;
    }

    .group-card.available {
      border-color: #27ae60;
    }

    .group-card.available:hover {
      border-color: #27ae60;
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .group-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .member-count {
      background: #667eea;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .group-description {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .group-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-success, .btn-info {
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

    @media (max-width: 768px) {
      .groups-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GroupsComponent implements OnInit {
  searchTerm = '';
  myGroups: Group[] = [];
  availableGroups: Group[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadFakeData();
  }

  loadFakeData(): void {
    // Fake data for my groups
    this.myGroups = [
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
        createdBy: 'marketing1',
        admins: ['marketing1', 'super'],
        members: ['marketing1', 'marketing2', 'super', 'content1'],
        channels: ['general', 'campaigns', 'social-media', 'analytics'],
        createdAt: new Date('2025-02-15'),
        updatedAt: new Date('2025-08-30'),
        isActive: true
      }
    ];

    // Fake data for available groups
    this.availableGroups = [
      {
        id: '3',
        name: 'Support Team',
        description: 'Customer support and technical assistance team. Help users with their questions and issues.',
        createdBy: 'support1',
        admins: ['support1'],
        members: ['support1', 'support2', 'support3'],
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
        members: ['qa1', 'qa2', 'qa3', 'qa4'],
        channels: ['general', 'testing', 'bugs', 'releases'],
        createdAt: new Date('2025-04-01'),
        updatedAt: new Date('2025-08-28'),
        isActive: true
      },
      {
        id: '5',
        name: 'Product Team',
        description: 'Product management and strategy team. Define product roadmap and features.',
        createdBy: 'product1',
        admins: ['product1'],
        members: ['product1', 'product2', 'product3'],
        channels: ['general', 'roadmap', 'features', 'feedback'],
        createdAt: new Date('2025-05-01'),
        updatedAt: new Date('2025-08-27'),
        isActive: true
      }
    ];
  }

  viewGroup(groupId: string): void {
    // Navigate to group details or dashboard with group context
    this.router.navigate(['/dashboard'], { queryParams: { group: groupId } });
  }

  viewChannels(groupId: string): void {
    this.router.navigate(['/channels'], { queryParams: { group: groupId } });
  }

  joinGroup(groupId: string): void {
    // Simulate joining group
    const group = this.availableGroups.find(g => g.id === groupId);
    if (group) {
      this.myGroups.push(group);
      this.availableGroups = this.availableGroups.filter(g => g.id !== groupId);
      alert(`Successfully joined ${group.name}!`);
    }
  }

  viewGroupDetails(groupId: string): void {
    const group = this.availableGroups.find(g => g.id === groupId);
    if (group) {
      alert(`Group: ${group.name}\nDescription: ${group.description}\nMembers: ${group.members.length}`);
    }
  }
}
