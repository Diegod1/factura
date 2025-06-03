import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AUTH_REPOSITORY } from '../../../domain/auth.repository';
import { AuthApiService } from '../../../infrastructure/auth-api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  providers: [
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthApiService
    }
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  

}
