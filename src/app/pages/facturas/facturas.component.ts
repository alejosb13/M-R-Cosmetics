import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Factura } from "app/shared/models/Factura.model";
import { FacturasService } from "app/shared/services/facturas.service";
import { TablasService } from "app/shared/services/tablas.service";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { DevolucionFacturaService } from "../devoluciones/services/devolucion-factura.service";
import { Listado } from "app/shared/services/listados.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { CommunicationService } from "@app/shared/services/communication.service";

@Component({
  selector: "app-facturas",
  templateUrl: "./facturas.component.html",
  styleUrls: ["./facturas.component.css"],
})
export class FacturasComponent implements OnInit, OnDestroy {
  Facturas: Factura[];
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  status_pagado: number;
  Factura: Factura;
  userId: number;

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
    private route: ActivatedRoute,
    private NgbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.roleName = String(this._AuthService.dataStorage.user.roleName);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.status_pagado = params.get("status_pagado") == "pagadas" ? 1 : 0;
      this.asignarValores();
    });
    
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
      roleName: this.roleName,
      userId: this.userId,
      status_pagado: this.status_pagado,
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
    // let camposPorFiltrar:any[] = [
    //   ['cliente','nombreCompleto'],
    //   ['id',],
    // ];

    this.listadoFilter.link = null;
    this.asignarValores();
  }

  openDevolverFactura(content: any, Factura: Factura) {
    this.Factura = Factura;
    this.NgbModal.open(content, { ariaLabelledBy: "modal-basic-title" })
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
        }).fire({
          text: "La devolución fue realizada con exito",
          icon: "success",
        }).then((result) => {
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

  ngOnDestroy() {
    this.Subscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
}
