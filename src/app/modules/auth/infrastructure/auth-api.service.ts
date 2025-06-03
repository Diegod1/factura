import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { LoginResponse } from '../domain/user.entity';
import { AuthRepository } from '../domain/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthApiService implements AuthRepository {
  private readonly url = 'https://www.easysalespruebas.com.co/API_Proy_Facturacion/api/WS_FAC_01_Controller/WSFAC001';

  constructor(private http: HttpClient) {}

  login(credentials: { Login: string; Password_Web: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, credentials).pipe(
      map((response) => {
        if (response.Respuesta?.Resultado === '0000') {
          return response;
        } else {
          throw new Error(response.Respuesta?.Mensaje_Para_Usuario || 'Error en login');
        }
      })
    );
  }
}
