import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from '../../services/auth.service';
import { AdminLayoutComponent } from '../layouts/admin-layout.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    AdminLayoutComponent
  ],
  template: `
    <app-admin-layout [pageTitle]="'Manage Users'">
    <div class="manage-users-container">
      <!-- Header Section -->
      <mat-card class="page-header-card">
        <div class="page-header">
          <div class="header-content">
            <h1>Manage Users</h1>
            <p>View, edit, and manage user accounts</p>
          </div>
          <div class="header-actions">
            <button mat-stroked-button routerLink="/admin">
              <mat-icon>arrow_back</mat-icon>
              Back to Admin
            </button>
            <button mat-raised-button color="primary" (click)="showCreateUser = true">
              <mat-icon>person_add</mat-icon>
              Add User
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Search and Filter Section -->
      <mat-card class="search-section-card">
        <mat-card-content>
          <div class="search-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search users</mat-label>
              <input matInput
                     [(ngModel)]="searchTerm"
                     placeholder="Search by username, email, or role..."
                     (input)="filterUsers()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <div class="filter-options">
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Role</mat-label>
                <mat-select [(ngModel)]="selectedRole" (selectionChange)="filterUsers()">
                  <mat-option value="">All Roles</mat-option>
                  <mat-option value="SUPER_ADMIN">Super Admin</mat-option>
                  <mat-option value="GROUP_ADMIN">Group Admin</mat-option>
                  <mat-option value="USER">User</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="filterUsers()">
                  <mat-option value="">All Status</mat-option>
                  <mat-option value="active">Active</mat-option>
                  <mat-option value="inactive">Inactive</mat-option>
                  <mat-option value="suspended">Suspended</mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-stroked-button (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Clear Filters
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Users Table -->
      <mat-card class="users-table-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>people</mat-icon>
            Users ({{ filteredUsers.length }})
          </mat-card-title>
          <div class="bulk-actions" *ngIf="selectedUsers.length > 0">
            <mat-chip color="accent">
              <mat-icon>check_circle</mat-icon>
              {{ selectedUsers.length }} selected
            </mat-chip>
            <button mat-raised-button color="warn" (click)="bulkDelete()">
              <mat-icon>delete</mat-icon>
              Delete Selected
            </button>
            <button mat-raised-button color="primary" (click)="bulkActivate()">
              <mat-icon>check_circle</mat-icon>
              Activate Selected
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="paginatedUsers" class="users-table">
              <!-- Checkbox Column -->
              <ng-container matColumnDef="select">
                <th mat-header-cell *matHeaderCellDef>
                  <mat-checkbox 
                    [checked]="isAllSelected()" 
                    (change)="toggleSelectAll()">
                  </mat-checkbox>
                </th>
                <td mat-cell *matCellDef="let user">
                  <mat-checkbox 
                    [checked]="isUserSelected(user.id)" 
                    (change)="toggleUserSelection(user.id)">
                  </mat-checkbox>
                </td>
              </ng-container>

              <!-- User Column -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <div class="user-avatar">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div class="user-details">
                      <span class="username">{{ user.username }}</span>
                      <span class="email">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="getRoleColor(user.roles[0])" class="role-chip">
                    <mat-icon>{{ getRoleIcon(user.roles[0]) }}</mat-icon>
                    {{ getRoleDisplayName(user.roles[0]) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Groups Column -->
              <ng-container matColumnDef="groups">
                <th mat-header-cell *matHeaderCellDef>Groups</th>
                <td mat-cell *matCellDef="let user">
                  <div class="groups-list">
                    <mat-chip *ngFor="let groupId of user.groups.slice(0, 2)" class="group-chip">
                      {{ getGroupName(groupId) }}
                    </mat-chip>
                    <mat-chip *ngIf="user.groups.length > 2" class="more-chip">
                      +{{ user.groups.length - 2 }} more
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="getStatusColor(user.isActive)" class="status-chip">
                    <mat-icon>{{ getStatusIcon(user.isActive) }}</mat-icon>
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Created Column -->
              <ng-container matColumnDef="created">
                <th mat-header-cell *matHeaderCellDef>Created</th>
                <td mat-cell *matCellDef="let user">
                  {{ user.createdAt | date:'shortDate' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [matMenuTriggerFor]="userMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #userMenu="matMenu">
                    <button mat-menu-item (click)="editUser(user)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="toggleUserStatus(user)">
                      <mat-icon>{{ user.isActive ? 'block' : 'check_circle' }}</mat-icon>
                      <span>{{ user.isActive ? 'Deactivate' : 'Activate' }}</span>
                    </button>
                    <button mat-menu-item (click)="deleteUser(user)" class="delete-action">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredUsers.length === 0" class="empty-state">
            <mat-icon class="empty-icon">people</mat-icon>
            <h3>No Users Found</h3>
            <p>Try adjusting your search criteria or create a new user.</p>
          </div>

          <!-- Pagination -->
          <mat-paginator 
            *ngIf="totalPages > 1"
            [length]="filteredUsers.length"
            [pageSize]="itemsPerPage"
            [pageIndex]="currentPage - 1"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
    </app-admin-layout>
  `,
  styles: [`
    .manage-users-container {
      margin: 0 auto;
      padding: 24px;
    }

    .page-header-card {
      margin-bottom: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .page-header {
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
      gap: 16px;
    }

    .search-section-card {
      margin-bottom: 24px;
    }

    .search-section {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      min-width: 300px;
      flex: 1;
    }

    .filter-options {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filter-field {
      min-width: 150px;
    }

    .users-table-card {
      margin-bottom: 24px;
    }

    .mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.5rem;
    }

    .bulk-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .username {
      font-weight: 600;
      color: #333;
    }

    .email {
      font-size: 0.85rem;
      color: #666;
    }

    .role-chip, .status-chip, .group-chip {
      font-size: 0.8rem;
    }

    .more-chip {
      background-color: #f5f5f5;
      color: #666;
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

    .delete-action {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .manage-users-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .search-section {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: auto;
      }

      .filter-options {
        flex-direction: column;
      }

      .mat-card-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .bulk-actions {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'user', 'role', 'groups', 'status', 'created', 'actions'];

  allUsers: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  selectedUsers: string[] = [];
  showCreateUser = false;
  showEditUser = false;
  showUserDetails = false;
  editingUser: any = {};
  selectedUser: any = null;
  newUser = {
    username: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  get isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  loadUsers(): void {
    // Mock data for Phase 1
    this.allUsers = [
      {
        id: '1',
        username: 'super',
        email: 'super@example.com',
        roles: ['SUPER_ADMIN'],
        groups: ['Development Team', 'Design Team'],
        isActive: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        username: 'admin',
        email: 'admin@example.com',
        roles: ['GROUP_ADMIN'],
        groups: ['Development Team', 'Marketing Team'],
        isActive: true,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date()
      },
      {
        id: '3',
        username: 'user',
        email: 'user@example.com',
        roles: ['USER'],
        groups: ['Development Team'],
        isActive: true,
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date()
      },
      {
        id: '4',
        username: 'john_doe',
        email: 'john@example.com',
        roles: ['USER'],
        groups: ['Design Team'],
        isActive: true,
        createdAt: new Date('2025-02-15'),
        updatedAt: new Date()
      },
      {
        id: '5',
        username: 'jane_smith',
        email: 'jane@example.com',
        roles: ['GROUP_ADMIN'],
        groups: ['Marketing Team'],
        isActive: false,
        createdAt: new Date('2025-01-20'),
        updatedAt: new Date()
      }
    ];

    this.filterUsers();
  }

  filterUsers(): void {
    let filtered = this.allUsers;

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.roles.some((role: string) => role.toLowerCase().includes(term))
      );
    }

    // Role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user =>
        user.roles.includes(this.selectedRole)
      );
    }

    // Status filter
    if (this.selectedStatus) {
      const isActive = this.selectedStatus === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    this.filteredUsers = filtered;
    this.currentPage = 1;
    this.calculatePagination();
    this.updatePaginatedUsers();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.totalPages = Math.max(1, this.totalPages);
  }

  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.updatePaginatedUsers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.filterUsers();
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = this.paginatedUsers.map(user => user.id);
    }
  }

  isAllSelected(): boolean {
    return this.paginatedUsers.length > 0 && this.selectedUsers.length === this.paginatedUsers.length;
  }

  toggleUserSelection(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
  }

  isUserSelected(userId: string): boolean {
    return this.selectedUsers.includes(userId);
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'GROUP_ADMIN': return 'Group Admin';
      case 'USER': return 'User';
      default: return 'Unknown';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'warn';
      case 'GROUP_ADMIN': return 'accent';
      case 'USER': return 'primary';
      default: return 'primary';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'admin_panel_settings';
      case 'GROUP_ADMIN': return 'group_work';
      case 'USER': return 'person';
      default: return 'person';
    }
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'primary' : 'warn';
  }

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'check_circle' : 'block';
  }

  getGroupName(groupId: string): string {
    // Mock group names for Phase 1
    const groupNames: { [key: string]: string } = {
      'Development Team': 'Development Team',
      'Design Team': 'Design Team',
      'Marketing Team': 'Marketing Team'
    };
    return groupNames[groupId] || groupId;
  }

  editUser(user: any): void {
    this.editingUser = { ...user };
    this.showEditUser = true;
  }

  toggleUserStatus(user: any): void {
    user.isActive = !user.isActive;
    this.filterUsers();
  }

  async deleteUser(user: any): Promise<void> {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Mock API call for Phase 1
      await new Promise(resolve => setTimeout(resolve, 500));

      this.allUsers = this.allUsers.filter(u => u.id !== user.id);
      this.selectedUsers = this.selectedUsers.filter(id => id !== user.id);
      this.filterUsers();

      alert('User deleted successfully!');
    } catch (error) {
      alert('Failed to delete user. Please try again.');
    }
  }

  async bulkDelete(): Promise<void> {
    if (!confirm(`Are you sure you want to delete ${this.selectedUsers.length} users? This action cannot be undone.`)) {
      return;
    }

    try {
      // Mock API call for Phase 1
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.allUsers = this.allUsers.filter(u => !this.selectedUsers.includes(u.id));
      this.selectedUsers = [];
      this.filterUsers();

      alert('Users deleted successfully!');
    } catch (error) {
      alert('Failed to delete users. Please try again.');
    }
  }

  async bulkActivate(): Promise<void> {
    try {
      // Mock API call for Phase 1
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.allUsers.forEach(user => {
        if (this.selectedUsers.includes(user.id)) {
          user.isActive = true;
        }
      });

      this.selectedUsers = [];
      this.filterUsers();
      alert('Users activated successfully!');
    } catch (error) {
      alert('Failed to activate users. Please try again.');
    }
  }
}