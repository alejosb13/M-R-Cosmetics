import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { DevolucionFacturaService } from "app/pages/devoluciones/services/devolucion-factura.service";
import { Factura } from "app/shared/models/Factura.model";
import { FacturasService } from "app/shared/services/facturas.service";
import { TablasService } from "app/shared/services/tablas.service";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { Listado } from "app/shared/services/listados.service";
import { Usuario } from "app/shared/models/Usuario.model";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { CommunicationService } from "@app/shared/services/communication.service";

@Component({
  selector: "app-facturas-entregadas",
  templateUrl: "./facturas-entregadas.component.html",
  styleUrls: ["./facturas-entregadas.component.css"],
})
export class FacturasEntregadasComponent implements OnInit {
  Facturas: Factura[];
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  status_pagado: number;
  Factura: Factura;
  userId: number;
  despachado: number;
  roleName: string;
  listadoData: ListadoModel<Factura>;
  listadoFilter: FiltrosList = { link: null };
  status_entrega: number;

  userStore: Usuario[];
  USersNames: string[] = [];

  private Subscription = new Subscription();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _Listado: Listado,
    private _DevolucionFacturaService: DevolucionFacturaService,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _FacturasService: FacturasService,
    private route: ActivatedRoute,
    private _UsuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.roleName = String(this._AuthService.dataStorage.user.roleName);
    this.despachado = 0;

    this.getUsers();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.status_entrega = Number(params.get("status_entrega")) == 1 ? 1 : 0;
      console.log("this.status_entrega", this.status_entrega);

      this.listadoFilter.userId = Number(
        this._AuthService.dataStorage.user.userId
      );
      this.asignarValores();
    });

    // this.asignarValores();
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      estado: 1,
      // roleName: this.roleName,
      // userId: this.isAdmin || this.isSupervisor ? 0 : this.userId,
      status_entrega: this.status_entrega,
      created_at: "2022-07-01 00:00:00",
      despachado: 1,
    };

    let Subscription = this._Listado.getFacturas(this.listadoFilter).subscribe(
      (Paginacion) => {
        this.listadoData = { ...Paginacion };
        this.Facturas = [...Paginacion.data];
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
    this.Subscription.add(Subscription);
  }

  BuscarValor() {
    this.listadoFilter.link = null;
    this.asignarValores();
  }

  openDevolverFactura(content: any, Factura: Factura) {
    this.Factura = Factura;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    })
      .result.then((result) => {})
      .catch((err) => {});
  }

  FormsValuesDevolucion(DevolucionProducto: any) {
    // console.log("[DevolucionFacturaForm]", DevolucionProducto);

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Cargando la devolución",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._DevolucionFacturaService
      .insertDevolucion(DevolucionProducto)
      .subscribe((data) => {
        console.log("[response]", data);

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "La devolución fue realizada con exito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
      });
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }

  despachar(id: number) {
    // console.log(id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este factura será despachada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Despachar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._FacturasService
            .despacharFactura(id, { despachado: 1 })
            .subscribe((data) => {
              this.Facturas = this.Facturas.filter(
                (factura) => factura.id != id
              );
              // this.refreshCountries()

              Swal.mixin({
                customClass: {
                  container: this.themeSite, // Clase para el modo oscuro
                },
              }).fire({
                text: data[0],
                icon: "success",
              });
            });
        }
      });
  }

  openAgregarFactura(Factura: Factura) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este factura será marcada como recibida.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._FacturasService
            .entregarFactura(Factura.id)
            .subscribe((data) => {
              this.Facturas = this.Facturas.filter(
                (factura) => factura.id != Factura.id
              );
              // this.refreshCountries()

              Swal.mixin({
                customClass: {
                  container: this.themeSite, // Clase para el modo oscuro
                },
              }).fire({
                text: data[0],
                icon: "success",
              });
            });
        }
      });
  }

  getUsers() {
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
      this.USersNames = usuarios.map(
        (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
      );
    });
  }

  limpiarFiltros() {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.roleName = String(this._AuthService.dataStorage.user.roleName);
    this.listadoFilter.userId = this.userId;
    this.listadoFilter.roleName = this.roleName;

    // this.setCurrentDate();

    this.aplicarFiltros();
    // this.asignarValores();

    // console.log(this.filtros);
  }

  aplicarFiltros(submit: boolean = false) {
    this.listadoFilter.userId = Number(this.userId);
    // Administrador = 2,
    // Vendedor      = 3,
    // Supervisor    = 4,
    let user = this.userStore.find(
      (user) => user.id == this.listadoFilter.userId
    ) || { role_id: 3 };
    let role = user.role_id == 3 ? "vendedor" : "administrador";
    this.listadoFilter.roleName = role;

    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }

  openFiltros(content: any) {
    // console.log(this.mesNewMeta);
    this.listadoFilter.link = null;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }
}
