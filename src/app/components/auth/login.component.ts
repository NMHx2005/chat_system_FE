import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserCredentials } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login to Chat System</h2>
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="credentials.username" 
              required 
              class="form-control"
              placeholder="Enter username">
          </div>
          
          <div class="form-group">
            <label for="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="credentials.password" 
              required 
              class="form-control"
              placeholder="Enter password">
          </div>
          
          <button type="submit" [disabled]="!loginForm.valid || isLoading" class="btn-login">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
        
        <div class="demo-info">
          <p><strong>Demo Account:</strong></p>
          <p>Username: <code>super</code></p>
          <p>Password: <code>123</code></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .btn-login {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .btn-login:hover:not(:disabled) {
      background: #5a6fd8;
    }
    
    .btn-login:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #e74c3c;
      text-align: center;
      margin-top: 1rem;
      padding: 0.5rem;
      background: #fdf2f2;
      border-radius: 5px;
    }
    
    .demo-info {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 5px;
      border-left: 4px solid #667eea;
    }
    
    .demo-info p {
      margin: 0.25rem 0;
      color: #666;
    }
    
    .demo-info code {
      background: #e9ecef;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: monospace;
    }
  `]
})
export class LoginComponent {
  credentials: UserCredentials = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error || 'Login failed. Please try again.';
      }
    });
  }
}
