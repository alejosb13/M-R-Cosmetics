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

  private Subscription = new Subscription();

  constructor(
    private _Listado: Listado,
    private _DevolucionFacturaService: DevolucionFacturaService,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
    private _FacturasService: FacturasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.roleName = String(this._AuthService.dataStorage.user.roleName);
    this.despachado = 0;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.status_entrega = Number(params.get("status_entrega")) == 1 ? 1 : 0;
      console.log("this.status_entrega", this.status_entrega);

      this.asignarValores();
    });

    // this.asignarValores();
  }

  asignarValores() {
    this.isLoad = true;

    this.listadoFilter = {
      ...this.listadoFilter,
      estado: 1,
      roleName: this.roleName,
      userId: this.isAdmin || this.isSupervisor ? 0 : this.userId,
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
    this.NgbModal.open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then((result) => {})
      .catch((err) => {});
  }

  FormsValuesDevolucion(DevolucionProducto: any) {
    // console.log("[DevolucionFacturaForm]", DevolucionProducto);

    Swal.fire({
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

        Swal.fire({
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

  despachar(id: number) {
    // console.log(id);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este factura será despachada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Despachar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._FacturasService
          .despacharFactura(id, { despachado: 1 })
          .subscribe((data) => {
            this.Facturas = this.Facturas.filter((factura) => factura.id != id);
            // this.refreshCountries()

            Swal.fire({
              text: data[0],
              icon: "success",
            });
          });
      }
    });
  }

  openAgregarFactura(Factura:Factura){
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este factura será marcada como recibida.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._FacturasService.entregarFactura(Factura.id).subscribe((data)=>{
          this.Facturas = this.Facturas.filter(factura => factura.id != Factura.id)
          // this.refreshCountries()

          Swal.fire({
            text: data[0],
            icon: 'success',
          })
        })
      }
    })
  }


  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }
}
