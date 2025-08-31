import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserCredentials, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check localStorage for existing user session
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: UserCredentials): Observable<User> {
    // Mock login for Phase 1 - will be replaced with real API call
    return new Observable(observer => {
      setTimeout(() => {
        if (credentials.username === 'super' && credentials.password === '123') {
          const superAdmin: User = {
            id: '1',
            username: 'super',
            email: 'super@admin.com',
            roles: [UserRole.SUPER_ADMIN],
            groups: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
          };

          localStorage.setItem('currentUser', JSON.stringify(superAdmin));
          this.currentUserSubject.next(superAdmin);
          observer.next(superAdmin);
          observer.complete();
        } else {
          observer.error('Invalid credentials');
        }
      }, 500); // Simulate API delay
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
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
