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

import { FrecuenciaListadoComponent } from 'app/pages/frecuencias/frecuencia-listado/frecuencia-listado.component';
import { FrecuenciaEditarComponent } from 'app/pages/frecuencias/frecuencia-editar/frecuencia-editar.component';
import { FrecuenciaInsertarComponent } from 'app/pages/frecuencias/frecuencia-insertar/frecuencia-insertar.component';
import { FrecuenciaFormComponent } from 'app/shared/components/forms/frecuencia-form/frecuencia-form.component';
import { FacturaEditarFormComponent } from 'app/shared/factura-form/factura-form.component';
import { FacturaDespachadaComponent } from 'app/pages/facturas/factura-despachada/factura-despachada.component';
import { ReciboModalFormComponent } from 'app/shared/components/forms/recibo-modal-form/recibo-modal-form.component';

import { DevolucionSeleccionarSeccionComponent } from 'app/pages/devoluciones/devolucion-seleccionar-seccion/devolucion-seleccionar-seccion.component';
import { DevolucionFacturaListComponent } from 'app/pages/devoluciones/listado/devolucion-factura-list/devolucion-factura-list.component';
import { DevolucionProductoListComponent } from 'app/pages/devoluciones/listado/devolucion-producto-list/devolucion-producto-list.component';
import { DevolucionProductoFormComponent } from 'app/shared/components/forms/devolucion-producto-form/devolucion-producto-form.component';
import { DevolucionFacturaFormComponent } from 'app/shared/components/forms/devolucion-factura-form/devolucion-factura-form.component';
import { RecibosContadoListComponent } from 'app/pages/recibos/listados/recibos-contado-list/recibos-contado-list.component';
import { RecibosCreditoListComponent } from 'app/pages/recibos/listados/recibos-credito-list/recibos-credito-list.component';
import { ReciboSeleccionarSeccionComponent } from 'app/pages/recibos/recibo-seleccionar-seccion/recibo-seleccionar-seccion.component';
import { CarteraComponent } from 'app/pages/logistica/cartera/cartera.component';
import { CarteraFiltrosComponent } from 'app/pages/logistica/cartera-filtros/cartera-filtros.component';
import { RecuperacionComponent } from 'app/pages/logistica/recuperacion/recuperacion.component';
import { Mora30A60Component } from 'app/pages/logistica/mora30-a60/mora30-a60.component';
import { Mora60A90Component } from 'app/pages/logistica/mora60-a90/mora60-a90.component';
import { ClientesNuevosComponent } from 'app/pages/logistica/clientes-nuevos/clientes-nuevos.component';
import { IncentivosComponent } from 'app/pages/logistica/incentivos/incentivos.component';
import { ClienteInactivosComponent } from 'app/pages/logistica/cliente-inactivos/cliente-inactivos.component';
import { ClienteDetalleComponent } from 'app/pages/clientes/cliente-detalle/cliente-detalle.component';
import { ClientesReactivadosComponent } from 'app/pages/logistica/clientes-reactivados/clientes-reactivados.component';
import { FacturasEntregadasComponent } from 'app/pages/facturas/facturas-entregadas/facturas-entregadas.component';
import { VentasComponent } from 'app/pages/logistica/ventas/ventas.component';
import { MetaFormComponent } from 'app/shared/components/forms/meta-form/meta-form.component';
import { Recuperacion85Component } from 'app/pages/logistica/recuperacion85/recuperacion85.component';
import { SeccionesConfigComponent } from 'app/pages/configuracion/secciones-config/secciones-config.component';
import { MigrarInformacionVendedorComponent } from 'app/pages/configuracion/migrar-informacion-vendedor/migrar-informacion-vendedor.component';
import { ListClientMigrationComponent } from 'app/pages/configuracion/migrar-informacion-vendedor/list-client-migration/list-client-migration.component';
import { ProductosVendedorComponent } from 'app/pages/logistica/productos-vendedor/productos-vendedor.component';

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
    FacturaEditarFormComponent,
    FacturaDespachadaComponent,
    FacturasEntregadasComponent,

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

    FrecuenciaListadoComponent,
    FrecuenciaEditarComponent,
    FrecuenciaInsertarComponent,
    FrecuenciaFormComponent,

    ReciboModalFormComponent,
    RecibosContadoListComponent,
    RecibosCreditoListComponent,
    ReciboSeleccionarSeccionComponent,

    DevolucionSeleccionarSeccionComponent,
    DevolucionProductoListComponent,
    DevolucionProductoFormComponent,

    DevolucionFacturaListComponent,
    DevolucionFacturaFormComponent,

    CarteraComponent,
    CarteraFiltrosComponent,
    RecuperacionComponent,
    Mora30A60Component,
    Mora60A90Component,
    ClientesNuevosComponent,
    IncentivosComponent,
    ClienteInactivosComponent,
    ClienteDetalleComponent,
    ClientesReactivadosComponent,
    
    VentasComponent,
    MetaFormComponent,
    Recuperacion85Component,

    SeccionesConfigComponent,
    MigrarInformacionVendedorComponent,
    ListClientMigrationComponent,
    ProductosVendedorComponent
  ]
})

export class AdminLayoutModule {}
