import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLayoutComponent } from '../layout/admin-layout.component';
import { Group } from '../../models';

@Component({
  selector: 'app-admin-create-group',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout 
      pageTitle="Create New Group" 
      pageDescription="Create a new group and set up initial settings">
      
      <div page-actions>
        <button class="btn-secondary" routerLink="/admin/my-groups">Back to My Groups</button>
        <button class="btn-primary" (click)="saveGroup()">Create Group</button>
      </div>

      <div class="create-group-container">
        <!-- Group Information Form -->
        <div class="form-section">
          <h3>Group Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="groupName">Group Name *</label>
              <input 
                type="text" 
                id="groupName"
                [(ngModel)]="groupForm.name"
                placeholder="Enter group name"
                class="form-input"
                required>
            </div>
            
            <div class="form-group">
              <label for="groupDescription">Description *</label>
              <textarea 
                id="groupDescription"
                [(ngModel)]="groupForm.description"
                placeholder="Describe the purpose of this group"
                class="form-textarea"
                rows="3"
                required></textarea>
            </div>
            
            <div class="form-group">
              <label for="groupType">Group Type</label>
              <select 
                id="groupType"
                [(ngModel)]="groupForm.type"
                class="form-select">
                <option value="team">Team</option>
                <option value="project">Project</option>
                <option value="department">Department</option>
                <option value="interest">Interest Group</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="groupVisibility">Visibility</label>
              <select 
                id="groupVisibility"
                [(ngModel)]="groupForm.visibility"
                class="form-select">
                <option value="public">Public - Anyone can see and request to join</option>
                <option value="private">Private - Only invited members can join</option>
                <option value="secret">Secret - Hidden from non-members</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Initial Settings -->
        <div class="form-section">
          <h3>Initial Settings</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="defaultChannels">Default Channels</label>
              <div class="channels-input">
                <div class="channel-tag" *ngFor="let channel of groupForm.defaultChannels; let i = index">
                  <span># {{ channel }}</span>
                  <button type="button" class="remove-channel" (click)="removeChannel(i)">×</button>
                </div>
                <div class="add-channel">
                  <input 
                    type="text" 
                    [(ngModel)]="newChannel"
                    placeholder="Add channel name"
                    class="channel-input"
                    (keyup.enter)="addChannel()">
                  <button type="button" class="btn-add-channel" (click)="addChannel()">+</button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="inviteMembers">Invite Members</label>
              <div class="members-input">
                <div class="member-tag" *ngFor="let member of groupForm.inviteMembers; let i = index">
                  <span>{{ member }}</span>
                  <button type="button" class="remove-member" (click)="removeMember(i)">×</button>
                </div>
                <div class="add-member">
                  <input 
                    type="text" 
                    [(ngModel)]="newMember"
                    placeholder="Enter username or email"
                    class="member-input"
                    (keyup.enter)="addMember()">
                  <button type="button" class="btn-add-member" (click)="addMember()">+</button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="groupPermissions">Group Permissions</label>
              <div class="permissions-grid">
                <label class="permission-item">
                  <input type="checkbox" [(ngModel)]="groupForm.permissions.allowMemberInvites">
                  <span>Members can invite others</span>
                </label>
                <label class="permission-item">
                  <input type="checkbox" [(ngModel)]="groupForm.permissions.allowMemberChannels">
                  <span>Members can create channels</span>
                </label>
                <label class="permission-item">
                  <input type="checkbox" [(ngModel)]="groupForm.permissions.allowMemberPosts">
                  <span>Members can post announcements</span>
                </label>
                <label class="permission-item">
                  <input type="checkbox" [(ngModel)]="groupForm.permissions.requireApproval">
                  <span>Require approval for new members</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Settings -->
        <div class="form-section">
          <h3>Advanced Settings</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="groupTags">Tags</label>
              <input 
                type="text" 
                id="groupTags"
                [(ngModel)]="groupForm.tags"
                placeholder="Enter tags separated by commas"
                class="form-input">
            </div>
            
            <div class="form-group">
              <label for="groupWebsite">Website</label>
              <input 
                type="url" 
                id="groupWebsite"
                [(ngModel)]="groupForm.website"
                placeholder="https://example.com"
                class="form-input">
            </div>
            
            <div class="form-group">
              <label for="groupLocation">Location</label>
              <input 
                type="text" 
                id="groupLocation"
                [(ngModel)]="groupForm.location"
                placeholder="City, Country"
                class="form-input">
            </div>
            
            <div class="form-group">
              <label for="groupLanguage">Primary Language</label>
              <select 
                id="groupLanguage"
                [(ngModel)]="groupForm.language"
                class="form-select">
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button class="btn-secondary" (click)="resetForm()">Reset Form</button>
          <button class="btn-info" (click)="saveAsDraft()">Save as Draft</button>
          <button class="btn-success" (click)="saveGroup()">Create Group</button>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .create-group-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-section {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }

    .form-section h3 {
      color: #2c3e50;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
      display: inline-block;
      font-size: 1.3rem;
      font-weight: 300;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .form-input, .form-textarea, .form-select {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .channels-input, .members-input {
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      padding: 0.75rem;
      background: white;
      min-height: 60px;
    }

    .channel-tag, .member-tag {
      display: inline-flex;
      align-items: center;
      background: #667eea;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      margin: 0.25rem;
      font-size: 0.85rem;
    }

    .remove-channel, .remove-member {
      background: none;
      border: none;
      color: white;
      margin-left: 0.5rem;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: bold;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
    }

    .remove-channel:hover, .remove-member:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .add-channel, .add-member {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .channel-input, .member-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #e1e5e9;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .btn-add-channel, .btn-add-member {
      width: 32px;
      height: 32px;
      border: none;
      background: #27ae60;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .btn-add-channel:hover, .btn-add-member:hover {
      background: #229954;
      transform: translateY(-2px);
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .permission-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }

    .permission-item:hover {
      background: #f8f9fa;
    }

    .permission-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #667eea;
    }

    .permission-item span {
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
      padding: 2rem;
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }

    .btn-primary, .btn-secondary, .btn-success, .btn-info {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      min-width: 120px;
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
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .permissions-grid {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }
      
      .btn-primary, .btn-secondary, .btn-success, .btn-info {
        min-width: auto;
      }
    }
  `]
})
export class AdminCreateGroupComponent implements OnInit {
  groupForm = {
    name: '',
    description: '',
    type: 'team',
    visibility: 'public',
    defaultChannels: ['general'],
    inviteMembers: [],
    permissions: {
      allowMemberInvites: false,
      allowMemberChannels: false,
      allowMemberPosts: false,
      requireApproval: true
    },
    tags: '',
    website: '',
    location: '',
    language: 'en'
  };

  newChannel = '';
  newMember = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize form with default values
  }

  addChannel(): void {
    if (this.newChannel.trim() && !this.groupForm.defaultChannels.includes(this.newChannel.trim())) {
      this.groupForm.defaultChannels.push(this.newChannel.trim());
      this.newChannel = '';
    }
  }

  removeChannel(index: number): void {
    if (this.groupForm.defaultChannels.length > 1) {
      this.groupForm.defaultChannels.splice(index, 1);
    }
  }

  addMember(): void {
    const trimmedMember = this.newMember.trim();
    if (
      trimmedMember &&
      !(this.groupForm.inviteMembers as string[]).includes(trimmedMember)
    ) {
      (this.groupForm.inviteMembers as string[]).push(trimmedMember);
      this.newMember = '';
    }
  }

  removeMember(index: number): void {
    this.groupForm.inviteMembers.splice(index, 1);
  }

  saveGroup(): void {
    if (!this.groupForm.name.trim() || !this.groupForm.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend
    const groupData = {
      ...this.groupForm,
      id: Date.now().toString(),
      createdBy: 'super', // Current user
      admins: ['super'],
      members: ['super', ...this.groupForm.inviteMembers],
      channels: this.groupForm.defaultChannels,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    console.log('Creating group:', groupData);
    alert(`Group "${groupData.name}" created successfully!`);

    // Navigate back to groups list
    this.router.navigate(['/admin/my-groups']);
  }

  saveAsDraft(): void {
    alert('Draft saved successfully!');
  }

  resetForm(): void {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
      this.groupForm = {
        name: '',
        description: '',
        type: 'team',
        visibility: 'public',
        defaultChannels: ['general'],
        inviteMembers: [],
        permissions: {
          allowMemberInvites: false,
          allowMemberChannels: false,
          allowMemberPosts: false,
          requireApproval: true
        },
        tags: '',
        website: '',
        location: '',
        language: 'en'
      };
      this.newChannel = '';
      this.newMember = '';
    }
  }
}
