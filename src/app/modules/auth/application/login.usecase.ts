import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../domain/user.entity';
import { AuthRepository, AUTH_REPOSITORY } from '../domain/auth.repository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository) {}

  execute(credentials: { Login: string; Password_Web: string }): Observable<LoginResponse> {
    return this.authRepository.login(credentials);
  }
}
