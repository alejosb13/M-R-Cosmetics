import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/inicio',        title: 'Inicio',            icon:'nc-icon nc-shop',       class: '' },
    { path: '/cliente',       title: 'Clientes',          icon:'nc-icon nc-single-02',  class: '' },
    { path: '/producto',      title: 'Producto',          icon:'fas fa-truck-loading',  class: '' },
    { path: '/usuario',       title: 'Usuario',           icon:'fas fa-user-tie',       class: '' },
    { path: '/factura',       title: 'Facturas',          icon:'fas fa-receipt',        class: '' },
    { path: '/pedido',        title: 'Pedido',            icon:'fas fa-receipt',        class: '' },
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
    ngOnInit() {
        
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        // console.log(this.menuItems);
    }
}
