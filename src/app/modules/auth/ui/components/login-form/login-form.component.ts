import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUseCase } from '../../../application/login.usecase';
import { Router } from '@angular/router';
import { AUTH_REPOSITORY } from '../../../domain/auth.repository';
import { AuthApiService } from '../../../infrastructure/auth-api.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    LoginUseCase,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthApiService
    }
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginUseCase: LoginUseCase,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.loginUseCase.execute({
        Login: this.loginForm.value.usuario,
        Password_Web: this.loginForm.value.contrasena
      }).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.Respuesta?.Resultado === '0000') {
            // Guardar el token y datos del usuario
            localStorage.setItem('token', response.Token);
            localStorage.setItem('nombreUsuario', response.Nombre_Usuario);
            this.router.navigate(['/facturation']);
          } else {
            this.errorMessage = response.Respuesta?.Mensaje_Para_Usuario || 'Error al iniciar sesión';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Error al iniciar sesión';
        }
      });
    }
  }
}
