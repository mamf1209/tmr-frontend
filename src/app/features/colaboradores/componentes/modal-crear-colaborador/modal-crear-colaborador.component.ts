import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CrearColaboradorDto, TipoIdentificacion,
  Modalidad, Categoria, Genero,
} from '../../models/colaborador.model';

@Component({
  selector: 'app-modal-crear-colaborador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-crear-colaborador.component.html',
  styleUrl:    './modal-crear-colaborador.component.scss',
})
export class ModalCrearColaboradorComponent implements OnInit {
  @Output() cerrar  = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<CrearColaboradorDto>();

  form!: FormGroup;
  enviado = false;

  readonly asociaciones: TipoIdentificacion[] = ['RPS', 'ISC', 'RPS E ISC'];
  readonly tiposContrato: string[]             = ['Fijo', 'Por Proyecto'];
  readonly modalidades: Modalidad[]            = ['Presencial', 'Remoto', 'Híbrida'];
  readonly categorias: Categoria[]             = ['Junior', 'Semi-senior', 'Senior', 'Especialista', 'Especialista Plus'];
  readonly generos: Genero[]                   = ['Masculino', 'Femenino', 'Otro'];
  readonly departamentos: string[]             = [
    'Desarrollo', 'QA', 'Diseño UX/UI', 'DevOps', 'Datos',
    'Gestión de Proyectos', 'Seguridad', 'Infraestructura',
    'IA & Machine Learning', 'Consultoría',
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoIdentificacion: ['RPS',  Validators.required],
      tipoContrato:       ['Fijo', Validators.required],
      nombres:            ['',     [Validators.required, Validators.minLength(2)]],
      apellidos:          ['',     [Validators.required, Validators.minLength(2)]],
      identificacion:     ['',     [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
      fechaNacimiento:    ['',     Validators.required],
      genero:             ['',     Validators.required],
      correoElectronico:  ['',     [Validators.required, Validators.email]],
      telefono:           ['',     [Validators.required, Validators.pattern(/^09\d{8}$/)]],
      direccion:          ['',     [Validators.required, Validators.minLength(5)]],
      departamento:       ['',     Validators.required],
      fechaContratacion:  ['',     Validators.required],
      cargo:              ['',     [Validators.required, Validators.minLength(3)]],
      aniosExperiencia:   [null,   [Validators.required, Validators.min(0), Validators.max(50)]],
      modalidad:          ['',     Validators.required],
      categoria:          ['',     Validators.required],
    });
  }

  // ← CLAVE: detecta si el campo tiene valor para el floating label
  tieneValor(campo: string): boolean {
    const val = this.form.get(campo)?.value;
    return val !== null && val !== undefined && val !== '';
  }

  campoInvalido(campo: string): boolean {
    const ctrl = this.form.get(campo);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || this.enviado));
  }

  onGuardar(): void {
    this.enviado = true;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const dto: CrearColaboradorDto = {
      tipoIdentificacion: v.tipoIdentificacion,
      identificacion:     v.identificacion,
      nombreCompleto:     `${v.nombres} ${v.apellidos}`,
      departamento:       v.departamento,
      fechaContratacion:  v.fechaContratacion,
      cargo:              v.cargo,
      aniosExperiencia:   v.aniosExperiencia,
      modalidad:          v.modalidad,
      categoria:          v.categoria,
      correoElectronico:  v.correoElectronico,
      fechaNacimiento:    v.fechaNacimiento,
      telefono:           v.telefono,
      genero:             v.genero,
      direccion:          v.direccion,
      estado:             'Activo',
    };
    this.guardar.emit(dto);
  }

  onCerrar(): void { this.cerrar.emit(); }
}