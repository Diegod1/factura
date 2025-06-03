import { Observable } from 'rxjs';
import { LoginResponse } from './user.entity';
import { InjectionToken } from '@angular/core';

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');

export interface AuthRepository {
  login(credentials: { Login: string; Password_Web: string }): Observable<LoginResponse>;
}
