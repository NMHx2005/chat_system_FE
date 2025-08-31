import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../../models';
import { ClientLayoutComponent } from '../layout/client-layout.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientLayoutComponent],
  template: `
    <app-client-layout 
      [pageTitle]="'# ' + (currentChannel?.name || 'general')"
      [pageDescription]="currentChannel?.description || 'General discussion channel'">
      
      <div page-actions>
        <button class="btn-secondary" (click)="showChannelInfo()">Channel Info</button>
        <button class="btn-primary" routerLink="/channels">Back to Channels</button>
      </div>

      <div class="chat-content">
        <!-- Sidebar -->
        <div class="chat-sidebar">
          <div class="sidebar-section">
            <h3>Online Members</h3>
            <div class="member-list">
              <div *ngFor="let member of onlineMembers" class="member-item">
                <div class="member-avatar">
                  {{ member.username.charAt(0).toUpperCase() }}
                </div>
                <div class="member-info">
                  <span class="member-name">{{ member.username }}</span>
                  <span class="member-status online">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <button class="btn-secondary" (click)="muteNotifications()">Mute Notifications</button>
              <button class="btn-info" (click)="pinMessage()">Pin Message</button>
              <button class="btn-success" (click)="inviteUser()">Invite User</button>
            </div>
          </div>
        </div>

        <!-- Main Chat Area -->
        <div class="chat-main">
          <!-- Messages Container -->
          <div class="messages-container" #messagesContainer>
            <div *ngFor="let message of messages" class="message-item">
              <div class="message-avatar">
                {{ message.username.charAt(0).toUpperCase() }}
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-username">{{ message.username }}</span>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
                <div class="message-text">{{ message.content }}</div>
                <div *ngIf="message.isEdited" class="message-edited">(edited)</div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="message-input-container">
            <div class="input-wrapper">
              <input 
                type="text" 
                [(ngModel)]="newMessage" 
                (keyup.enter)="sendMessage()"
                placeholder="Type your message here..."
                class="message-input">
              <button class="send-button" (click)="sendMessage()">
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-client-layout>
  `,
  styles: [`
    .chat-content {
      display: flex;
      gap: 2rem;
      min-height: 600px;
    }

    .chat-sidebar {
      width: 280px;
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      height: fit-content;
    }

    .sidebar-section {
      margin-bottom: 2rem;
    }

    .sidebar-section h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
      font-size: 1.1rem;
    }

    .member-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .member-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .member-item:hover {
      background: #f8f9fa;
    }

    .member-avatar {
      width: 32px;
      height: 32px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .member-info {
      display: flex;
      flex-direction: column;
    }

    .member-name {
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .member-status {
      font-size: 0.8rem;
      color: #95a5a6;
    }

    .member-status.online {
      color: #27ae60;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .chat-main {
      flex: 1;
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
    }

    .messages-container {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 500px;
    }

    .message-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      flex-shrink: 0;
    }

    .message-content {
      flex: 1;
      min-width: 0;
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .message-username {
      font-weight: 500;
      color: #2c3e50;
    }

    .message-time {
      font-size: 0.8rem;
      color: #95a5a6;
    }

    .message-text {
      color: #2c3e50;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .message-edited {
      font-size: 0.8rem;
      color: #95a5a6;
      font-style: italic;
      margin-top: 0.25rem;
    }

    .message-input-container {
      padding: 1.5rem;
      border-top: 1px solid #e1e5e9;
      background: #f8f9fa;
      border-radius: 0 0 15px 15px;
    }

    .input-wrapper {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .message-input {
      flex: 1;
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .message-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .send-button {
      padding: 1rem 2rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .send-button:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
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
      .chat-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .chat-sidebar {
        width: 100%;
      }
      
      .messages-container {
        max-height: 400px;
      }
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  currentChannel: any = null;
  messages: Message[] = [];
  newMessage = '';
  onlineMembers: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadFakeData();

    // Check for channel from query params
    this.route.queryParams.subscribe(params => {
      if (params['channel']) {
        this.loadChannel(params['channel']);
      } else {
        this.loadDefaultChannel();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadFakeData(): void {
    // Fake online members
    this.onlineMembers = [
      { id: '1', username: 'super', status: 'online' },
      { id: '2', username: 'dev1', status: 'online' },
      { id: '3', username: 'dev2', status: 'online' },
      { id: '4', username: 'designer1', status: 'online' },
      { id: '5', username: 'marketing1', status: 'online' }
    ];

    // Fake messages
    this.messages = [
      {
        id: '1',
        content: 'Hello everyone! Welcome to the general channel.',
        channelId: '1',
        userId: '1',
        username: 'super',
        timestamp: new Date(Date.now() - 3600000),
        isEdited: false
      },
      {
        id: '2',
        content: 'Hi! Great to be here. Looking forward to collaborating with everyone.',
        channelId: '1',
        userId: '2',
        username: 'dev1',
        timestamp: new Date(Date.now() - 3000000),
        isEdited: false
      },
      {
        id: '3',
        content: 'Same here! This project looks really exciting.',
        channelId: '1',
        userId: '3',
        username: 'dev2',
        timestamp: new Date(Date.now() - 2400000),
        isEdited: false
      },
      {
        id: '4',
        content: 'I\'ll be working on the UI/UX design. Any specific requirements?',
        channelId: '1',
        userId: '4',
        username: 'designer1',
        timestamp: new Date(Date.now() - 1800000),
        isEdited: false
      },
      {
        id: '5',
        content: 'We need a modern, clean interface that\'s easy to use.',
        channelId: '1',
        userId: '1',
        username: 'super',
        timestamp: new Date(Date.now() - 1200000),
        isEdited: false
      }
    ];
  }

  loadChannel(channelId: string): void {
    // Simulate loading channel data
    this.currentChannel = {
      id: channelId,
      name: channelId === '1' ? 'general' : channelId,
      description: 'Channel description for ' + channelId
    };
  }

  loadDefaultChannel(): void {
    this.currentChannel = {
      id: '1',
      name: 'general',
      description: 'General discussion channel for all team members'
    };
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: this.newMessage,
      channelId: this.currentChannel?.id || '1',
      userId: '1', // Current user ID
      username: 'super', // Current username
      timestamp: new Date(),
      isEdited: false
    };

    this.messages.push(message);
    this.newMessage = '';

    // Simulate other users responding
    setTimeout(() => {
      this.simulateResponse();
    }, 2000);
  }

  simulateResponse(): void {
    const responses = [
      'That\'s a great point!',
      'I agree with you on that.',
      'Interesting perspective!',
      'Thanks for sharing!',
      'Good idea!',
      'I\'ll look into that.',
      'Sounds good to me!',
      'Let\'s discuss this further.',
      'I have some thoughts on that.',
      'Good point!'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomUser = this.onlineMembers[Math.floor(Math.random() * this.onlineMembers.length)];

    const message: Message = {
      id: Date.now().toString(),
      content: randomResponse,
      channelId: this.currentChannel?.id || '1',
      userId: randomUser.id,
      username: randomUser.username,
      timestamp: new Date(),
      isEdited: false
    };

    this.messages.push(message);
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  showChannelInfo(): void {
    alert(`Channel: #${this.currentChannel?.name}\nDescription: ${this.currentChannel?.description}\nMembers: ${this.onlineMembers.length} online`);
  }

  muteNotifications(): void {
    alert('Notifications muted for this channel');
  }

  pinMessage(): void {
    alert('Message pinned successfully');
  }

  inviteUser(): void {
    alert('Invite user functionality will be implemented in Phase 2');
  }
}
