import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommunicationService } from "@app/shared/services/communication.service";
import { AuthService } from "app/auth/login/service/auth.service";
import { Cliente } from "app/shared/models/Cliente.model";
import { HelpersService } from "app/shared/services/helpers.service";

import { LogisticaService } from "app/shared/services/logistica.service";
import { TablasService } from "app/shared/services/tablas.service";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-cliente-detalle",
  templateUrl: "./cliente-detalle.component.html",
  styleUrls: ["./cliente-detalle.component.css"],
})
export class ClienteDetalleComponent implements OnInit {
  isLoad: boolean = false;
  isAdmin: boolean;
  ClienteId: number;
  Cliente: Cliente;

  Data: any;
  page = 1;
  // pageSize = 4;
  pageSize = environment.PageSize;
  collectionSize = 0;

  totalAbonos = { text: "Promedio Mensual: ", value: 0 };
  totalFacturas = { text: "Total Comprado: ", value: 0 };
  Abonos = [];
  Facturas = [];
  Facturas_Promedios = [];
  Facturas_Promedios_total = 0;
  isLoadingTableDynamic: boolean = true;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _LogisticaService: LogisticaService,
    private _AuthService: AuthService,
    private _ActivatedRoute: ActivatedRoute,
    private _HelpersService: HelpersService,
    private _TablasService: TablasService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.ClienteId = Number(this._ActivatedRoute.snapshot.params.id);

    this.getEstadoCuenta();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  getEstadoCuenta() {
    this.isLoad = true;
    this._LogisticaService
      .getEstadoCuentaCliente({ cliente_id: this.ClienteId })
      .pipe(
        tap((data) => {
          data.estado_cuenta.map((proceso) => {
            if (proceso.tipo_documento == "Recibo") {
              this.Abonos = [
                ...this.Abonos,
                [proceso.fecha, Number(proceso.abono)],
              ];
            } else {
              this.Facturas = [
                ...this.Facturas,
                [proceso.fecha, Number(proceso.credito)],
              ];
            }
          });
        }),
        tap(() => {
          let totalAbonos = this.Abonos.reduce(
            (acc, abono) => acc + abono[1],
            0
          );
          console.log(this.Abonos.length);
          
          let cantidadAbonos = this.Abonos.length;

          // Calcular el promedio
          this.totalAbonos.value =
            cantidadAbonos > 0 ? totalAbonos / cantidadAbonos : 0;
        }),
        tap(() => {
          // Calcular el total de facturas y la cantidad
          this.totalFacturas.value = this.Facturas.reduce(
            (acc, factura) => acc + factura[1],
            0
          );
        })
      )
      .subscribe(
        (data) => {
          this.isLoad = false;

          this.Data = [...data.estado_cuenta];
          console.log(this.Data);

          this.Cliente = { ...data.cliente };
          
          this._TablasService.datosTablaStorage = [...data.estado_cuenta];
          this._TablasService.total = data.estado_cuenta.length;
          this._TablasService.busqueda = "";
          this.refreshCountries();
          // console.log("[getEstadoCuenta]",data);
          
          this.Facturas_Promedios = [ ...data.diasFacturas ];
          this.Facturas_Promedios_total = data.diasPromedio ;

          this.isLoadingTableDynamic = false;
        },
        (error) => {
          this.isLoad = false;
          this.isLoadingTableDynamic = false;
        }
      );
  }

  descargarPDF() {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Descargando el archivo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._LogisticaService
      .getEstadoCuentaClientePDF(this.ClienteId)
      .subscribe((data) => {
        // console.log(data);
        this._HelpersService.downloadFile(
          data,
          `Estado_Cuenta_${
            this.ClienteId
          }_${this._HelpersService.changeformatDate(
            this._HelpersService.currentFullDay(),
            "MM/DD/YYYY HH:mm:ss",
            "DD-MM-YYYY_HH:mm:ss"
          )}`
        );
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire("", "Descarga Completada", "success");
      });
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Data].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
