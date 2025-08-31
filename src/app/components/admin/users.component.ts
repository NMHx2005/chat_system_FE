import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { User, UserRole } from '../../models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout 
      pageTitle="Users Management" 
      pageDescription="Manage system users, roles, and permissions">
      
      <!-- Search and Filter Section -->
      <div class="search-filter-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search users by name, email, or role..." 
            [(ngModel)]="searchTerm"
            class="search-input">
        </div>
        <div class="filter-options">
          <select [(ngModel)]="roleFilter" class="filter-select">
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="GROUP_ADMIN">Group Admin</option>
            <option value="USER">User</option>
          </select>
          <select [(ngModel)]="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div class="action-buttons">
          <button class="btn-success" (click)="addNewUser()">Add New User</button>
          <button class="btn-info" (click)="exportUsers()">Export Users</button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-table-container">
        <div class="table-header">
          <h3>Users List ({{ filteredUsers.length }} users)</h3>
          <div class="table-actions">
            <button class="btn-secondary" (click)="bulkAction()">Bulk Actions</button>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" (change)="selectAllUsers($event)" [checked]="allSelected">
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Groups</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers" class="user-row">
                <td>
                  <input type="checkbox" [checked]="selectedUsers.includes(user.id)" (change)="toggleUserSelection(user.id)">
                </td>
                <td class="user-info">
                  <div class="user-avatar">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="user-details">
                    <span class="username">{{ user.username }}</span>
                    <span class="user-id">ID: {{ user.id }}</span>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <div class="roles-container">
                    <span *ngFor="let role of user.roles" class="role-badge" [class]="getRoleClass(role)">
                      {{ getRoleDisplayName(role) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="groups-count">{{ user.groups.length || 0 }} groups</span>
                </td>
                <td>
                  <span class="status-badge" [class]="user.isActive ? 'active' : 'inactive'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="editUser(user)" title="Edit User">
                      ✏️
                    </button>
                    <button class="btn-icon" (click)="viewUserDetails(user)" title="View Details">
                      👁️
                    </button>
                    <button class="btn-icon danger" (click)="deleteUser(user)" title="Delete User">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button class="btn-secondary" [disabled]="currentPage === 1" (click)="previousPage()">Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn-secondary" [disabled]="currentPage === totalPages" (click)="nextPage()">Next</button>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .search-filter-section {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      display: flex;
      gap: 1.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .filter-options {
      display: flex;
      gap: 1rem;
    }

    .filter-select {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 120px;
      transition: all 0.3s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .users-table-container {
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e1e5e9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th,
    .users-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #f1f3f4;
    }

    .users-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-row:hover {
      background: #f8f9fa;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .username {
      font-weight: 500;
      color: #2c3e50;
    }

    .user-id {
      font-size: 0.8rem;
      color: #95a5a6;
    }

    .roles-container {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .role-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-badge.super-admin {
      background: #e74c3c;
      color: white;
    }

    .role-badge.group-admin {
      background: #f39c12;
      color: white;
    }

    .role-badge.user {
      background: #3498db;
      color: white;
    }

    .groups-count {
      color: #7f8c8d;
      font-size: 0.9rem;
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

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      background: #f8f9fa;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .btn-icon:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }

    .btn-icon.danger:hover {
      background: #f8d7da;
      color: #721c24;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }

    .page-info {
      color: #2c3e50;
      font-weight: 500;
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
      .search-filter-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box {
        min-width: auto;
      }
      
      .filter-options {
        justify-content: center;
      }
      
      .action-buttons {
        justify-content: center;
      }
      
      .table-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  allSelected = false;
  selectedUsers: string[] = [];

  users: User[] = [];
  filteredUsers: User[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadFakeData();
    this.applyFilters();
  }

  loadFakeData(): void {
    this.users = [
      {
        id: '1',
        username: 'super',
        email: 'super@example.com',
        roles: [UserRole.SUPER_ADMIN],
        groups: ['1', '2'],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: '2',
        username: 'dev1',
        email: 'dev1@example.com',
        roles: [UserRole.GROUP_ADMIN],
        groups: ['1'],
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: '3',
        username: 'dev2',
        email: 'dev2@example.com',
        roles: [UserRole.USER],
        groups: ['1'],
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: '4',
        username: 'designer1',
        email: 'designer1@example.com',
        roles: [UserRole.USER],
        groups: ['1'],
        createdAt: new Date('2025-02-15'),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: '5',
        username: 'marketing1',
        email: 'marketing1@example.com',
        roles: [UserRole.GROUP_ADMIN],
        groups: ['2'],
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date(),
        isActive: true
      },
      {
        id: '6',
        username: 'inactive_user',
        email: 'inactive@example.com',
        roles: [UserRole.USER],
        groups: [],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
        isActive: false
      }
    ];
  }

  applyFilters(): void {
    let filtered = this.users;

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.roles.some(role => this.getRoleDisplayName(role).toLowerCase().includes(search))
      );
    }

    // Role filter
    if (this.roleFilter) {
      filtered = filtered.filter(user =>
        user.roles.includes(this.roleFilter as UserRole)
      );
    }

    // Status filter
    if (this.statusFilter !== '') {
      const isActive = this.statusFilter === 'true';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    this.filteredUsers = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    const itemsPerPage = 10;
    this.totalPages = Math.ceil(this.filteredUsers.length / itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  selectAllUsers(event: any): void {
    this.allSelected = event.target.checked;
    if (this.allSelected) {
      this.selectedUsers = this.filteredUsers.map(user => user.id);
    } else {
      this.selectedUsers = [];
    }
  }

  toggleUserSelection(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
    this.allSelected = this.selectedUsers.length === this.filteredUsers.length;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
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

  getRoleClass(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'super-admin';
      case UserRole.GROUP_ADMIN:
        return 'group-admin';
      case UserRole.USER:
        return 'user';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  addNewUser(): void {
    alert('Add new user functionality will be implemented in Phase 2');
  }

  editUser(user: User): void {
    alert(`Edit user: ${user.username}`);
  }

  viewUserDetails(user: User): void {
    alert(`User Details:\nUsername: ${user.username}\nEmail: ${user.email}\nRoles: ${user.roles.join(', ')}\nGroups: ${user.groups.length}\nStatus: ${user.isActive ? 'Active' : 'Inactive'}`);
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user: ${user.username}?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.applyFilters();
      alert(`User ${user.username} deleted successfully`);
    }
  }

  bulkAction(): void {
    if (this.selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }
    alert(`Bulk action for ${this.selectedUsers.length} selected users`);
  }

  exportUsers(): void {
    alert('Export users functionality will be implemented in Phase 2');
  }
}
