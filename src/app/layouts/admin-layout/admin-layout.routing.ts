import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';

import { ClientesComponent } from 'app/pages/clientes/clientes.component';
import { ClienteEditarComponent } from 'app/pages/clientes/cliente-editar/cliente-editar.component';
import { ClienteInsertarComponent } from 'app/pages/clientes/cliente-insertar/cliente-insertar.component';

import { ProductosComponent } from 'app/pages/productos/productos.component';
import { ProductoEditarComponent } from 'app/pages/productos/producto-editar/producto-editar.component';
import { ProductoInsertarComponent } from 'app/pages/productos/producto-insertar/producto-insertar.component';
import { UsuariosComponent } from 'app/pages/usuarios/usuarios.component';
import { UsuariosEditarComponent } from 'app/pages/usuarios/usuarios-editar/usuarios-editar.component';
import { UsuarioInsertarComponent } from 'app/pages/usuarios/usuario-insertar/usuario-insertar.component';



export const AdminLayoutRoutes: Routes = [
    { path: 'inicio',               component: DashboardComponent },
    
    { 
        path: 'cliente', 
        children:[
            { path: '',             component: ClientesComponent},
            { path: 'agregar',      component: ClienteInsertarComponent},
            { path: 'editar/:id',   component: ClienteEditarComponent },
        ]
    },
    
    { 
        path: 'usuario', 
        children:[
            { path: '',             component: UsuariosComponent},
            { path: 'agregar',      component: UsuarioInsertarComponent},
            { path: 'editar/:id',   component: UsuariosEditarComponent },
        ]
    },
    { 
        path: 'producto', 
        children:[
            { path: '',             component: ProductosComponent},
            { path: 'agregar',      component: ProductoInsertarComponent},
            { path: 'editar/:id',   component: ProductoEditarComponent },
        ]
    },

    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent }
];
