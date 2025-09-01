import { Component, Inject, OnInit } from '@angular/core';
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
import { Group, GroupStatus } from '../../models/group.model';

@Component({
  selector: 'app-create-group-dialog',
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
    <h2 mat-dialog-title>Create New Group</h2>
    <mat-dialog-content>
      <form [formGroup]="groupForm" (ngSubmit)="createGroup()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Group Name</mat-label>
          <input matInput formControlName="name" required minlength="3" maxlength="50">
          <mat-error *ngIf="groupForm.get('name')?.hasError('required')">
            Group name is required
          </mat-error>
          <mat-error *ngIf="groupForm.get('name')?.hasError('minlength')">
            Group name must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" maxlength="200"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category" required>
            <mat-option value="">Select Category</mat-option>
            <mat-option value="technology">Technology</mat-option>
            <mat-option value="business">Business</mat-option>
            <mat-option value="education">Education</mat-option>
            <mat-option value="entertainment">Entertainment</mat-option>
            <mat-option value="other">Other</mat-option>
          </mat-select>
          <mat-error *ngIf="groupForm.get('category')?.hasError('required')">
            Category is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Max Members</mat-label>
          <input matInput type="number" formControlName="maxMembers" min="1" max="1000">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="createGroup()" [disabled]="!groupForm.valid">
        Create Group
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
export class CreateGroupDialogComponent {
  groupForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { onCreate: (group: Partial<Group>) => void }
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
      category: ['', Validators.required],
      maxMembers: [100, [Validators.min(1), Validators.max(1000)]]
    });
  }

  createGroup() {
    if (this.groupForm.valid) {
      this.data.onCreate(this.groupForm.value);
      this.dialogRef.close();
    }
  }
}

@Component({
  selector: 'app-manage-groups',
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
    <app-admin-layout [pageTitle]="'Manage Groups'">
    <div class="manage-groups-container">
      <!-- Header Section -->
      <mat-card class="header-card">
        <div class="header">
          <div class="header-content">
            <h1>Manage Groups</h1>
            <p>Create, edit, and manage chat groups</p>
          </div>
          <div class="header-actions">
            <button mat-stroked-button routerLink="/admin" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Back to Dashboard
            </button>
            <button mat-raised-button color="primary" (click)="openCreateGroupDialog()">
              <mat-icon>add</mat-icon>
              Create New Group
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Controls -->
      <mat-card class="controls-card">
        <div class="controls">
          <mat-form-field appearance="outline">
            <mat-label>Search groups</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterGroups()" placeholder="Search groups...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="statusFilter" (ngModelChange)="filterGroups()">
              <mat-option value="">All Status</mat-option>
              <mat-option value="active">Active</mat-option>
              <mat-option value="inactive">Inactive</mat-option>
              <mat-option value="pending">Pending</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="categoryFilter" (ngModelChange)="filterGroups()">
              <mat-option value="">All Categories</mat-option>
              <mat-option value="technology">Technology</mat-option>
              <mat-option value="business">Business</mat-option>
              <mat-option value="education">Education</mat-option>
              <mat-option value="entertainment">Entertainment</mat-option>
              <mat-option value="other">Other</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Groups Table -->
      <mat-card class="groups-table-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>group_work</mat-icon>
            All Groups
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="filteredGroups" class="mat-elevation-z2">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Group Name </th>
              <td mat-cell *matCellDef="let group">
                <div class="group-info">
                  <strong>{{ group.name }}</strong>
                  <small>ID: {{ group.id }}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef> Description </th>
              <td mat-cell *matCellDef="let group"> {{ group.description }} </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef> Category </th>
              <td mat-cell *matCellDef="let group">
                <mat-chip [ngClass]="'category-' + group.category">
                  {{ group.category | titlecase }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let group">
                <mat-chip [ngClass]="'status-' + group.status">
                  {{ getStatusDisplayName(group.status) }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="members">
              <th mat-header-cell *matHeaderCellDef> Members </th>
              <td mat-cell *matCellDef="let group"> {{ group.memberCount || 0 }} members </td>
            </ng-container>

            <ng-container matColumnDef="createdBy">
              <th mat-header-cell *matHeaderCellDef> Created By </th>
              <td mat-cell *matCellDef="let group"> {{ getCreatorName(group.createdBy) }} </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let group">
                <button mat-icon-button color="primary" [matTooltip]="'View Group'" (click)="viewGroup(group)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="primary" [matTooltip]="'Edit Group'" *ngIf="canEditGroup(group)" (click)="editGroup(group)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" [matTooltip]="'Delete Group'" *ngIf="canDeleteGroup(group)" (click)="deleteGroup(group)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button color="accent" [matTooltip]="group.status === 'active' ? 'Deactivate Group' : 'Activate Group'"
                  *ngIf="canToggleGroupStatus(group)" (click)="toggleGroupStatus(group)">
                  <mat-icon>{{ group.status === 'active' ? 'pause' : 'play_arrow' }}</mat-icon>
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
              <mat-icon class="stat-icon">group_work</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ groups.length }}</h3>
              <p>Total Groups</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon-container">
              <mat-icon class="stat-icon">check_circle</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ getActiveGroupsCount() }}</h3>
              <p>Active Groups</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon-container">
              <mat-icon class="stat-icon">people</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ getTotalMembersCount() }}</h3>
              <p>Total Members</p>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon-container">
              <mat-icon class="stat-icon">pending</mat-icon>
            </div>
            <div class="stat-details">
              <h3>{{ getPendingRequestsCount() }}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
    </app-admin-layout>
  `,
  styles: [`
    .manage-groups-container {
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

    .groups-table-card {
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

    .group-info {
      display: flex;
      flex-direction: column;
    }

    .group-info small {
      color: #7f8c8d;
      font-size: 11px;
      margin-top: 2px;
    }

    .category-technology {
      background: #e3f2fd !important;
      color: #1976d2 !important;
    }

    .category-business {
      background: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    .category-education {
      background: #fff3e0 !important;
      color: #f57c00 !important;
    }

    .category-entertainment {
      background: #fce4ec !important;
      color: #c2185b !important;
    }

    .category-other {
      background: #f3e5f5 !important;
      color: #7b1fa2 !important;
    }

    .status-active {
      background: #e8f5e8 !important;
      color: #2e7d32 !important;
    }

    .status-inactive {
      background: #ffebee !important;
      color: #c62828 !important;
    }

    .status-pending {
      background: #fff3e0 !important;
      color: #f57c00 !important;
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
      .manage-groups-container {
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
export class ManageGroupsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'category', 'status', 'members', 'createdBy', 'actions'];
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  categoryFilter: string = '';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadGroups();
    this.filterGroups();
  }

  loadGroups() {
    // Load mock groups from localStorage or create default ones
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      this.groups = JSON.parse(storedGroups);
    } else {
      this.groups = [
        {
          id: '1',
          name: 'Tech Enthusiasts',
          description: 'A group for technology lovers and developers',
          category: 'technology',
          status: GroupStatus.ACTIVE,
          createdBy: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          admins: [],
          members: [],
          channels: [],
          isActive: true,
          memberCount: 15,
          maxMembers: 100
        },
        {
          id: '2',
          name: 'Business Network',
          description: 'Professional networking and business discussions',
          category: 'business',
          status: GroupStatus.ACTIVE,
          createdBy: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          admins: [],
          members: [],
          channels: [],
          isActive: true,
          memberCount: 8,
          maxMembers: 50
        },
        {
          id: '3',
          name: 'Learning Hub',
          description: 'Educational content and study groups',
          category: 'education',
          status: GroupStatus.PENDING,
          createdBy: '3',
          createdAt: new Date(),
          updatedAt: new Date(),
          admins: [],
          members: [],
          channels: [],
          isActive: true,
          memberCount: 5,
          maxMembers: 30
        }
      ];
      localStorage.setItem('groups', JSON.stringify(this.groups));
    }
  }

  filterGroups() {
    this.filteredGroups = this.groups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || group.status === this.statusFilter;
      const matchesCategory = !this.categoryFilter || group.category === this.categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  getStatusDisplayName(status: GroupStatus): string {
    switch (status) {
      case GroupStatus.ACTIVE: return 'Active';
      case GroupStatus.INACTIVE: return 'Inactive';
      case GroupStatus.PENDING: return 'Pending';
      default: return 'Unknown';
    }
  }

  getCreatorName(creatorId: string): string {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const creator = users.find((u: User) => u.id === creatorId);
    return creator ? creator.username : 'Unknown';
  }

  canEditGroup(group: Group): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === UserRole.SUPER_ADMIN) return true;
    if (this.currentUser.role === UserRole.GROUP_ADMIN) {
      return group.createdBy === this.currentUser.id;
    }
    return false;
  }

  canDeleteGroup(group: Group): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === UserRole.SUPER_ADMIN) return true;
    if (this.currentUser.role === UserRole.GROUP_ADMIN) {
      return group.createdBy === this.currentUser.id;
    }
    return false;
  }

  canToggleGroupStatus(group: Group): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === UserRole.SUPER_ADMIN) return true;
    if (this.currentUser.role === UserRole.GROUP_ADMIN) {
      return group.createdBy === this.currentUser.id;
    }
    return false;
  }

  viewGroup(group: Group) {
    this.router.navigate(['/admin/groups', group.id]);
  }

  editGroup(group: Group) {
    this.router.navigate(['/admin/groups', group.id, 'edit']);
  }

  deleteGroup(group: Group) {
    if (confirm(`Are you sure you want to delete group "${group.name}"?`)) {
      this.groups = this.groups.filter(g => g.id !== group.id);
      this.updateGroups();
      this.filterGroups();
    }
  }

  toggleGroupStatus(group: Group) {
    group.status = group.status === GroupStatus.ACTIVE ? GroupStatus.INACTIVE : GroupStatus.ACTIVE;
    this.updateGroups();
    this.filterGroups();
  }

  openCreateGroupDialog() {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      width: '500px',
      data: {
        onCreate: (groupData: Partial<Group>) => {
          const group: Group = {
            id: Date.now().toString(),
            name: groupData.name!,
            description: groupData.description || '',
            category: groupData.category!,
            status: GroupStatus.ACTIVE,
            createdBy: this.currentUser!.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            admins: [],
            members: [],
            channels: [],
            isActive: true,
            memberCount: 1,
            maxMembers: groupData.maxMembers || 100
          };
          this.groups.push(group);
          this.updateGroups();
          this.filterGroups();
        }
      }
    });
  }

  updateGroups() {
    localStorage.setItem('groups', JSON.stringify(this.groups));
  }

  getActiveGroupsCount(): number {
    return this.groups.filter(group => group.status === GroupStatus.ACTIVE).length;
  }

  getTotalMembersCount(): number {
    return this.groups.reduce((total, group) => total + (group.memberCount || 0), 0);
  }

  getPendingRequestsCount(): number {
    return Math.floor(Math.random() * 10);
  }
}