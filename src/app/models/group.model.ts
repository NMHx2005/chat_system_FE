export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string; // User ID of creator
  admins: string[]; // Array of admin user IDs
  members: string[]; // Array of member user IDs
  channels: string[]; // Array of channel IDs
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface GroupCreation {
  name: string;
  description: string;
}

export interface GroupUpdate {
  name?: string;
  description?: string;
}
