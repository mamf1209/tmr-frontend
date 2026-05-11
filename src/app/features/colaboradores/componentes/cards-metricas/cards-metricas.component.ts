import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards-metricas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards-metricas.component.html',
  styleUrl: './cards-metricas.component.scss',
})
export class CardsMetricasComponent {
  @Input() noAsignados: number = 0;
  @Input() asignados:   number = 0;
  @Input() inactivos:   number = 0;
  @Input() activos:     number = 0;

  // Card 1: alterna entre No asignados / Asignados
  mostrandoAsignados = false;
  toggleAsignados(): void {
    this.mostrandoAsignados = !this.mostrandoAsignados;
  }

  // Card 2: alterna entre Inactivos / Activos
  mostrandoActivos = false;
  toggleActivos(): void {
    this.mostrandoActivos = !this.mostrandoActivos;
  }
}