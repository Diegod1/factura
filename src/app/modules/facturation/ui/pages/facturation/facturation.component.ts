import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'; // Importar NgForm para formularios Template-driven
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { FacturaService } from '../../../infrastructure/factura.service';

declare var bootstrap: any;

interface Factura {
  codigoFactura: string;
  cliente: string; // O un tipo más específico si tienes objetos de cliente
  fechaEmision: string;
  fechaVencimiento: string;
  moneda: string;
  valorFactura: number;
  tasaCambioEmision?: number; // Opcional
  valorPagado?: number; // Opcional
  fechaPago?: string; // Opcional
  tasaCambioPago?: number; // Opcional
}

interface Cliente {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-facturation',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule],
  templateUrl: './facturation.component.html',
  styleUrl: './facturation.component.css'
})
export class FacturationComponent implements OnInit {
  nuevaFactura: Factura = {
    codigoFactura: '',
    cliente: '',
    fechaEmision: '',
    fechaVencimiento: '',
    moneda: 'COP', 
    valorFactura: 0,
    tasaCambioEmision: 1 
  }; 

  clientes: Cliente[] = [
    { id: '1', nombre: 'Cliente A' },
    { id: '2', nombre: 'Cliente B' },
    { id: '3', nombre: 'Cliente C' },
  ]; 

  facturaSeleccionada: Factura = {
    codigoFactura: '',
    cliente: '',
    fechaEmision: '',
    fechaVencimiento: '',
    moneda: 'COP',
    valorFactura: 0,
    tasaCambioEmision: 1
  };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
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

  abrirModalEditar(content: any) {
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
      // Aquí iría la lógica para actualizar la factura
      console.log('Factura actualizada:', this.facturaSeleccionada);
      this.modalService.dismissAll();
      // Opcional: resetear el formulario o recargar datos
    } else {
      form.control.markAllAsTouched();
    }
  }
}
