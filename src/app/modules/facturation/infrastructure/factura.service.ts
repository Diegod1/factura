import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Factura {
  Cliente_Id: string;
  Nombre_Cliente: string;
  Factura_Id: number;
  Fecha_Emision: string;
  Fecha_Vencimiento: string;
  Moneda: string;
  Descripcion_Moneda: string;
  Valor_Factura: number;
  Tasa_Cambio_Emision: number;
  Estado_Facturacion: string;
  Descripcion_Estado_Facturacion: string;
  Valor_Pagado: number;
  Fecha_Pago: string;
  Tasa_Cambio_Pago: number;
  Estado_Rec: string;
}

export interface FacturaRequest {
  Cliente_Id: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'https://www.easysalespruebas.com.co/API_Proy_Facturacion/api/WS_FAC_09_Controller/WSFAC001';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerFacturas(clienteId: string = ''): Observable<Factura[]> {
    const body: FacturaRequest = { Cliente_Id: clienteId };
    return this.http.post<any>(this.apiUrl, body, { headers: this.getHeaders() }).pipe(
      map(response => response.Lista_Facturas || [])
    );
  }

  filtrarFacturas(facturas: Factura[], filtros: {
    codigoCliente?: string;
    estado?: string;
    cliente?: string;
  }): Factura[] {
    return facturas.filter(factura => {
      const cumpleCodigoCliente = !filtros.codigoCliente || 
        factura.Factura_Id.toString().includes(filtros.codigoCliente) ||
        factura.Nombre_Cliente.toLowerCase().includes(filtros.codigoCliente.toLowerCase());

      const cumpleEstado = !filtros.estado || 
        filtros.estado === 'Todos los estados' ||
        factura.Descripcion_Estado_Facturacion === filtros.estado;

      const cumpleCliente = !filtros.cliente || 
        filtros.cliente === 'Todos los clientes' ||
        factura.Nombre_Cliente === filtros.cliente;

      return cumpleCodigoCliente && cumpleEstado && cumpleCliente;
    });
  }

  inactivarFactura(body: any): Observable<any> {
    const url = 'https://www.easysalespruebas.com.co/API_Proy_Facturacion/api/WS_FAC_09_Controller/WSFAC002';
    return this.http.post(url, body, { headers: this.getHeaders() });
  }
}
