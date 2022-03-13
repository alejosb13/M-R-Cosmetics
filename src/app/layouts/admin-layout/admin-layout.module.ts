import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { TableComponent }           from '../../pages/table/table.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { IconsComponent }           from '../../pages/icons/icons.component';
import { MapsComponent }            from '../../pages/maps/maps.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClientesComponent } from '../../pages/clientes/clientes.component';
import { ClienteEditarComponent } from 'app/pages/clientes/cliente-editar/cliente-editar.component';
import { ClienteFormComponent } from 'app/shared/components/forms/cliente-form/cliente-form.component';
import { ClienteInsertarComponent } from 'app/pages/clientes/cliente-insertar/cliente-insertar.component';
import { ClientesFacturasComponent } from 'app/pages/clientes/clientes-facturas/clientes-facturas.component';

import { ProductosComponent } from 'app/pages/productos/productos.component';
import { ProductoEditarComponent } from 'app/pages/productos/producto-editar/producto-editar.component';
import { ProductoFormComponent } from 'app/shared/components/forms/producto-form/producto-form.component';
import { ProductoInsertarComponent } from 'app/pages/productos/producto-insertar/producto-insertar.component';

import { UsuariosComponent } from 'app/pages/usuarios/usuarios.component';
import { UsuariosEditarComponent } from 'app/pages/usuarios/usuarios-editar/usuarios-editar.component';
import { UsuarioInsertarComponent } from 'app/pages/usuarios/usuario-insertar/usuario-insertar.component';
import { UsuarioFormComponent } from 'app/shared/components/forms/usuario-form/usuario-form.component';

import { FacturasComponent } from 'app/pages/facturas/facturas.component';
import { FacturaEditarComponent } from 'app/pages/facturas/factura-editar/factura-editar.component';
import { FacturaInsertarComponent } from 'app/pages/facturas/factura-insertar/factura-insertar.component';
import { FacturarProductoComponent } from 'app/shared/components/forms/facturar-producto/facturar-producto.component';
import { FacturaDetalleComponent } from 'app/pages/facturas/factura-detalle/factura-detalle.component';

import { CambiarPasswordComponent } from 'app/shared/components/forms/cambiar-password/cambiar-password.component';

import { CheckoutComponent } from 'app/pages/checkout/checkout.component';

import { AbonoInsertarComponent } from 'app/pages/abonos/abono-insertar/abono-insertar.component';
import { AbonoEditarComponent } from 'app/pages/abonos/abono-editar/abono-editar.component';
import { AbonoFormComponent } from 'app/shared/components/forms/abono-form/abono-form.component';
import { AbonoFacturaComponent } from 'app/pages/abonos/abono-factura/abono-factura.component';
import { AbonoListComponent } from 'app/pages/abonos/abono-list/abono-list.component';
import { CategoriaListComponent } from 'app/pages/categorias/categoria-list/categoria-list.component';
import { CategoriaInsertarComponent } from 'app/pages/categorias/categoria-insertar/categoria-insertar.component';
import { CategoriaEditarComponent } from 'app/pages/categorias/categoria-editar/categoria-editar.component';
import { CategoriaFormComponent } from 'app/shared/components/forms/categoria-form/categoria-form.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    
    ClientesComponent,
    ClienteEditarComponent,
    ClienteInsertarComponent,
    ClienteFormComponent,
    ClientesFacturasComponent,
    
    ProductosComponent,
    ProductoEditarComponent,
    ProductoInsertarComponent,
    ProductoFormComponent,
    
    UsuariosComponent,
    UsuariosEditarComponent,
    UsuarioInsertarComponent,
    UsuarioFormComponent,
    
    FacturasComponent,
    FacturaEditarComponent,
    FacturaInsertarComponent,
    FacturarProductoComponent,
    FacturaDetalleComponent,

    CambiarPasswordComponent,
    
    CheckoutComponent,
    
    AbonoInsertarComponent,
    AbonoEditarComponent,
    AbonoFormComponent,
    AbonoListComponent,
    AbonoFacturaComponent,
    
    CategoriaListComponent,
    CategoriaInsertarComponent,
    CategoriaEditarComponent,
    CategoriaFormComponent,
    
  ]
})

export class AdminLayoutModule {}
