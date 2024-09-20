import { Routes } from "@angular/router";

import { DashboardComponent } from "@app/pages/dashboard/dashboard.component";
import { UserComponent } from "@app/pages/user/user.component";
import { TableComponent } from "@app/pages/table/table.component";
import { TypographyComponent } from "@app/pages/typography/typography.component";
import { IconsComponent } from "@app/pages/icons/icons.component";
import { MapsComponent } from "@app/pages/maps/maps.component";
import { NotificationsComponent } from "@app/pages/notifications/notifications.component";
import { AuthGuard } from "@app/auth/login/auth.guard";

import { ClientesComponent } from "@app/pages/clientes/clientes.component";
import { ClienteEditarComponent } from "@app/pages/clientes/cliente-editar/cliente-editar.component";
import { ClienteInsertarComponent } from "@app/pages/clientes/cliente-insertar/cliente-insertar.component";
import { ClientesFacturasComponent } from "@app/pages/clientes/clientes-facturas/clientes-facturas.component";

import { ProductosComponent } from "@app/pages/productos/productos.component";
import { ProductoEditarComponent } from "@app/pages/productos/producto-editar/producto-editar.component";
import { ProductoInsertarComponent } from "@app/pages/productos/producto-insertar/producto-insertar.component";

import { UsuariosComponent } from "@app/pages/usuarios/usuarios.component";
import { UsuariosEditarComponent } from "@app/pages/usuarios/usuarios-editar/usuarios-editar.component";
import { UsuarioInsertarComponent } from "@app/pages/usuarios/usuario-insertar/usuario-insertar.component";

import { FacturasComponent } from "@app/pages/facturas/facturas.component";
import { FacturaInsertarComponent } from "@app/pages/facturas/factura-insertar/factura-insertar.component";
import { FacturaEditarComponent } from "@app/pages/facturas/factura-editar/factura-editar.component";
import { FacturaDetalleComponent } from "@app/pages/facturas/factura-detalle/factura-detalle.component";

import { CheckoutComponent } from "@app/pages/checkout/checkout.component";

import { AbonoInsertarComponent } from "@app/pages/abonos/abono-insertar/abono-insertar.component";
import { AbonoEditarComponent } from "@app/pages/abonos/abono-editar/abono-editar.component";
import { AbonoListComponent } from "@app/pages/abonos/abono-list/abono-list.component";

import { CategoriaListComponent } from "@app/pages/categorias/categoria-list/categoria-list.component";
import { CategoriaInsertarComponent } from "@app/pages/categorias/categoria-insertar/categoria-insertar.component";
import { CategoriaEditarComponent } from "@app/pages/categorias/categoria-editar/categoria-editar.component";

import { FacturaDespachadaComponent } from "@app/pages/facturas/factura-despachada/factura-despachada.component";

import { DevolucionFacturaListComponent } from "@app/pages/devoluciones/listado/devolucion-factura-list/devolucion-factura-list.component";
import { DevolucionProductoListComponent } from "@app/pages/devoluciones/listado/devolucion-producto-list/devolucion-producto-list.component";
import { DevolucionSeleccionarSeccionComponent } from "@app/pages/devoluciones/devolucion-seleccionar-seccion/devolucion-seleccionar-seccion.component";
import { ReciboSeleccionarSeccionComponent } from "@app/pages/recibos/recibo-seleccionar-seccion/recibo-seleccionar-seccion.component";
import { RecibosContadoListComponent } from "@app/pages/recibos/listados/recibos-contado-list/recibos-contado-list.component";
import { RecibosCreditoListComponent } from "@app/pages/recibos/listados/recibos-credito-list/recibos-credito-list.component";
import { CarteraComponent } from "@app/pages/logistica/cartera/cartera.component";
import { CarteraFiltrosComponent } from "@app/pages/logistica/cartera-filtros/cartera-filtros.component";
import { RecuperacionComponent } from "@app/pages/logistica/recuperacion/recuperacion.component";
import { Mora30A60Component } from "@app/pages/logistica/mora30-a60/mora30-a60.component";
import { Mora60A90Component } from "@app/pages/logistica/mora60-a90/mora60-a90.component";
import { ClientesNuevosComponent } from "@app/pages/logistica/clientes-nuevos/clientes-nuevos.component";
import { IncentivosComponent } from "@app/pages/logistica/incentivos/incentivos.component";
import { ClienteInactivosComponent } from "@app/pages/logistica/cliente-inactivos/cliente-inactivos.component";
import { ClienteDetalleComponent } from "@app/pages/clientes/cliente-detalle/cliente-detalle.component";
import { ClientesReactivadosComponent } from "@app/pages/logistica/clientes-reactivados/clientes-reactivados.component";
import { FacturasEntregadasComponent } from "@app/pages/facturas/facturas-entregadas/facturas-entregadas.component";
import { VentasComponent } from "@app/pages/logistica/ventas/ventas.component";
import { Recuperacion85Component } from "@app/pages/logistica/recuperacion85/recuperacion85.component";
import { SeccionesConfigComponent } from "@app/pages/configuracion/secciones-config/secciones-config.component";
import { MigrarInformacionVendedorComponent } from "@app/pages/configuracion/migrar-informacion-vendedor/migrar-informacion-vendedor.component";
import { ProductosVendedorComponent } from "@app/pages/logistica/productos-vendedor/productos-vendedor.component";
import { TazaCotizacionComponent } from "@app/pages/configuracion/taza-cotizacion/taza-cotizacion.component";
import { IncentivosSupervisorComponent } from "@app/pages/logistica/incentivos-supervisor/incentivos-supervisor.component";
import { MetasComponent } from "@app/pages/metas/metas.component";
import { FrecuenciaFacturaListadoComponent } from "@app/pages/frecuencia-facturas/frecuencia-factura-listado/frecuencia-factura-listado.component";
import { FrecuenciaFacturaInsertarComponent } from "@app/pages/frecuencia-facturas/frecuencia-factura-insertar/frecuencia-factura-insertar.component";
import { FrecuenciaFacturaEditarComponent } from "@app/pages/frecuencia-facturas/frecuencia-factura-editar/frecuencia-factura-editar.component";
import { CierreConfigComponent } from "@app/pages/configuracion/cierre-config/cierre-config.component";
import { ClienteProductosCompradosComponent } from "@app/pages/clientes/cliente-productos-comprados/cliente-productos-comprados.component";
import { VentasMensualComponent } from "@app/pages/ventas-mensual/ventas-mensual.component";
import { FinanzasSeccionesComponent } from "@app/pages/finanzas/finanzas.component";
import { InversionListComponent } from "@app/pages/finanzas/inversion/inversion-list/inversion-list.component";
import { InversionInsertarComponent } from "@app/pages/finanzas/inversion/inversion-insertar/inversion-insertar.component";
import { ImportacionListComponent } from "@app/pages/finanzas/importacion/importacion-list/importacion-list.component";
import { ImportacionInsertarComponent } from "@app/pages/finanzas/importacion/importacion-insertar/importacion-insertar.component";
import { InversionEditarComponent } from "@app/pages/finanzas/inversion/inversion-editar/inversion-editar.component";
import { ImportacionEditarComponent } from "@app/pages/finanzas/importacion/importacion-editar/importacion-editar.component";
import { CostosListComponent } from "@app/pages/finanzas/costos/costos-list/costos-list.component";
import { GastosListComponent } from "@app/pages/finanzas/gastos/gastos-list/gastos-list.component";
import { EstadosComponent } from "@app/pages/finanzas/estados/estados.component";
import { TalonariosListComponent } from "@app/pages/talonarios/talonarios-list/talonarios-list.component";
import { ListadoDevolucionIncentivosSupervisorComponent } from "@app/pages/devoluciones/listado/listado-devolucion-incentivos-supervisor/listado-devolucion-incentivos-supervisor.component";
import { ListadoDevolucionIncentivosSupervisorAplicadosComponent } from '../../pages/devoluciones/listado/listado-incentivos-supervisor-aplicados/listado-devolucion-incentivos-supervisor-aplicados.component';
import { UbicacionesComponent } from "@app/pages/configuracion/ubicaciones/ubicaciones.component";
import { ZonasComponent } from "@app/pages/configuracion/ubicaciones/zonas/zonas.component";

const ADMINISTRADOR = "administrador";
const VENDEDOR = "vendedor";
const SUPERVISOR = "supervisor";

export const AdminLayoutRoutes: Routes = [
  {
    path: "inicio",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { role: [SUPERVISOR, VENDEDOR, ADMINISTRADOR] },
  },
  {
    path: "cliente",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR, VENDEDOR] },
    children: [
      { path: "", component: ClientesComponent },
      { path: "agregar", component: ClienteInsertarComponent },
      { path: "editar/:id", component: ClienteEditarComponent },
      { path: "factura/:id", component: ClientesFacturasComponent },
      { path: "estado-cuenta/:id", component: ClienteDetalleComponent },
      { path: "productos/:id", component: ClienteProductosCompradosComponent },
    ],
  },

  {
    path: "logistica",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR, VENDEDOR] },
    children: [
      { path: "cartera", component: CarteraComponent },
      { path: "recuperacion", component: RecuperacionComponent },
      { path: "recuperacion-mensual", component: Recuperacion85Component },
      { path: "cartera-filtros", component: CarteraFiltrosComponent },
      { path: "mora30-60", component: Mora30A60Component },
      { path: "mora60-90", component: Mora60A90Component },
      { path: "clientes-nuevos", component: ClientesNuevosComponent },
      { path: "incentivos", component: IncentivosComponent },
      {
        path: "incentivos-supervisor",
        component: IncentivosSupervisorComponent,
      },
      { path: "clientes-inactivos", component: ClienteInactivosComponent },
      { path: "clientes-reactivados", component: ClientesReactivadosComponent },
      { path: "ventas", component: VentasComponent },
      { path: "productos-vendedores", component: ProductosVendedorComponent },
      { path: "ventas-mensual", component: VentasMensualComponent },
    ],
  },

  {
    path: "usuario",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [
      { path: "", component: UsuariosComponent },
      { path: "agregar", component: UsuarioInsertarComponent },
      { path: "editar/:id", component: UsuariosEditarComponent },
    ],
  },
  {
    path: "producto",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [
      { path: "", component: ProductosComponent },
      { path: "agregar", component: ProductoInsertarComponent },
      { path: "editar/:id", component: ProductoEditarComponent },
    ],
  },
  {
    path: "factura",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR, VENDEDOR] },
    children: [
      { path: "estado/:status_pagado", component: FacturasComponent },
      {
        path: "entrega/:status_entrega",
        component: FacturasEntregadasComponent,
      },
      { path: "detalle/:id", component: FacturaDetalleComponent },
      { path: "editar/:id", component: FacturaEditarComponent },
      { path: "despachar", component: FacturaDespachadaComponent },
    ],
  },
  {
    path: "devolucion",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [
      { path: "", component: DevolucionSeleccionarSeccionComponent },
      {
        path: "listado",
        children: [
          { path: "factura", component: DevolucionFacturaListComponent },
          { path: "producto", component: DevolucionProductoListComponent },
          {
            path: "devolucion-incentivos",
            component: ListadoDevolucionIncentivosSupervisorComponent,
          },
          {
            path: "deduccion-incentivos",
            component: ListadoDevolucionIncentivosSupervisorAplicadosComponent,
          },
        ],
      },
    ],
  },
  {
    path: "recibos",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR] },
    children: [
      { path: "", component: ReciboSeleccionarSeccionComponent },
      {
        path: "listado",
        children: [
          { path: "contado", component: RecibosContadoListComponent },
          { path: "credito", component: RecibosCreditoListComponent },
        ],
      },
    ],
  },
  {
    path: "checkout",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, VENDEDOR, SUPERVISOR] },
    children: [{ path: "", component: CheckoutComponent }],
  },
  {
    path: "pedido",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, VENDEDOR] },
    children: [{ path: "", component: FacturaInsertarComponent }],
  },
  {
    path: "abono",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR, VENDEDOR] },
    children: [
      { path: "", component: AbonoListComponent },
      { path: "agregar", component: AbonoInsertarComponent },
      { path: "editar/:id", component: AbonoEditarComponent },
      { path: "list/:facturaId", component: AbonoListComponent },
    ],
  },
  {
    path: "categoria",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR] },
    children: [
      { path: "", component: CategoriaListComponent },
      { path: "agregar", component: CategoriaInsertarComponent },
      { path: "editar/:id", component: CategoriaEditarComponent },
    ],
  },
  // {
  //   path: "frecuencia",
  //   canActivate: [AuthGuard],
  //   data: { role: [ADMINISTRADOR, SUPERVISOR] },
  //   children: [
  //     { path: "", component: FrecuenciaListadoComponent },
  //     { path: "agregar", component: FrecuenciaInsertarComponent },
  //     { path: "editar/:id", component: FrecuenciaEditarComponent },
  //   ],
  // },
  {
    path: "frecuencia-factura",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR] },
    children: [
      { path: "", component: FrecuenciaFacturaListadoComponent },
      { path: "agregar", component: FrecuenciaFacturaInsertarComponent },
      { path: "editar/:id", component: FrecuenciaFacturaEditarComponent },
    ],
  },
  {
    path: "configuracion",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [
      { path: "", component: SeccionesConfigComponent },
      {
        path: "migracion-vendedor",
        component: MigrarInformacionVendedorComponent,
      },
      { path: "taza-cotizacion", component: TazaCotizacionComponent },
      { path: "cierre", component: CierreConfigComponent },
      { path: "ubicaciones", component: UbicacionesComponent },
      { path: "zonas", component: ZonasComponent },
    ],
  },
  {
    path: "talonarios",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [{ path: "", component: TalonariosListComponent }],
  },
  {
    path: "finanzas",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [
      { path: "", component: FinanzasSeccionesComponent },
      {
        path: "inversion",
        children: [
          { path: "", component: InversionListComponent },
          { path: "agregar", component: InversionInsertarComponent },
          { path: "editar/:id", component: InversionEditarComponent },
        ],
      },
      {
        path: "importacion",
        children: [
          { path: "", component: ImportacionListComponent },
          { path: "agregar", component: ImportacionInsertarComponent },
          { path: "editar/:id", component: ImportacionEditarComponent },
          // { path: "editar/:id", component: FrecuenciaFacturaEditarComponent },
        ],
      },
      {
        path: "costos",
        children: [{ path: "", component: CostosListComponent }],
      },
      {
        path: "gastos",
        children: [{ path: "", component: GastosListComponent }],
      },
      {
        path: "estados",
        children: [{ path: "", component: EstadosComponent }],
      },
    ],
  },
  {
    path: "metas",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [{ path: "", component: MetasComponent }],
  },

  { path: "user", component: UserComponent },
  { path: "table", component: TableComponent },
  { path: "typography", component: TypographyComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapsComponent },
  { path: "notifications", component: NotificationsComponent },
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
