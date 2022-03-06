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
    { path: '/inicio',        title: 'Inicio',            icon:'nc-icon nc-shop',               class: '' , access: 'administrador,vendedor,supervisor'},
    { path: '/cliente',       title: 'Clientes',          icon:'nc-icon nc-single-02',          class: '' , access: 'administrador,vendedor,supervisor'},
    { path: '/producto',      title: 'Producto',          icon:'fas fa-truck-loading',          class: '' , access: 'administrador,supervisor'},
    { path: '/usuario',       title: 'Usuario',           icon:'fas fa-user-tie',               class: '' , access: 'administrador,supervisor'},
    { path: '/factura',       title: 'Facturas',          icon:'fas fa-receipt',                class: '' , access: 'administrador,vendedor,supervisor'},
    { path: '/pedido',        title: 'Pedido',            icon:'fas fa-receipt',                class: '' , access: 'administrador,vendedor,supervisor'},
    { path: '/abono',         title: 'Abono',             icon:'fas fa-money-check-alt',        class: '' , access: 'administrador,vendedor,supervisor'},
    // { path: '/icons',         title: 'Icons',             icon:'nc-diamond',    class: '' },
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
