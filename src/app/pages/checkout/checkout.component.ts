import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { UserAuth } from "app/auth/login/models/auth.model";
import { AuthService } from "app/auth/login/service/auth.service";
import { Cliente } from "app/shared/models/Cliente.model";
import { FacturaCheckout } from "app/shared/models/FacturaCheckout.model";
import { FacturaDetalle } from "app/shared/models/FacturaDetalle.model";
import { FrecuenciaFactura } from "app/shared/models/FrecuenciaFactura.model";
import { FiltrosList } from "app/shared/models/Listados.model";
import { Recibo } from "app/shared/models/Recibo.model";
import { CheckoutService } from "app/shared/services/checkout.service";
import { ClientesService } from "app/shared/services/clientes.service";
import { FrecuenciaFacturaService } from "app/shared/services/frecuenciaFactura.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { Listado } from "app/shared/services/listados.service";
import { ReciboService } from "app/shared/services/recibo.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { Observable, Subject, merge, OperatorFunction, of, Subscription } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
  switchMap,
} from "rxjs/operators";

import Swal, { SweetAlertOptions } from "sweetalert2";
import { catchError } from "rxjs/operators";
import { CommunicationService } from "@app/shared/services/communication.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  model: any;
  searching = false;
  searchFailed = false;
  showDelete = false;

  productos: FacturaDetalle[] = [];
  factura: FacturaCheckout;
  clientes: Cliente[];

  clienteSelected: boolean = false;
  clienteData: Cliente;

  date: string = "";
  frecuenciaSelected: number;
  frecuenciaFacturas: FrecuenciaFactura[];

  ClientesNames: string[] = [];

  userData: UserAuth;

  cliente: string;

  roleName: string;

  userId: number;
  recibo: Recibo;
  numeroRecibo: number = 0;
  isAdmin: boolean;
  isLoad: boolean = false;
  isSupervisor: boolean;

  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _location: Location,
    public _CheckoutService: CheckoutService,
    private _ClientesService: ClientesService,
    private _HelpersService: HelpersService,
    private _ReciboService: ReciboService,
    private _UsuariosService: UsuariosService,
    private _AuthService: AuthService,
    private _FrecuenciaFacturaService: FrecuenciaFacturaService,
    private router: Router,
    private _Listado: Listado
  ) {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.roleName = String(this._AuthService.dataStorage.user.roleName);
  }

  ngOnInit(): void {
    this.getNumeroRecibo();
    this.getReciboUSer();
    this.getProducts();
    this.getcheckout();
    // this.getClientes();
    this.getDataUser();
    this.getFrecuenciafactura();
    // console.log("Factura",this.factura);
    // console.log("Factura",(this.factura.tipo_venta == 1 && this.factura.tipo_venta));
  
    this.themeSubscription = this._CommunicationService
    .getTheme()
    .subscribe((color: string) => {
      this.themeSite = color === "black" ? "dark-mode" : "light-mode";
    });
  }

  getClientes() {
    // this._ClientesService
    //   .getCliente()
    //   .pipe(
    //     map((clientes) => {
    //       if (this.isAdmin || this.isSupervisor) return clientes;

    //       return clientes.filter((cliente) => cliente.user_id == this.userId);
    //     })
    //   )
    //   .subscribe((clientes: Cliente[]) => {
    //     this.clientes = [...clientes];
    //     this.ClientesNames = clientes.map(
    //       (cliente) => `${cliente.id} - ${cliente.nombreCompleto}`
    //     );
    //     console.log(clientes);

    //     // this.ValidClienteSelected();
    //   });

    let listadoFilter: FiltrosList = {
      userId: this.isAdmin || this.isSupervisor ? 0 : this.userId,
      categoriaId: 0, // todas las categorias
      allDates: true, // todos los dias
      roleName: this.roleName,
      link: null,
      disablePaginate: 1,
    };

    this._Listado
      .clienteListCarrito(listadoFilter)
      .subscribe((clientes: Cliente[]) => {
        this.clientes = [...clientes];
        this.ClientesNames = clientes.map(
          (cliente) => `${cliente.id} - ${cliente.nombreCompleto}`
        );
      });
  }

  getFrecuenciafactura() {
    this._FrecuenciaFacturaService.getFrecuencia().subscribe((frecuencias) => {
      this.frecuenciaFacturas = [...frecuencias];
      console.log(this.frecuenciaFacturas);

      // this.ValidClienteSelected();
    });
  }

  eventInputTypeHead(event: { item: string }) {
    // console.log("test ~ event:", event)
    this.showDelete = true;
  }

  eliminarCliente() {
    this.model = "";
    this.showDelete = false;

    this.clienteSelected = false;
    this.clienteData = null;
  }

  search2: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        let listadoFilter: FiltrosList = {
          userId: this.isAdmin || this.isSupervisor ? 0 : this.userId,
          categoriaId: 0, // todas las categorias
          allDates: true, // todos los dias
          roleName: this.roleName,
          link: null,
          filter: term,
          saldo: false,
        };

        return this._Listado.clienteListCarrito(listadoFilter).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      map((value) => {
        // console.log(value);

        this.clientes = [...value];
        let ClientesNames = value.map(
          (cliente) => `${cliente.id} - ${cliente.nombreCompleto}`
        );

        return ClientesNames;
      }),
      tap(() => (this.searching = false))
    );
  };

  getNumeroRecibo() {
    // this._ReciboService.getNumeroRecibo(25).subscribe((data:any) => {
    this._ReciboService.getNumeroRecibo(this.userId).subscribe(
      (data: any) => {
        console.log("[recibo]: ", data);
        // this.AbonoForm.get("recibo").patchValue(data.numero)
        this.numeroRecibo = data.numero;
      },
      () => {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          title: "No posee un numero de recibo.",
          text: "Pide que asignen un talonario de recibos.",
          icon: "error",
        });
      }
    );
  }

  getReciboUSer() {
    this._UsuariosService.getUsuarioById(this.userId).subscribe((usuario) => {
      // this._UsuariosService.getUsuarioById(25).subscribe((usuario) => {
      // console.log("[getReciboUSer]",usuario);

      this.recibo = usuario.recibo;
    });
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === ""
          ? [...this.ClientesNames]
          : [...this.ClientesNames].filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  getDataUser() {
    this.userData = this._AuthService.dataStorage.user;
  }

  ValidClienteSelected() {
    if (this.factura.cliente_id) {
      this.clienteData = this.clientes.find(
        (cliente) => cliente.id == this.factura.cliente_id
      );

      // this.date = this._HelpersService.addDaytoDate(
      //   Number(this.clienteData.frecuencia.dias),
      //   "YYYY-MM-DD"
      // );
    }
  }

  getProducts() {
    this.productos = this._CheckoutService.getProductCheckout();
  }

  isValidForm() {
    return this.clienteSelected && this.date;
  }

  getcheckout() {
    this.factura = this._CheckoutService.getCheckout();
  }

  backClicked() {
    this._location.back();
  }

  dataChangedCliente(value: string) {
    this.cambiarValores({ name: "cliente", value });
  }

  cambiarValores(element: any) {
    let FacturaCheckout: FacturaCheckout = { ...this.factura };
    FacturaCheckout.tipo_venta = 1; // 2 = contado , 1 = credito

    console.log(element);

    if (element.name == "cliente") {
      this.clienteSelected = false;
      if (element.value.includes("-")) {
        // console.log(element.value.split("-"));
        let split: string[] = element.value.split("-");
        let id = Number(split[0].trim());

        console.log("IdCliente", id);
        // console.log(this.cliente);

        FacturaCheckout.cliente_id = id;
        // FacturaCheckout.cliente_id = Number(element.value)
        this._CheckoutService.CheckoutToStorage(FacturaCheckout);

        this.clienteSelected = true;
        this.getcheckout();
        this.ValidClienteSelected();
      }
    }

    if (element.name == "tipo_venta") {
      FacturaCheckout.tipo_venta = Number(element.value);
      this._CheckoutService.CheckoutToStorage(FacturaCheckout);

      this.getcheckout();
    }
  }

  cambiarFrecuencia(element: HTMLSelectElement) {
    console.log(element);
    console.log(element.value);

    this.date = this._HelpersService.addDaytoDate(
      Number(element.value),
      "YYYY-MM-DD"
    );

    console.log(this.date);
    // let FacturaCheckout: FacturaCheckout = { ...this.factura };

    // if (element.name == "cliente") {
    //   this.clienteSelected = false;
    //   if (element.value.includes("-")) {
    //     // console.log(element.value.split("-"));
    //     let split: string[] = element.value.split("-");
    //     let id = Number(split[0].trim());

    //     console.log("IdCliente", id);
    //     // console.log(this.cliente);

    //     FacturaCheckout.cliente_id = id;
    //     // FacturaCheckout.cliente_id = Number(element.value)
    //     this._CheckoutService.CheckoutToStorage(FacturaCheckout);

    //     this.clienteSelected = true;
    //     this.getcheckout();
    //     this.ValidClienteSelected();
    //   }
    // }

    // if (element.name == "tipo_venta") {
    //   FacturaCheckout.tipo_venta = Number(element.value);
    //   this._CheckoutService.CheckoutToStorage(FacturaCheckout);

    //   this.getcheckout();
    // }
  }

  deleteProduct(productoCheckout: FacturaDetalle) {
    console.log(productoCheckout);

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "¿Estás seguro?",
      text: "Este producto se eliminará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34b5b8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._CheckoutService.deleteProductCheckout(productoCheckout);
        this.getProducts();
        this.getcheckout();
      }
    });
  }

  async generarfactura() {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Creando factura",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.isLoad = true;

    if (!this.hasErrorValidation()) {
      let FacturaCheckout: FacturaCheckout = { ...this.factura };

      FacturaCheckout.fecha_vencimiento = this._HelpersService.changeformatDate(
        this.date,
        "YYYY-MM-DD",
        "YYYY-MM-DDThh:mm:ss"
      );
      FacturaCheckout.user_id = this.userData.userId;
      FacturaCheckout.status_pagado =
        FacturaCheckout.tipo_venta == 1 ? false : true;
      FacturaCheckout.iva = 0;
      FacturaCheckout.estado = 1;
      FacturaCheckout.despachado = 0;

      this._CheckoutService.CheckoutToStorage(FacturaCheckout);
      this.getcheckout();

      let facturaRecibo: any = {
        ...this.factura,
        numero: this.numeroRecibo,
        recibo_id: this.recibo.id,
        rango: `${this.recibo.min}-${this.recibo.max}`,
      };

      console.log("[facturaRecibo]", facturaRecibo);

      this._CheckoutService.insertFactura(facturaRecibo).subscribe(
        (data) => {
          this.isLoad = false;
          this._CheckoutService.vaciarCheckout();

          if (data.status) {
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              title: "¡Pedido Generado!",
              text: "Su pedido fue generado con exito",
              icon: "success",
              confirmButtonColor: "#34b5b8",
              confirmButtonText: "Ok",
            }).then((result) =>
              this.router.navigateByUrl(`/factura/detalle/${data.factura_id}`)
            );
          } else {
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              title: "Error",
              text: "Error generando la factura",
              icon: "error",
            });
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.isLoad = false;
          let option: SweetAlertOptions = {
            title: "Error",
            icon: "error",
          };

          if (errorResponse.error.cliente) {
            option.html = errorResponse.error.mensaje;
          } else {
            option.text = errorResponse.error.mensaje;
          }
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire(option);
        }
      );
    }
  }

  private hasErrorValidation(): boolean {
    let error: boolean = false;
    let mensaje: string = "";
    let FacturaCheckout: FacturaCheckout = { ...this.factura };

    if (!FacturaCheckout.tipo_venta) {
      mensaje = "Seleccione la operacion de pago.";
      error = true;
    }

    if (!FacturaCheckout.cliente_id) {
      mensaje = "Seleccione un cliente.";
      error = true;
    }

    if (this.numeroRecibo == 0) {
      mensaje = "Necesita un número de recibo para generar una factura.";
      error = true;
    }

    if (error) {
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        title: "¡Error!",
        text: mensaje,
        icon: "warning",
        confirmButtonColor: "#34b5b8",
        confirmButtonText: "Volver",
      });
    }

    return error;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
