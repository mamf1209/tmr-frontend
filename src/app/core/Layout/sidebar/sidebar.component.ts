import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
 
interface NavItem {
  label: string;
  route: string;
  icon: string;
}
 
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',      route: '/dashboard',      icon: 'dashboard' },
    { label: 'Time Report',    route: '/time-report',    icon: 'schedule' },
    { label: 'Proyectos',      route: '/proyectos',      icon: 'folder' },
    { label: 'Líderes',        route: '/lideres',        icon: 'star' },
    { label: 'Colaboradores',  route: '/colaboradores',  icon: 'people' },
    { label: 'Clientes',       route: '/clientes',       icon: 'business' },
  ];
}