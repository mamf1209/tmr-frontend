import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
 
export type ToastTipo = 'success' | 'error';
 
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
<div
      class="toast"
      [ngClass]="{
        'toast--success': tipo === 'success',
        'toast--error':   tipo === 'error',
        'toast--visible': visible
      }"
>
<span class="material-icons toast__icon">
        {{ tipo === 'success' ? 'check_circle' : 'error' }}
</span>
<span class="toast__mensaje">{{ mensaje }}</span>
<button class="toast__close" (click)="cerrar()">
<span class="material-icons">close</span>
</button>
</div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      min-width: 280px;
      max-width: 420px;
      transform: translateX(120%);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
 
      &--visible {
        transform: translateX(0);
        opacity: 1;
      }
 
      &--success {
        background: #f0fdf4;
        border: 1px solid #86efac;
        color: #15803d;
 
        .toast__icon { color: #16a34a; }
      }
 
      &--error {
        background: #fef2f2;
        border: 1px solid #fca5a5;
        color: #b91c1c;
 
        .toast__icon { color: #dc2626; }
      }
 
      &__icon {
        font-size: 20px;
        flex-shrink: 0;
      }
 
      &__mensaje {
        flex: 1;
        line-height: 1.4;
      }
 
      &__close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        color: inherit;
        opacity: 0.6;
        transition: opacity 0.15s;
        flex-shrink: 0;
 
        &:hover { opacity: 1; }
 
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
    this.timer = setTimeout(() => this.cerrar(), this.duracion);
  }
 
  cerrar(): void {
    clearTimeout(this.timer);
    this.visible = false;
    setTimeout(() => this.cerrado.emit(), 300);
  }
}
