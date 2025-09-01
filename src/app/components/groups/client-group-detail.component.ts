import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ClientLayoutComponent } from '../layouts/client-layout.component';
import { Group } from '../../models/group.model';
import { Channel } from '../../models/channel.model';

@Component({
    selector: 'app-client-group-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        ClientLayoutComponent
    ],
    template: `
    <app-client-layout [pageTitle]="group?.name || 'Group'" [pageDescription]="group?.description || ''">
      <div class="client-group-container" *ngIf="group; else notFound">
        <mat-card class="channels-card">
          <mat-card-header>
            <mat-card-title>Channels</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="channels-grid">
              <mat-card *ngFor="let ch of channels" class="channel-item">
                <mat-card-header>
                  <mat-icon mat-card-avatar>{{ getChannelIcon(ch.type) }}</mat-icon>
                  <mat-card-title># {{ ch.name }}</mat-card-title>
                  <mat-card-subtitle>{{ ch.description || 'No description' }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-raised-button color="primary" [routerLink]="['/group', group.id, 'channel', ch.id]">
                    <mat-icon>chat</mat-icon>
                    Open Chat
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <ng-template #notFound>
        <mat-card><mat-card-content>Group not found.</mat-card-content></mat-card>
      </ng-template>
    </app-client-layout>
  `,
    styles: [`
    .client-group-container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .channels-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  `]
})
export class ClientGroupDetailComponent implements OnInit {
    group: Group | null = null;
    channels: Channel[] = [];

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('groupId');
        const groups: Group[] = JSON.parse(localStorage.getItem('groups') || '[]');
        this.group = groups.find(g => g.id === id) || null;
        const allChannels: Channel[] = JSON.parse(localStorage.getItem('channels') || '[]');
        this.channels = allChannels.filter(c => c.groupId === id);
    }

    getChannelIcon(type: string): string {
        switch (type) {
            case 'text': return 'chat';
            case 'voice': return 'mic';
            case 'video': return 'videocam';
            default: return 'forum';
        }
    }
}


