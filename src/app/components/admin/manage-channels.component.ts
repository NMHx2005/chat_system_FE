import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { AdminLayoutComponent } from '../layouts/admin-layout.component';
import { User, UserRole } from '../../models/user.model';
import { Group } from '../../models/group.model';
import { Channel, ChannelType } from '../../models/channel.model';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-create-channel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Channel</h2>
    <mat-dialog-content>
      <form [formGroup]="channelForm" (ngSubmit)="createChannel()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Channel Name</mat-label>
          <input matInput formControlName="name" required minlength="3" maxlength="30">
          <mat-error *ngIf="channelForm.get('name')?.hasError('required')">
            Channel name is required
          </mat-error>
          <mat-error *ngIf="channelForm.get('name')?.hasError('minlength')">
            Channel name must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Group</mat-label>
          <mat-select formControlName="groupId" required>
            <mat-option value="">Select Group</mat-option>
            <mat-option *ngFor="let group of data.groups" [value]="group.id">
              {{ group.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="channelForm.get('groupId')?.hasError('required')">
            Group is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Channel Type</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="">Select Type</mat-option>
            <mat-option value="text">Text Channel</mat-option>
            <mat-option value="voice">Voice Channel</mat-option>
            <mat-option value="video">Video Channel</mat-option>
          </mat-select>
          <mat-error *ngIf="channelForm.get('type')?.hasError('required')">
            Channel type is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" maxlength="200"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Max Members</mat-label>
          <input matInput type="number" formControlName="maxMembers" min="1" max="1000">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="createChannel()" [disabled]="!channelForm.valid">
        Create Channel
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class CreateChannelDialogComponent {
  channelForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateChannelDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { groups: Group[], onCreate: (channel: Partial<Channel>) => void }
  ) {
    this.channelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      groupId: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.maxLength(200)],
      maxMembers: [100, [Validators.min(1), Validators.max(1000)]]
    });
  }

  createChannel() {
    if (this.channelForm.valid) {
      this.data.onCreate(this.channelForm.value);
      this.dialogRef.close();
    }
  }
  // Removed duplicate/erroneous constructor definition. No code needed here.


}

@Component({
  selector: 'app-manage-channels',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    AdminLayoutComponent
  ],
  template: `
    <app-admin-layout [pageTitle]="'Manage Channels'">
    <div class="manage-channels-container">
      <!-- Header Section -->
      <mat-card class="header-card">
        <div class="header">
          <div class="header-content">
            <h1>Manage Channels</h1>
            <p>Create, edit, and manage chat channels within groups</p>
          </div>
          <div class="header-actions">
            <button mat-stroked-button routerLink="/admin" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Back to Dashboard
            </button>
            <button mat-raised-button color="primary" (click)="openCreateChannelDialog()">
              <mat-icon>add</mat-icon>
              Create New Channel
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Controls -->
      <mat-card class="controls-card">
        <div class="controls">
          <mat-form-field appearance="outline">
            <mat-label>Search channels</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterChannels()" placeholder="Search channels...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Group</mat-label>
            <mat-select [(ngModel)]="groupFilter" (ngModelChange)="filterChannels()">
              <mat-option value="">All Groups</mat-option>
              <mat-option *ngFor="let group of groups" [value]="group.id">
                {{ group.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select [(ngModel)]="typeFilter" (ngModelChange)="filterChannels()">
              <mat-option value="">All Types</mat-option>
              <mat-option value="text">Text</mat-option>
              <mat-option value="voice">Voice</mat-option>
              <mat-option value="video">Video</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Channels Table -->
      <mat-card class="channels-table-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>forum</mat-icon>
            All Channels
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="filteredChannels" class="mat-elevation-z2">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Channel Name </th>
              <td mat-cell *matCellDef="let channel">
                <div class="channel-info">
                  <strong>{{ channel.name }}</strong>
                  <small>ID: {{ channel.id }}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="group">
              <th mat-header-cell *matHeaderCellDef> Group </th>
              <td mat-cell *matCellDef="let channel"> {{ getGroupName(channel.groupId) }} </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef> Type </th>
              <td mat-cell *matCellDef="let channel">
                <mat-chip [ngClass]="'type-' + channel.type">
                  {{ getTypeDisplayName(channel.type) }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef> Description </th>
              <td mat-cell *matCellDef="let channel"> {{ channel.description || 'No description' }} </td>
            </ng-container>

            <ng-container matColumnDef="members">
              <th mat-header-cell *matHeaderCellDef> Members </th>
              <td mat-cell *matCellDef="let channel"> {{ channel.memberCount || 0 }} members </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let channel">
                <mat-chip [ngClass]="channel.isActive ? 'status-active' : 'status-inactive'">
                  {{ channel.isActive ? 'Active' : 'Inactive' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let channel">
                <button mat-icon-button color="primary" [matTooltip]="'View Channel'" (click)="viewChannel(channel)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="primary" [matTooltip]="'Edit Channel'" *ngIf="canEditChannel(channel)" (click)="editChannel(channel)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" [matTooltip]="'Delete Channel'" *ngIf="canDeleteChannel(channel)" (click)="deleteChannel(channel)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button color="accent" [matTooltip]="channel.isActive ? 'Deactivate Channel' : 'Activate Channel'"
                  *ngIf="canToggleChannelStatus(channel)" (click)="toggleChannelStatus(channel)">
                  <mat-icon>{{ channel.isActive ? 'pause' : 'play_arrow' }}</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <!-- Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon-container">
              <mat-icon class="stat-icon">forum</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ channels.length }}</h3>
              <p>Total Channels</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon-container">
              <mat-icon class="stat-icon">check_circle</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ getActiveChannelsCount() }}</h3>
              <p>Active Channels</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon-container">
              <mat-icon class="stat-icon">chat</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ getTextChannelsCount() }}</h3>
              <p>Text Channels</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon-container">
              <mat-icon class="stat-icon">videocam</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ getVoiceVideoChannelsCount() }}</h3>
              <p>Voice/Video Channels</p>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
    </app-admin-layout>
  `,
  styles: [`
    .manage-channels-container {
      padding: 24px;
      margin: 0 auto;
    }

    .header-card {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }

    .header-content h1 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .header-content p {
      margin: 0;
      opacity: 0.9;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .back-button {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .controls-card {
      margin-bottom: 24px;
    }

    .controls {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      padding: 16px;
    }

    mat-form-field {
      min-width: 200px;
    }

    .channels-table-card {
      margin-bottom: 24px;
    }

    .mat-card-header {
      padding-bottom: 16px;
    }

    .mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th.mat-header-cell {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      padding: 12px;
    }

    td.mat-cell {
      padding: 12px;
      color: #666;
    }

    tr.mat-row:hover {
      background-color: #f5f5f5;
    }

    .channel-info {
      display: flex;
      flex-direction: column;
    }

    .channel-info small {
      color: #7f8c8d;
      font-size: 11px;
      margin-top: 2px;
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

    .status-active {
      background: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    .status-inactive {
      background: #ffebee !important;
      color: #c62828 !important;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .stat-icon-container {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon {
      font-size: 32px;
      color: white;
      width: 32px;
      height: 32px;
    }

    .stat-details h3 {
      margin: 0 0 4px 0;
      font-size: 2rem;
      font-weight: 600;
      color: #333;
    }

    .stat-details p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .manage-channels-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .controls {
        flex-direction: column;
        align-items: stretch;
      }

      table {
        display: block;
        overflow-x: auto;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ManageChannelsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'group', 'type', 'description', 'members', 'status', 'actions'];
  channels: Channel[] = [];
  filteredChannels: Channel[] = [];
  groups: Group[] = [];
  searchTerm: string = '';
  groupFilter: string = '';
  typeFilter: string = '';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadGroups();
    this.loadChannels();
    this.filterChannels();
  }

  loadGroups() {
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      this.groups = JSON.parse(storedGroups);
    }
  }

  loadChannels() {
    const storedChannels = localStorage.getItem('channels');
    if (storedChannels) {
      this.channels = JSON.parse(storedChannels);
    } else {
      this.channels = [
        {
          id: '1',
          name: 'general',
          description: 'General discussion channel',
          groupId: '1',
          type: ChannelType.TEXT,
          isActive: true,
          createdBy: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [],
          bannedUsers: [],
          memberCount: 15,
          maxMembers: 100
        },
        {
          id: '2',
          name: 'tech-talk',
          description: 'Technology discussions and news',
          groupId: '1',
          type: ChannelType.TEXT,
          isActive: true,
          createdBy: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [],
          bannedUsers: [],
          memberCount: 12,
          maxMembers: 100
        },
        {
          id: '3',
          name: 'voice-chat',
          description: 'Voice conversations',
          groupId: '1',
          type: ChannelType.VOICE,
          isActive: true,
          createdBy: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [],
          bannedUsers: [],
          memberCount: 8,
          maxMembers: 20
        },
        {
          id: '4',
          name: 'business-general',
          description: 'General business discussions',
          groupId: '2',
          type: ChannelType.TEXT,
          isActive: true,
          createdBy: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [],
          bannedUsers: [],
          memberCount: 8,
          maxMembers: 50
        }
      ];
      localStorage.setItem('channels', JSON.stringify(this.channels));
    }
  }

  filterChannels() {
    this.filteredChannels = this.channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (channel.description && channel.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesGroup = !this.groupFilter || channel.groupId === this.groupFilter;
      const matchesType = !this.typeFilter || channel.type === this.typeFilter;
      return matchesSearch && matchesGroup && matchesType;
    });
  }

  getTypeDisplayName(type: ChannelType): string {
    switch (type) {
      case ChannelType.TEXT: return 'Text';
      case ChannelType.VOICE: return 'Voice';
      case ChannelType.VIDEO: return 'Video';
      default: return 'Unknown';
    }
  }

  getGroupName(groupId: string): string {
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  }

  canEditChannel(channel: Channel): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.roles.includes(UserRole.SUPER_ADMIN)) return true;
    if (this.currentUser.roles.includes(UserRole.GROUP_ADMIN)) {
      const group = this.groups.find(g => g.id === channel.groupId);
      return !!group && group.createdBy === this.currentUser.id;
    }
    return false;
  }

  canDeleteChannel(channel: Channel): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.roles.includes(UserRole.SUPER_ADMIN)) return true;
    if (this.currentUser.roles.includes(UserRole.GROUP_ADMIN)) {
      const group = this.groups.find(g => g.id === channel.groupId);
      return !!group && group.createdBy === this.currentUser.id;
    }
    return false;
  }

  canToggleChannelStatus(channel: Channel): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.roles.includes(UserRole.SUPER_ADMIN)) return true;
    if (this.currentUser.roles.includes(UserRole.GROUP_ADMIN)) {
      const group = this.groups.find(g => g.id === channel.groupId);
      return !!group && group.createdBy === this.currentUser.id;
    }
    return false;
  }

  viewChannel(channel: Channel) {
    this.router.navigate(['/group', channel.groupId, 'channel', channel.id]);
  }

  editChannel(channel: Channel) {
    this.router.navigate(['/admin/channels', channel.id, 'edit']);
  }

  deleteChannel(channel: Channel) {
    if (confirm(`Are you sure you want to delete channel "#${channel.name}"?`)) {
      this.channels = this.channels.filter(c => c.id !== channel.id);
      this.updateChannels();
      this.filterChannels();
    }
  }

  toggleChannelStatus(channel: Channel) {
    channel.isActive = !channel.isActive;
    this.updateChannels();
    this.filterChannels();
  }

  openCreateChannelDialog() {
    const dialogRef = this.dialog.open(CreateChannelDialogComponent, {
      width: '500px',
      data: {
        groups: this.groups,
        onCreate: (channelData: Partial<Channel>) => {
          const channel: Channel = {
            id: Date.now().toString(),
            name: channelData.name!,
            description: channelData.description || '',
            groupId: channelData.groupId!,
            type: channelData.type! as ChannelType,
            isActive: true,
            createdBy: this.currentUser!.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            members: [],
            bannedUsers: [],
            memberCount: 1,
            maxMembers: channelData.maxMembers || 100
          };
          this.channels.push(channel);
          this.updateChannels();
          this.filterChannels();
        }
      }
    });
  }

  updateChannels() {
    localStorage.setItem('channels', JSON.stringify(this.channels));
  }

  getActiveChannelsCount(): number {
    return this.channels.filter(channel => channel.isActive).length;
  }

  getTextChannelsCount(): number {
    return this.channels.filter(channel => channel.type === ChannelType.TEXT).length;
  }

  getVoiceVideoChannelsCount(): number {
    return this.channels.filter(channel =>
      channel.type === ChannelType.VOICE || channel.type === ChannelType.VIDEO
    ).length;
  }
}