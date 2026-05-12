import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastTipo = 'success' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="toast-overlay"
      [class.toast-overlay--visible]="visible"
    >
      <div class="toast-card" [class.toast-card--visible]="visible">

        <!-- Icono grande -->
        <div class="toast-card__icon-wrapper"
          [class.toast-card__icon-wrapper--success]="tipo === 'success'"
          [class.toast-card__icon-wrapper--error]="tipo === 'error'"
        >
          <span class="material-icons toast-card__icon">
            {{ tipo === 'success' ? 'check' : 'close' }}
          </span>
        </div>

        <!-- Mensaje -->
        <p class="toast-card__mensaje">{{ mensaje }}</p>

        <!-- Botón cerrar -->
        <button class="toast-card__close" (click)="cerrar()">
          <span class="material-icons">close</span>
        </button>

      </div>
    </div>
  `,
  styles: [`
    .toast-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0);
      pointer-events: none;
      transition: background 0.3s ease;

      &--visible {
        pointer-events: all;
      }
    }

    .toast-card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.14);
      padding: 40px 32px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 280px;
      text-align: center;
      opacity: 0;
      transform: scale(0.85);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: all;

      &--visible {
        opacity: 1;
        transform: scale(1);
      }

      &__icon-wrapper {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid;

        &--success {
          border-color: #16a34a;
          color: #16a34a;
        }

        &--error {
          border-color: #dc2626;
          color: #dc2626;
        }
      }

      &__icon {
        font-size: 40px;
      }

      &__mensaje {
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        line-height: 1.5;
        margin: 0;
      }

      &__close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        color: #9ca3af;
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 6px;
        transition: color 0.15s;

        &:hover { color: #374151; }

        .material-icons { font-size: 18px; }
      }
    }
  `],
})
export class ToastComponent implements OnInit {
  @Input() tipo: ToastTipo = 'success';
  @Input() mensaje: string = '';
  @Input() duracion: number = 3500;
  @Output() cerrado = new EventEmitter<void>();

  visible = false;
  private timer: any;

  ngOnInit(): void {
    setTimeout(() => (this.visible = true), 50);
    this.timer = setTimeout(() => this.cerrar(), 700);
  }

  cerrar(): void {
    clearTimeout(this.timer);
    this.visible = false;
    setTimeout(() => this.cerrado.emit(), 300);
  }
}