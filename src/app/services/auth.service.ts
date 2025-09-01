import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        this.clearUserData();
      }
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    // Mock authentication for Phase 1
    if (username === 'super' && password === '123') {
      const user: User = {
        id: '1',
        username: 'super',
        email: 'super@example.com',
        roles: [UserRole.SUPER_ADMIN],
        groups: ['1', '2'],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
        isActive: true
      };

      this.setUserData(user);
      return true;
    } else if (username === 'admin' && password === '123') {
      const user: User = {
        id: '2',
        username: 'admin',
        email: 'admin@example.com',
        roles: [UserRole.GROUP_ADMIN],
        groups: ['1', '3'],
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date(),
        isActive: true
      };

      this.setUserData(user);
      return true;
    } else if (username === 'user' && password === '123') {
      const user: User = {
        id: '3',
        username: 'user',
        email: 'user@example.com',
        roles: [UserRole.USER],
        groups: ['1'],
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date(),
        isActive: true
      };

      this.setUserData(user);
      return true;
    }

    return false;
  }

  async register(userData: { username: string; email: string; password: string }): Promise<boolean> {
    try {
      // Check if username already exists
      const isUnique = await this.checkUsernameUnique(userData.username);
      if (!isUnique) {
        return false;
      }

      // Create new user (mock implementation for Phase 1)
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        roles: [UserRole.USER],
        groups: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      // Store user in localStorage (mock database)
      const existingUsers = this.getStoredUsers();
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async checkUsernameUnique(username: string): Promise<boolean> {
    try {
      const storedUsers = this.getStoredUsers();
      const existingUser = storedUsers.find(user => user.username === username);
      return !existingUser;
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  }

  private getStoredUsers(): User[] {
    try {
      const usersData = localStorage.getItem('users');
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error parsing users from storage:', error);
      return [];
    }
  }

  private setUserData(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearUserData(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  logout(): void {
    this.clearUserData();
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  isSuperAdmin(): boolean {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }

  isGroupAdmin(): boolean {
    return this.hasRole(UserRole.GROUP_ADMIN);
  }

  isUser(): boolean {
    return this.hasRole(UserRole.USER);
  }
}
