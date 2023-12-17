import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/login/service/auth.service';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  access: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/inicio',                     title: 'Inicio',               icon:'nc-icon nc-shop',               class: '' , access: 'administrador,vendedor,supervisor'},
  { path: '/cliente',                    title: 'Cliente',              icon:'nc-icon nc-single-02',          class: '' , access: 'administrador,vendedor,supervisor'},
  { path: '/producto',                   title: 'Producto',             icon:'fas fa-truck-loading',          class: '' , access: 'administrador'},
  { path: '/usuario',                    title: 'Usuario',              icon:'fas fa-user-tie',               class: '' , access: 'administrador'},
  { path: '/factura/estado/no-pagadas',  title: 'Factura sin pagar',    icon:'fas fa-receipt',                class: '' , access: 'administrador,vendedor,supervisor'},
  { path: '/factura/estado/pagadas',     title: 'Factura Pagadas',      icon:'fas fa-receipt',                class: '' , access: 'administrador,vendedor,supervisor'},
  { path: '/factura/despachar',          title: 'F. Por Despachar',     icon:'fas fa-receipt',                class: '' , access: 'administrador,vendedor,supervisor'},
  { path: '/factura/entrega/0',          title: 'F. Por Entregar',      icon:'fas fa-receipt',                class: '' , access: 'administrador'},
  { path: '/pedido',                     title: 'Pedido',               icon:'fas fa-receipt',                class: '' , access: 'administrador,vendedor'},
  { path: '/devolucion',                 title: 'Devoluciones',         icon:'fas fa-undo',                   class: '' , access: 'administrador'},
  // { path: '/recibos',                    title: 'Recibos',              icon:'fas fa-file-invoice-dollar',    class: '' , access: 'administrador,supervisor'},
  { path: '/abono',                      title: 'Abono',                icon:'fas fa-money-check-alt',        class: '' , access: 'administrador,vendedor'},
  { path: '/metas',                      title: 'Metas',                icon:'fas fa-file-alt',               class: '' , access: 'administrador'},
  { path: '/categoria',                  title: 'Categoria',            icon:'fas fa-users',                  class: '' , access: 'administrador,supervisor'},
  // { path: '/frecuencia',                 title: 'Frecuencia',           icon:'fas fa-business-time',          class: '' , access: 'administrador,supervisor'},
  { path: '/frecuencia-factura',         title: 'Frecuencia Factura',   icon:'fas fa-business-time',          class: '' , access: 'administrador,supervisor'},
  { path: '/configuracion',              title: 'Configuración',        icon:'fas fa-cog',                    class: '' , access: 'administrador'},
  { path: '/finanzas',                   title: 'finanzas',             icon:'fas fa-cog',                    class: '' , access: 'administrador'},
  // { path: '/icons',         title: 'Icons',             icon:'nc-diamond',    class: '' },<i class="fas fa-undo"></i>
  // { path: '/maps',          title: 'Maps',              icon:'nc-pin-3',      class: '' },
  // { path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '' },
  // { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '' },
  // { path: '/table',         title: 'Table List',        icon:'nc-tile-56',    class: '' },
  // { path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '' },
  // { path: '/upgrade',       title: 'Upgrade to PRO',    icon:'nc-spaceship',  class: 'active-pro' },
];

@Component({
  moduleId: module.id,
  selector: 'sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
  public menuItems: any[];

  constructor(
    private _AuthService:AuthService
  ){}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => this._AuthService.validarRol(menuItem.access));
    // console.log(this.menuItems);
  }
}
