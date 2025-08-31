import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as UserRole[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const hasRequiredRole = requiredRoles.some(role => this.authService.hasRole(role));

    if (hasRequiredRole) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
