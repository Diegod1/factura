import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AUTH_REPOSITORY } from './domain/auth.repository';
import { AuthApiService } from './infrastructure/auth-api.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthApiService
    }
  ]
})
export class AuthModule { } 