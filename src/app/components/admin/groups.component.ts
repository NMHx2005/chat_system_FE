import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { Group } from '../../models';

@Component({
  selector: 'app-admin-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout 
      pageTitle="Groups Management" 
      pageDescription="Manage all system groups, permissions, and settings">
      
      <!-- Search and Filter Section -->
      <div class="search-filter-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search groups by name, description, or admin..." 
            [(ngModel)]="searchTerm"
            class="search-input">
        </div>
        <div class="filter-options">
          <select [(ngModel)]="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select [(ngModel)]="adminFilter" class="filter-select">
            <option value="">All Admins</option>
            <option *ngFor="let admin of availableAdmins" [value]="admin.id">
              {{ admin.username }}
            </option>
          </select>
        </div>
        <div class="action-buttons">
          <button class="btn-success" (click)="createNewGroup()">Create New Group</button>
          <button class="btn-info" (click)="exportGroups()">Export Groups</button>
        </div>
      </div>

      <!-- Groups Table -->
      <div class="groups-table-container">
        <div class="table-header">
          <h3>Groups List ({{ filteredGroups.length }} groups)</h3>
          <div class="table-actions">
            <button class="btn-secondary" (click)="bulkAction()">Bulk Actions</button>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table class="groups-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" (change)="selectAllGroups($event)" [checked]="allSelected">
                </th>
                <th>Group</th>
                <th>Description</th>
                <th>Admin</th>
                <th>Members</th>
                <th>Channels</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let group of filteredGroups" class="group-row">
                <td>
                  <input type="checkbox" [checked]="selectedGroups.includes(group.id)" (change)="toggleGroupSelection(group.id)">
                </td>
                <td class="group-info">
                  <div class="group-avatar">
                    {{ group.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="group-details">
                    <span class="group-name">{{ group.name }}</span>
                    <span class="group-id">ID: {{ group.id }}</span>
                  </div>
                </td>
                <td class="group-description">{{ group.description }}</td>
                <td>
                  <span class="admin-badge">{{ getAdminName(group.createdBy) }}</span>
                </td>
                <td>
                  <span class="members-count">{{ group.members.length || 0 }} members</span>
                </td>
                <td>
                  <span class="channels-count">{{ group.channels.length || 0 }} channels</span>
                </td>
                <td>
                  <span class="status-badge" [class]="group.isActive ? 'active' : 'inactive'">
                    {{ group.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ formatDate(group.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" (click)="editGroup(group)" title="Edit Group">
                      ✏️
                    </button>
                    <button class="btn-icon" (click)="viewGroupDetails(group)" title="View Details">
                      👁️
                    </button>
                    <button class="btn-icon" (click)="manageMembers(group)" title="Manage Members">
                      👥
                    </button>
                    <button class="btn-icon danger" (click)="deleteGroup(group)" title="Delete Group">
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

    .groups-table-container {
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

    .groups-table {
      width: 100%;
      border-collapse: collapse;
    }

    .groups-table th,
    .groups-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #f1f3f4;
    }

    .groups-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .group-row:hover {
      background: #f8f9fa;
    }

    .group-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .group-avatar {
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

    .group-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .group-name {
      font-weight: 500;
      color: #2c3e50;
    }

    .group-id {
      font-size: 0.8rem;
      color: #95a5a6;
    }

    .group-description {
      color: #7f8c8d;
      max-width: 200px;
      line-height: 1.4;
    }

    .admin-badge {
      background: #f39c12;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .members-count, .channels-count {
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
export class AdminGroupsComponent implements OnInit {
  searchTerm = '';
  statusFilter = '';
  adminFilter = '';
  currentPage = 1;
  totalPages = 1;
  allSelected = false;
  selectedGroups: string[] = [];

  groups: Group[] = [];
  filteredGroups: Group[] = [];
  availableAdmins: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadFakeData();
    this.applyFilters();
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

    this.groups = [
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
      },
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
      },
      {
        id: '6',
        name: 'Inactive Team',
        description: 'This team is no longer active.',
        createdBy: 'super',
        admins: ['super'],
        members: [],
        channels: [],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-26'),
        isActive: false
      }
    ];
  }

  applyFilters(): void {
    let filtered = this.groups;

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(search) ||
        group.description.toLowerCase().includes(search) ||
        this.getAdminName(group.createdBy).toLowerCase().includes(search)
      );
    }

    // Status filter
    if (this.statusFilter !== '') {
      const isActive = this.statusFilter === 'true';
      filtered = filtered.filter(group => group.isActive === isActive);
    }

    // Admin filter
    if (this.adminFilter) {
      filtered = filtered.filter(group => group.createdBy === this.adminFilter);
    }

    this.filteredGroups = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    const itemsPerPage = 10;
    this.totalPages = Math.ceil(this.filteredGroups.length / itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  selectAllGroups(event: any): void {
    this.allSelected = event.target.checked;
    if (this.allSelected) {
      this.selectedGroups = this.filteredGroups.map(group => group.id);
    } else {
      this.selectedGroups = [];
    }
  }

  toggleGroupSelection(groupId: string): void {
    const index = this.selectedGroups.indexOf(groupId);
    if (index > -1) {
      this.selectedGroups.splice(index, 1);
    } else {
      this.selectedGroups.push(groupId);
    }
    this.allSelected = this.selectedGroups.length === this.filteredGroups.length;
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

  editGroup(group: Group): void {
    alert(`Edit group: ${group.name}`);
  }

  viewGroupDetails(group: Group): void {
    alert(`Group Details:\nName: ${group.name}\nDescription: ${group.description}\nAdmin: ${this.getAdminName(group.createdBy)}\nMembers: ${group.members.length}\nChannels: ${group.channels.length}\nStatus: ${group.isActive ? 'Active' : 'Inactive'}`);
  }

  manageMembers(group: Group): void {
    alert(`Manage members for group: ${group.name}`);
  }

  deleteGroup(group: Group): void {
    if (confirm(`Are you sure you want to delete group: ${group.name}?`)) {
      this.groups = this.groups.filter(g => g.id !== group.id);
      this.applyFilters();
      alert(`Group ${group.name} deleted successfully`);
    }
  }

  bulkAction(): void {
    if (this.selectedGroups.length === 0) {
      alert('Please select groups first');
      return;
    }
    alert(`Bulk action for ${this.selectedGroups.length} selected groups`);
  }

  exportGroups(): void {
    alert('Export groups functionality will be implemented in Phase 2');
  }
}
