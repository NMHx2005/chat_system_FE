export interface Channel {
  id: string;
  name: string;
  description: string;
  groupId: string; // Parent group ID
  createdBy: string; // User ID of creator
  members: string[]; // Array of member user IDs
  bannedUsers: string[]; // Array of banned user IDs
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ChannelCreation {
  name: string;
  description: string;
  groupId: string;
}

export interface ChannelUpdate {
  name?: string;
  description?: string;
}
