import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ClientLayoutComponent } from '../layouts/client-layout.component';
import { Channel, ChannelType } from '../../models/channel.model';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    ClientLayoutComponent
  ],
  template: `
    <app-client-layout 
      pageTitle="Channels" 
      pageDescription="Discover and join channels to connect with your team">
      
      <!-- Header Actions -->
      <div class="header-actions">
        <button mat-stroked-button routerLink="/groups" class="back-button" matTooltip="Back to Groups">
          <mat-icon>arrow_back</mat-icon>
          Back to Groups
        </button>
      </div>

      <!-- Search and Filter Section -->
      <div class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search channels</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterChannels()" placeholder="Type to search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <div class="filter-chips">
          <mat-chip-listbox [(ngModel)]="selectedType" (ngModelChange)="filterChannels()">
            <mat-chip-option value="">All Types</mat-chip-option>
            <mat-chip-option value="text">Text</mat-chip-option>
            <mat-chip-option value="voice">Voice</mat-chip-option>
            <mat-chip-option value="video">Video</mat-chip-option>
          </mat-chip-listbox>
        </div>
      </div>

      <!-- Channels Grid -->
      <div class="channels-grid">
        <mat-card *ngFor="let channel of filteredChannels" class="channel-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="channel-icon">
              {{ getChannelTypeIcon(channel.type) }}
            </mat-icon>
            <mat-card-title>{{ channel.name }}</mat-card-title>
            <mat-card-subtitle>
              {{ getGroupName(channel.groupId) }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p class="channel-description">{{ channel.description || 'No description' }}</p>
            
            <div class="channel-meta">
              <div class="meta-item">
                <mat-icon>group</mat-icon>
                <span>{{ channel.memberCount || channel.members.length || 0 }} members</span>
              </div>
              
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <span>{{ channel.createdAt | date:'shortDate' }}</span>
              </div>
            </div>
            
            <div class="channel-tags">
              <mat-chip [ngClass]="'type-' + channel.type">
                {{ channel.type | titlecase }}
              </mat-chip>
              <mat-chip *ngIf="channel.maxMembers" class="limit-chip">
                Max: {{ channel.maxMembers }}
              </mat-chip>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" 
                    [routerLink]="['/group', channel.groupId, 'channel', channel.id]"
                    matTooltip="Join this channel">
              <mat-icon>chat</mat-icon>
              Join Channel
            </button>
            
            <button mat-button color="accent" 
                    [routerLink]="['/group', channel.groupId]"
                    matTooltip="View group details">
              <mat-icon>group</mat-icon>
              View Group
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredChannels.length === 0" class="empty-state">
        <mat-icon class="empty-icon">forum</mat-icon>
        <h3>No channels found</h3>
        <p>Try adjusting your search or filters to find channels.</p>
      </div>

    </app-client-layout>
  `,
  styles: [`
    .header-actions {
      margin-bottom: 24px;
      display: flex;
      justify-content: flex-start;
    }

    .back-button {
      color: #667eea;
      border-color: #667eea;
    }

    .search-section {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      min-width: 300px;
    }

    .filter-chips {
      display: flex;
      gap: 8px;
    }

    .channels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .channel-card {
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background: white;
    }

    .channel-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .channel-icon {
      font-size: 32px;
      color: #667eea;
      width: 32px;
      height: 32px;
    }

    .channel-description {
      color: #666;
      line-height: 1.5;
      margin: 16px 0;
    }

    .channel-meta {
      display: flex;
      gap: 24px;
      margin-bottom: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .channel-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .type-text {
      background: #e3f2fd !important;
      color: #1976d2 !important;
    }

    .type-voice {
      background: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    .type-video {
      background: #fce4ec !important;
      color: #c2185b !important;
    }

    .limit-chip {
      background: #f5f5f5 !important;
      color: #666 !important;
    }

    .mat-card-actions {
      display: flex;
      gap: 12px;
      padding: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      color: #ddd;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .empty-state p {
      margin: 0;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .search-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: auto;
      }

      .channels-grid {
        grid-template-columns: 1fr;
      }

      .channel-meta {
        flex-direction: column;
        gap: 12px;
      }

      .mat-card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ChannelsComponent implements OnInit {
  searchTerm: string = '';
  selectedType: string = '';
  channels: Channel[] = [];
  groups: Group[] = [];

  ngOnInit() {
    this.loadMockData();
  }

  get filteredChannels(): Channel[] {
    return this.channels.filter(channel => {
      const matchesSearch = !this.searchTerm ||
        channel.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (channel.description && channel.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesType = !this.selectedType || channel.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

  getChannelTypeIcon(type: ChannelType): string {
    switch (type) {
      case ChannelType.TEXT: return 'chat';
      case ChannelType.VOICE: return 'mic';
      case ChannelType.VIDEO: return 'videocam';
      default: return 'forum';
    }
  }

  getGroupName(groupId: string): string {
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  }

  filterChannels() {
    // Trigger change detection by reassigning filteredChannels
    this.channels = [...this.channels];
  }

  private loadMockData() {
    this.groups = [
      {
        id: '1',
        name: 'Technology Team',
        description: 'Core technology development team',
        category: 'Technology',
        status: 'active' as any,
        createdBy: 'user1',
        admins: ['user1'],
        members: ['user1', 'user2', 'user3'],
        channels: ['1', '2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        memberCount: 3,
        maxMembers: 50
      },
      {
        id: '2',
        name: 'Marketing Department',
        description: 'Marketing and communications team',
        category: 'Marketing',
        status: 'active' as any,
        createdBy: 'user2',
        admins: ['user2'],
        members: ['user2', 'user4', 'user5'],
        channels: ['3', '4'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        memberCount: 3,
        maxMembers: 30
      }
    ];

    this.channels = [
      {
        id: '1',
        name: 'general',
        description: 'General discussion for the technology team',
        groupId: '1',
        type: ChannelType.TEXT,
        createdBy: 'user1',
        members: ['user1', 'user2', 'user3'],
        bannedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        memberCount: 3,
        maxMembers: 50
      },
      {
        id: '2',
        name: 'code-reviews',
        description: 'Code review discussions and feedback',
        groupId: '1',
        type: ChannelType.TEXT,
        createdBy: 'user1',
        members: ['user1', 'user2'],
        bannedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        memberCount: 2,
        maxMembers: 20
      },
      {
        id: '3',
        name: 'announcements',
        description: 'Important announcements and updates',
        groupId: '2',
        type: ChannelType.TEXT,
        createdBy: 'user2',
        members: ['user2', 'user4', 'user5'],
        bannedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        memberCount: 3,
        maxMembers: 30
      },
      {
        id: '4',
        name: 'campaign-planning',
        description: 'Marketing campaign planning and strategy',
        groupId: '2',
        type: ChannelType.VOICE,
        createdBy: 'user2',
        members: ['user2', 'user4'],
        bannedUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        memberCount: 2,
        maxMembers: 15
      }
    ];
  }
}