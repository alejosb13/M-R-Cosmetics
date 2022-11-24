import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { AuthGuard } from "app/auth/login/auth.guard";

import { ClientesComponent } from "app/pages/clientes/clientes.component";
import { ClienteEditarComponent } from "app/pages/clientes/cliente-editar/cliente-editar.component";
import { ClienteInsertarComponent } from "app/pages/clientes/cliente-insertar/cliente-insertar.component";
import { ClientesFacturasComponent } from "app/pages/clientes/clientes-facturas/clientes-facturas.component";

import { ProductosComponent } from "app/pages/productos/productos.component";
import { ProductoEditarComponent } from "app/pages/productos/producto-editar/producto-editar.component";
import { ProductoInsertarComponent } from "app/pages/productos/producto-insertar/producto-insertar.component";

import { UsuariosComponent } from "app/pages/usuarios/usuarios.component";
import { UsuariosEditarComponent } from "app/pages/usuarios/usuarios-editar/usuarios-editar.component";
import { UsuarioInsertarComponent } from "app/pages/usuarios/usuario-insertar/usuario-insertar.component";

import { FacturasComponent } from "app/pages/facturas/facturas.component";
import { FacturaInsertarComponent } from "app/pages/facturas/factura-insertar/factura-insertar.component";
import { FacturaEditarComponent } from "app/pages/facturas/factura-editar/factura-editar.component";
import { FacturaDetalleComponent } from "app/pages/facturas/factura-detalle/factura-detalle.component";

import { CheckoutComponent } from "app/pages/checkout/checkout.component";

import { AbonoInsertarComponent } from "app/pages/abonos/abono-insertar/abono-insertar.component";
import { AbonoEditarComponent } from "app/pages/abonos/abono-editar/abono-editar.component";
import { AbonoListComponent } from "app/pages/abonos/abono-list/abono-list.component";

import { CategoriaListComponent } from "app/pages/categorias/categoria-list/categoria-list.component";
import { CategoriaInsertarComponent } from "app/pages/categorias/categoria-insertar/categoria-insertar.component";
import { CategoriaEditarComponent } from "app/pages/categorias/categoria-editar/categoria-editar.component";

import { FrecuenciaListadoComponent } from "app/pages/frecuencias/frecuencia-listado/frecuencia-listado.component";
import { FrecuenciaEditarComponent } from "app/pages/frecuencias/frecuencia-editar/frecuencia-editar.component";
import { FrecuenciaInsertarComponent } from "app/pages/frecuencias/frecuencia-insertar/frecuencia-insertar.component";
import { FacturaDespachadaComponent } from "app/pages/facturas/factura-despachada/factura-despachada.component";

import { DevolucionFacturaListComponent } from "app/pages/devoluciones/listado/devolucion-factura-list/devolucion-factura-list.component";
import { DevolucionProductoListComponent } from "app/pages/devoluciones/listado/devolucion-producto-list/devolucion-producto-list.component";
import { DevolucionSeleccionarSeccionComponent } from "app/pages/devoluciones/devolucion-seleccionar-seccion/devolucion-seleccionar-seccion.component";
import { ReciboSeleccionarSeccionComponent } from "app/pages/recibos/recibo-seleccionar-seccion/recibo-seleccionar-seccion.component";
import { RecibosContadoListComponent } from "app/pages/recibos/listados/recibos-contado-list/recibos-contado-list.component";
import { RecibosCreditoListComponent } from "app/pages/recibos/listados/recibos-credito-list/recibos-credito-list.component";
import { CarteraComponent } from "app/pages/logistica/cartera/cartera.component";
import { CarteraFiltrosComponent } from "app/pages/logistica/cartera-filtros/cartera-filtros.component";
import { RecuperacionComponent } from "app/pages/logistica/recuperacion/recuperacion.component";
import { Mora30A60Component } from "app/pages/logistica/mora30-a60/mora30-a60.component";
import { Mora60A90Component } from "app/pages/logistica/mora60-a90/mora60-a90.component";
import { ClientesNuevosComponent } from "app/pages/logistica/clientes-nuevos/clientes-nuevos.component";
import { IncentivosComponent } from "app/pages/logistica/incentivos/incentivos.component";
import { ClienteInactivosComponent } from "app/pages/logistica/cliente-inactivos/cliente-inactivos.component";
import { ClienteDetalleComponent } from "app/pages/clientes/cliente-detalle/cliente-detalle.component";
import { ClientesReactivadosComponent } from "app/pages/logistica/clientes-reactivados/clientes-reactivados.component";
import { FacturasEntregadasComponent } from "app/pages/facturas/facturas-entregadas/facturas-entregadas.component";
import { VentasComponent } from "app/pages/logistica/ventas/ventas.component";
import { Recuperacion85Component } from "app/pages/logistica/recuperacion85/recuperacion85.component";
import { SeccionesConfigComponent } from "app/pages/configuracion/secciones-config/secciones-config.component";
import { MigrarInformacionVendedorComponent } from "app/pages/configuracion/migrar-informacion-vendedor/migrar-informacion-vendedor.component";
import { ProductosVendedorComponent } from "app/pages/logistica/productos-vendedor/productos-vendedor.component";

const ADMINISTRADOR = "administrador";
const VENDEDOR      = "vendedor";
const SUPERVISOR    = "supervisor";

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
      { path: "clientes-inactivos", component: ClienteInactivosComponent },
      { path: "clientes-reactivados", component: ClientesReactivadosComponent },
      { path: "ventas", component: VentasComponent },
      { path: "productos-vendedores", component: ProductosVendedorComponent },
    ],
  },

  {
    path: "usuario",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR] },
    children: [
      { path: "", component: UsuariosComponent },
      { path: "agregar", component: UsuarioInsertarComponent },
      { path: "editar/:id", component: UsuariosEditarComponent },
    ],
  },
  {
    path: "producto",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR] },
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
      { path: "entrega/:status_entrega", component: FacturasEntregadasComponent },
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
      { path: "listado", children:[
        { path: "factura", component: DevolucionFacturaListComponent },
        { path: "producto", component: DevolucionProductoListComponent },
      ]},

    ],
  },
  {
    path: "recibos",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR] },
    children: [
      { path: "", component: ReciboSeleccionarSeccionComponent },
      { path: "listado", children:[
        { path: "contado", component: RecibosContadoListComponent },
        { path: "credito", component: RecibosCreditoListComponent },
      ]},
    ],
  },
  {
    path: "checkout",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, VENDEDOR] },
    children: [{ path: "", component: CheckoutComponent }],
  },
  {
    path: "pedido",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR, VENDEDOR] },
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
  {
    path: "frecuencia",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR] },
    children: [
      { path: "", component: FrecuenciaListadoComponent },
      { path: "agregar", component: FrecuenciaInsertarComponent },
      { path: "editar/:id", component: FrecuenciaEditarComponent },
    ],
  },
  {
    path: "configuracion",
    canActivate: [AuthGuard],
    data: { role: [ADMINISTRADOR, SUPERVISOR] },
    children: [
      { path: "", component: SeccionesConfigComponent },
      { path: "migracion-vendedor", component: MigrarInformacionVendedorComponent },

    ],
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
