import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Channel } from '../../models';
import { ClientLayoutComponent } from '../layout/client-layout.component';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientLayoutComponent],
  template: `
    <app-client-layout 
      pageTitle="Channels Management" 
      pageDescription="Browse and join channels in your groups">
      
      <div page-actions>
        <button class="btn-success" routerLink="/chat">Start Chatting</button>
        <button class="btn-info" routerLink="/admin/create-group">Create Group</button>
      </div>

      <!-- Group Filter -->
      <div class="filter-section">
        <label for="groupFilter">Filter by Group:</label>
        <select 
          id="groupFilter" 
          [(ngModel)]="selectedGroupId" 
          (change)="onGroupChange()"
          class="group-select">
          <option value="">All Groups</option>
          <option *ngFor="let group of availableGroups" [value]="group.id">
            {{ group.name }}
          </option>
        </select>
      </div>

      <!-- My Channels Section -->
      <div class="section">
        <h2>My Channels</h2>
        <div class="channels-grid">
          <div *ngFor="let channel of myChannels" class="channel-card">
            <div class="channel-header">
              <h3># {{ channel.name }}</h3>
              <span class="member-count">{{ channel.members.length }} members</span>
            </div>
            <p class="channel-description">{{ channel.description }}</p>
            <div class="channel-info">
              <span class="group-name">Group: {{ getGroupName(channel.groupId) }}</span>
              <span class="created-by">Created by: {{ channel.createdBy }}</span>
            </div>
            <div class="channel-actions">
              <button class="btn-primary" (click)="joinChannel(channel.id)">Join Chat</button>
              <button class="btn-secondary" (click)="viewChannelInfo(channel.id)">Info</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Channels Section -->
      <div class="section">
        <h2>Available Channels</h2>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search channels..." 
            [(ngModel)]="searchTerm"
            class="search-input">
        </div>
        <div class="channels-grid">
          <div *ngFor="let channel of availableChannels" class="channel-card available">
            <div class="channel-header">
              <h3># {{ channel.name }}</h3>
              <span class="member-count">{{ channel.members.length }} members</span>
            </div>
            <p class="channel-description">{{ channel.description }}</p>
            <div class="channel-info">
              <span class="group-name">Group: {{ getGroupName(channel.groupId) }}</span>
              <span class="created-by">Created by: {{ channel.createdBy }}</span>
            </div>
            <div class="channel-actions">
              <button class="btn-success" (click)="joinChannel(channel.id)">Join Channel</button>
              <button class="btn-info" (click)="viewChannelDetails(channel.id)">Details</button>
            </div>
          </div>
        </div>
      </div>
    </app-client-layout>
  `,
  styles: [`
    .filter-section {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .filter-section label {
      font-weight: 500;
      color: #2c3e50;
      min-width: 120px;
    }

    .group-select {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 200px;
      transition: all 0.3s ease;
    }

    .group-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

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

    .channels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
    }

    .channel-card {
      background: white;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .channel-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      border-color: #667eea;
    }

    .channel-card.available {
      border-color: #27ae60;
    }

    .channel-card.available:hover {
      border-color: #27ae60;
    }

    .channel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .channel-header h3 {
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

    .channel-description {
      color: #7f8c8d;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .channel-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    .group-name {
      color: #667eea;
      font-weight: 500;
    }

    .created-by {
      color: #95a5a6;
    }

    .channel-actions {
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
      .channels-grid {
        grid-template-columns: 1fr;
      }
      
      .filter-section {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class ChannelsComponent implements OnInit {
  searchTerm = '';
  selectedGroupId = '';
  myChannels: Channel[] = [];
  availableChannels: Channel[] = [];
  availableGroups: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadFakeData();

    // Check for group filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['group']) {
        this.selectedGroupId = params['group'];
        this.filterChannelsByGroup();
      }
    });
  }

  loadFakeData(): void {
    // Fake data for groups
    this.availableGroups = [
      { id: '1', name: 'Development Team' },
      { id: '2', name: 'Marketing Team' },
      { id: '3', name: 'Support Team' },
      { id: '4', name: 'QA Team' },
      { id: '5', name: 'Product Team' }
    ];

    // Fake data for my channels
    this.myChannels = [
      {
        id: '1',
        name: 'general',
        description: 'General discussion channel for all team members',
        groupId: '1',
        createdBy: 'super',
        members: ['super', 'dev1', 'dev2', 'dev3', 'designer1'],
        bannedUsers: [],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-31'),
        isActive: true
      },
      {
        id: '2',
        name: 'frontend',
        description: 'Frontend development discussions and code reviews',
        groupId: '1',
        createdBy: 'dev1',
        members: ['super', 'dev1', 'dev2', 'designer1'],
        bannedUsers: [],
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-08-30'),
        isActive: true
      },
      {
        id: '3',
        name: 'campaigns',
        description: 'Marketing campaign planning and execution',
        groupId: '2',
        createdBy: 'marketing1',
        members: ['marketing1', 'marketing2', 'super', 'content1'],
        bannedUsers: [],
        createdAt: new Date('2025-02-20'),
        updatedAt: new Date('2025-08-29'),
        isActive: true
      }
    ];

    // Fake data for available channels
    this.availableChannels = [
      {
        id: '4',
        name: 'backend',
        description: 'Backend development and API discussions',
        groupId: '1',
        createdBy: 'dev2',
        members: ['dev2', 'dev3'],
        bannedUsers: [],
        createdAt: new Date('2025-01-20'),
        updatedAt: new Date('2025-08-28'),
        isActive: true
      },
      {
        id: '5',
        name: 'testing',
        description: 'QA testing procedures and bug reports',
        groupId: '4',
        createdBy: 'qa1',
        members: ['qa1', 'qa2', 'qa3'],
        bannedUsers: [],
        createdAt: new Date('2025-04-15'),
        updatedAt: new Date('2025-08-27'),
        isActive: true
      },
      {
        id: '6',
        name: 'roadmap',
        description: 'Product roadmap and feature planning',
        groupId: '5',
        createdBy: 'product1',
        members: ['product1', 'product2'],
        bannedUsers: [],
        createdAt: new Date('2025-05-15'),
        updatedAt: new Date('2025-08-26'),
        isActive: true
      }
    ];
  }

  onGroupChange(): void {
    this.filterChannelsByGroup();
  }

  filterChannelsByGroup(): void {
    if (!this.selectedGroupId) {
      // Show all channels
      return;
    }

    // Filter channels by selected group
    this.myChannels = this.myChannels.filter(channel =>
      channel.groupId === this.selectedGroupId
    );
    this.availableChannels = this.availableChannels.filter(channel =>
      channel.groupId === this.selectedGroupId
    );
  }

  getGroupName(groupId: string): string {
    const group = this.availableGroups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  }

  joinChannel(channelId: string): void {
    // Navigate to chat with channel context
    this.router.navigate(['/chat'], { queryParams: { channel: channelId } });
  }

  viewChannelInfo(channelId: string): void {
    const channel = this.myChannels.find(c => c.id === channelId);
    if (channel) {
      alert(`Channel: #${channel.name}\nDescription: ${channel.description}\nMembers: ${channel.members.length}`);
    }
  }

  viewChannelDetails(channelId: string): void {
    const channel = this.availableChannels.find(c => c.id === channelId);
    if (channel) {
      alert(`Channel: #${channel.name}\nDescription: ${channel.description}\nGroup: ${this.getGroupName(channel.groupId)}\nMembers: ${channel.members.length}`);
    }
  }
}
