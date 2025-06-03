import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; // Importar NgForm para formularios Template-driven
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FacturaService, Factura } from '../../../infrastructure/factura.service';
import { AuthService } from '../../../infrastructure/auth.service';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap: any;

interface FacturaForm {
  codigoFactura: string;
  cliente: string;
  fechaEmision: string;
  fechaVencimiento: string;
  moneda: string;
  valorFactura: number;
  tasaCambioEmision: number;
  valorPagado?: number;
  fechaPago?: string;
  tasaCambioPago?: number;
}

interface Cliente {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-facturation',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule, HttpClientModule],
  templateUrl: './facturation.component.html',
  styleUrl: './facturation.component.css'
})
export class FacturationComponent implements OnInit {
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  filtros = {
    codigoCliente: '',
    estado: 'Todos los estados',
    cliente: ''
  };
  clientes: string[] = [];
  estados: string[] = ['PAGADA', 'ANULADA', 'EMITIDA'];
  clienteSeleccionado: string = '';
  error: string = '';
  cargando: boolean = false;

  nuevaFactura: FacturaForm = {
    codigoFactura: '',
    cliente: '',
    fechaEmision: '',
    fechaVencimiento: '',
    moneda: 'COP',
    valorFactura: 0,
    tasaCambioEmision: 1
  };

  facturaSeleccionada: FacturaForm = {
    codigoFactura: '',
    cliente: '',
    fechaEmision: '',
    fechaVencimiento: '',
    moneda: 'COP',
    valorFactura: 0,
    tasaCambioEmision: 1
  };

  constructor(
    private modalService: NgbModal,
    private facturaService: FacturaService,
    private authService: AuthService
  ) {
    // Establecer el token inicial
    this.establecerTokenInicial();
  }

  private establecerTokenInicial() {
    // Aquí deberías obtener el token de tu sistema de autenticación
    // Por ahora, usaremos un token de prueba
    const tokenPrueba = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    this.authService.setToken(tokenPrueba);
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'No hay token de autenticación. Por favor, inicie sesión.';
      return;
    }
    this.cargarFacturas();
  }

  cargarFacturas() {
    this.cargando = true;
    this.error = '';
    this.facturaService.obtenerFacturas(this.clienteSeleccionado).subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasFiltradas = data;
        this.extraerClientesUnicos();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
        this.error = 'Error al cargar las facturas. Por favor, intente nuevamente.';
        this.cargando = false;
      }
    });
  }

  extraerClientesUnicos() {
    this.clientes = [...new Set(this.facturas.map(f => f.Nombre_Cliente))];
  }

  aplicarFiltros() {
    this.facturasFiltradas = this.facturaService.filtrarFacturas(this.facturas, {
      ...this.filtros,
      cliente: this.filtros.cliente === 'Todos los clientes' ? '' : this.filtros.cliente
    });
  }

  onClienteChange(cliente: string) {
    if (cliente === 'Todos los clientes') {
      this.clienteSeleccionado = '';
    } else {
      this.clienteSeleccionado = cliente;
    }
    this.cargarFacturas();
  }

  abrirModal(content: any) {
    this.modalService.open(content, { 
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-dialog-centered'
    });
  }

  abrirModalEditar(content: any, factura: Factura) {
    this.facturaSeleccionada = {
      codigoFactura: factura.Factura_Id.toString(),
      cliente: factura.Cliente_Id,
      fechaEmision: factura.Fecha_Emision,
      fechaVencimiento: factura.Fecha_Vencimiento,
      moneda: factura.Descripcion_Moneda,
      valorFactura: factura.Valor_Factura,
      tasaCambioEmision: factura.Tasa_Cambio_Emision,
      valorPagado: factura.Valor_Pagado,
      fechaPago: factura.Fecha_Pago,
      tasaCambioPago: factura.Tasa_Cambio_Pago
    };
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-dialog-centered'
    });
  }

  guardarFactura(form: NgForm) {
    if (form.valid) {
      console.log('Datos de la factura a guardar:', this.nuevaFactura);
      this.modalService.dismissAll();
      this.resetearFormulario(form);
    } else {
      console.log('Formulario inválido. Por favor, completa todos los campos requeridos.');
      form.control.markAllAsTouched();
    }
  }

  resetearFormulario(form: NgForm) {
    form.resetForm({
      codigoFactura: '',
      cliente: '',
      fechaEmision: '',
      fechaVencimiento: '',
      moneda: 'COP',
      valorFactura: 0,
      tasaCambioEmision: 1
    });
  }

  actualizarFactura(form: NgForm) {
    if (form.valid) {
      console.log('Factura actualizada:', this.facturaSeleccionada);
      this.modalService.dismissAll();
    } else {
      form.control.markAllAsTouched();
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
  }
}
