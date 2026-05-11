import { Injectable, signal } from '@angular/core';
import { ToastTipo } from '../toast/toast.component';
 
export interface ToastData {
  id: number;
  tipo: ToastTipo;
  mensaje: string;
}
 
@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<ToastData[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 0;
 
  mostrar(tipo: ToastTipo, mensaje: string): void {
    const id = this.nextId++;
    this._toasts.update(t => [...t, { id, tipo, mensaje }]);
  }
 
  success(mensaje: string): void {
    this.mostrar('success', mensaje);
  }
 
  error(mensaje: string): void {
    this.mostrar('error', mensaje);
  }
 
  remover(id: number): void {
    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}