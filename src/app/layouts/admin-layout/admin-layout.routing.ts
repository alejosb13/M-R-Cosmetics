import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { AuthGuard } from 'app/auth/login/auth.guard';

import { ClientesComponent } from 'app/pages/clientes/clientes.component';
import { ClienteEditarComponent } from 'app/pages/clientes/cliente-editar/cliente-editar.component';
import { ClienteInsertarComponent } from 'app/pages/clientes/cliente-insertar/cliente-insertar.component';
import { ClientesFacturasComponent } from 'app/pages/clientes/clientes-facturas/clientes-facturas.component';

import { ProductosComponent } from 'app/pages/productos/productos.component';
import { ProductoEditarComponent } from 'app/pages/productos/producto-editar/producto-editar.component';
import { ProductoInsertarComponent } from 'app/pages/productos/producto-insertar/producto-insertar.component';

import { UsuariosComponent } from 'app/pages/usuarios/usuarios.component';
import { UsuariosEditarComponent } from 'app/pages/usuarios/usuarios-editar/usuarios-editar.component';
import { UsuarioInsertarComponent } from 'app/pages/usuarios/usuario-insertar/usuario-insertar.component';

import { FacturasComponent } from 'app/pages/facturas/facturas.component';
import { FacturaInsertarComponent } from 'app/pages/facturas/factura-insertar/factura-insertar.component';
import { FacturaEditarComponent } from 'app/pages/facturas/factura-editar/factura-editar.component';
import { FacturaDetalleComponent } from 'app/pages/facturas/factura-detalle/factura-detalle.component';

import { CheckoutComponent } from 'app/pages/checkout/checkout.component';

import { AbonoInsertarComponent } from 'app/pages/abonos/abono-insertar/abono-insertar.component';
import { AbonoEditarComponent } from 'app/pages/abonos/abono-editar/abono-editar.component';
import { AbonoFacturaComponent } from 'app/pages/abonos/abono-factura/abono-factura.component';
import { AbonoListComponent } from 'app/pages/abonos/abono-list/abono-list.component';
import { CategoriaListComponent } from 'app/pages/categorias/categoria-list/categoria-list.component';
import { CategoriaInsertarComponent } from 'app/pages/categorias/categoria-insertar/categoria-insertar.component';
import { CategoriaEditarComponent } from 'app/pages/categorias/categoria-editar/categoria-editar.component';


const ADMINISTRADOR = "administrador"
const VENDEDOR      = "vendedor"
const SUPERVISOR    = "supervisor"



export const AdminLayoutRoutes: Routes = [
    { path: 'inicio', component: DashboardComponent, canActivate: [AuthGuard], data: {role: [SUPERVISOR,VENDEDOR,ADMINISTRADOR]}}, 
    { 
        path: 'cliente', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR,SUPERVISOR]},
        children:[
            { path: '',             component: ClientesComponent},
            { path: 'agregar',      component: ClienteInsertarComponent},
            { path: 'editar/:id',   component: ClienteEditarComponent },
            { path: 'factura/:id',   component: ClientesFacturasComponent },
        ]
    },
    
    { 
        path: 'usuario', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR]},
        children:[
            { path: '',             component: UsuariosComponent},
            { path: 'agregar',      component: UsuarioInsertarComponent},
            { path: 'editar/:id',   component: UsuariosEditarComponent },
        ]
    },
    { 
        path: 'producto', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR]},
        children:[
            { path: '',             component: ProductosComponent},
            { path: 'agregar',      component: ProductoInsertarComponent},
            { path: 'editar/:id',   component: ProductoEditarComponent },
        ]
    },
    { 
        path: 'factura', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR,VENDEDOR]},
        children:[
            { path: '',             component: FacturasComponent},
            // { path: 'agregar',      component: FacturaInsertarComponent},
            { path: 'detalle/:id',   component: FacturaDetalleComponent },
            { path: 'editar/:id',   component: FacturaEditarComponent },
        ]
    },
    { 
        path: 'checkout', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR,VENDEDOR]},
        children:[
            { path: '',             component:     CheckoutComponent},

        ]
    },
    { 
        path: 'pedido', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR,VENDEDOR]},
        children:[
            { path: '',             component:     FacturaInsertarComponent},

        ]
    },
    { 
        path: 'abono', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR,VENDEDOR]},
        children:[
            { path: '',   component: AbonoListComponent },
            { path: 'agregar',   component: AbonoInsertarComponent },
            { path: 'editar/:id',   component: AbonoEditarComponent },
            { path: 'list/:facturaId',   component: AbonoListComponent },

        ]
    },
    { 
        path: 'categoria', 
        canActivate: [AuthGuard], data: {role: [ADMINISTRADOR,VENDEDOR]},
        children:[
            { path: '',   component: CategoriaListComponent },
            { path: 'agregar',   component: CategoriaInsertarComponent },
            { path: 'editar/:id',   component: CategoriaEditarComponent },
        ]
    },

    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent }
    // {
    //     path: '',
    //     redirectTo: '/',
    //     pathMatch: 'full',
    // },
    //   {
    //     path: '**',
    //     redirectTo: 'error/404',
    //   },
];
