import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Colaborador, EditarColaboradorDto,
  EstadoColaborador, Modalidad, Categoria, Genero,
} from '../../models/colaborador.model';

@Component({
  selector: 'app-modal-editar-colaborador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-editar-colaborador.component.html',
  styleUrl:    './modal-editar-colaborador.component.scss',
})
export class ModalEditarColaboradorComponent implements OnInit {
  @Input() colaborador!: Colaborador;
  @Output() cerrar  = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<EditarColaboradorDto>();

  form!: FormGroup;
  enviado = false;

  readonly tiposContrato: string[]         = ['Fijo', 'Por Proyecto'];
  readonly modalidades: Modalidad[]        = ['Presencial', 'Remoto', 'Híbrida'];
  readonly categorias: Categoria[]         = ['Junior', 'Semi-senior', 'Senior', 'Especialista', 'Especialista Plus'];
  readonly generos: Genero[]               = ['Masculino', 'Femenino', 'Otro'];
  readonly estados: EstadoColaborador[]    = ['Activo', 'Inactivo'];
  readonly departamentos: string[]         = [
    'Desarrollo', 'QA', 'Diseño UX/UI', 'DevOps', 'Datos',
    'Gestión de Proyectos', 'Seguridad', 'Infraestructura',
    'IA & Machine Learning', 'Consultoría',
  ];

  get nombres(): string  { return this.colaborador?.nombreCompleto?.split(' ')[0] ?? ''; }
  get apellidos(): string { return this.colaborador?.nombreCompleto?.split(' ').slice(1).join(' ') ?? ''; }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoContrato:      ['Fijo',                              Validators.required],
      nombres:           [this.nombres,                        [Validators.required, Validators.minLength(2)]],
      apellidos:         [this.apellidos,                      [Validators.required, Validators.minLength(2)]],
      identificacion:    [this.colaborador.identificacion,     [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
      fechaNacimiento:   [this.colaborador.fechaNacimiento,    Validators.required],
      genero:            [this.colaborador.genero,             Validators.required],
      correoElectronico: [this.colaborador.correoElectronico,  [Validators.required, Validators.email]],
      telefono:          [this.colaborador.telefono,           [Validators.required, Validators.pattern(/^09\d{8}$/)]],
      direccion:         [this.colaborador.direccion,          [Validators.required, Validators.minLength(5)]],
      departamento:      [this.colaborador.departamento,       Validators.required],
      fechaContratacion: [this.colaborador.fechaContratacion,  Validators.required],
      cargo:             [this.colaborador.cargo,              [Validators.required, Validators.minLength(3)]],
      aniosExperiencia:  [this.colaborador.aniosExperiencia,   [Validators.required, Validators.min(0), Validators.max(50)]],
      modalidad:         [this.colaborador.modalidad,          Validators.required],
      categoria:         [this.colaborador.categoria,          Validators.required],
      estado:            [this.colaborador.estado,             Validators.required],
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
    const dto: EditarColaboradorDto = {
      nombreCompleto:    `${v.nombres} ${v.apellidos}`,
      identificacion:    v.identificacion,
      departamento:      v.departamento,
      fechaContratacion: v.fechaContratacion,
      cargo:             v.cargo,
      aniosExperiencia:  v.aniosExperiencia,
      modalidad:         v.modalidad,
      categoria:         v.categoria,
      correoElectronico: v.correoElectronico,
      fechaNacimiento:   v.fechaNacimiento,
      telefono:          v.telefono,
      genero:            v.genero,
      direccion:         v.direccion,
      estado:            v.estado,
    };
    this.guardar.emit(dto);
  }

  onCerrar(): void { this.cerrar.emit(); }
}