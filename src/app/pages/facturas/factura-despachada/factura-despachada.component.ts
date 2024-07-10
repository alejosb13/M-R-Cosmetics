import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/auth/login/service/auth.service";
import { Factura } from "app/shared/models/Factura.model";
import Swal from "sweetalert2";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { Listado } from "app/shared/services/listados.service";
import { DevolucionFacturaService } from "app/pages/devoluciones/services/devolucion-factura.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { FacturasService } from "app/shared/services/facturas.service";
import { CommunicationService } from "@app/shared/services/communication.service";

@Component({
  selector: "app-factura-despachada",
  templateUrl: "./factura-despachada.component.html",
  styleUrls: ["./factura-despachada.component.css"],
})
export class FacturaDespachadaComponent implements OnInit {
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

  private Subscription = new Subscription();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _Listado: Listado,
    private _DevolucionFacturaService: DevolucionFacturaService,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _FacturasService: FacturasService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.roleName = String(this._AuthService.dataStorage.user.roleName);
    this.despachado = 0;

    this.asignarValores();
  }

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      estado: 1,
      roleName: this.roleName,
      userId: this.isAdmin || this.isSupervisor ? 0 : this.userId,
      // status_pagado: this.status_pagado,
      despachado: 0,
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

  ngOnDestroy() {
    this.Subscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
