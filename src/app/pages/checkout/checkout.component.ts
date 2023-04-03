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
import { Recibo } from "app/shared/models/Recibo.model";
import { CheckoutService } from "app/shared/services/checkout.service";
import { ClientesService } from "app/shared/services/clientes.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ReciboService } from "app/shared/services/recibo.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { Observable, Subject, merge, OperatorFunction } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  productos: FacturaDetalle[] = [];
  factura: FacturaCheckout;
  clientes: Cliente[];

  clienteSelected: boolean = false;
  clienteData: Cliente;
  date: string;

  ClientesNames: string[] = [];

  userData: UserAuth;

  cliente: string;

  userId: number;
  recibo: Recibo;
  numeroRecibo: number = 0;
  isAdmin: boolean;
  isLoad: boolean = false;
  isSupervisor:boolean
  
  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private _location: Location,
    public _CheckoutService: CheckoutService,
    private _ClientesService: ClientesService,
    private _HelpersService: HelpersService,
    private _ReciboService: ReciboService,
    private _UsuariosService: UsuariosService,
    private _AuthService: AuthService,
    private router: Router
  ) {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor()
  }

  ngOnInit(): void {
    this.getNumeroRecibo();
    this.getReciboUSer();
    this.getProducts();
    this.getcheckout();
    this.getClientes();
    this.getDataUser();
    // console.log("Factura",this.factura);
    // console.log("Factura",(this.factura.tipo_venta == 1 && this.factura.tipo_venta));
  }

  getClientes() {
    this._ClientesService
      .getCliente()
      .pipe(
        map((clientes) => {
          if (this.isAdmin || this.isSupervisor) return clientes;
          
          return clientes.filter((cliente) => cliente.user_id == this.userId);
        })
      )
      .subscribe((clientes: Cliente[]) => {
        this.clientes = [...clientes];
        this.ClientesNames = clientes.map(
          (cliente) => `${cliente.id} - ${cliente.nombreCompleto}`
        );
        console.log(clientes);
        
        this.ValidClienteSelected();
      });
  }

  getNumeroRecibo() {
    // this._ReciboService.getNumeroRecibo(25).subscribe((data:any) => {
    this._ReciboService.getNumeroRecibo(this.userId).subscribe(
      (data: any) => {
        console.log("[recibo]: ", data);
        // this.AbonoForm.get("recibo").patchValue(data.numero)
        this.numeroRecibo = data.numero;
      },
      () => {
        Swal.fire({
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
      this.clienteSelected = true;

      this.clienteData = this.clientes.find(
        (cliente) => cliente.id == this.factura.cliente_id
      );
      // console.log(this.clienteData);

      this.date = this._HelpersService.addDaytoDate(
        Number(this.clienteData.frecuencia.dias),
        "YYYY-MM-DD"
      );
    }
  }

  getProducts() {
    this.productos = this._CheckoutService.getProductCheckout();
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

    if (element.name == "cliente") {
      if (element.value.includes("-")) {
        // console.log(element.value.split("-"));
        let split: string[] = element.value.split("-");
        let id = Number(split[0].trim());

        console.log("IdCliente", id);
        // console.log(this.cliente);

        FacturaCheckout.cliente_id = id;
        // FacturaCheckout.cliente_id = Number(element.value)
        this._CheckoutService.CheckoutToStorage(FacturaCheckout);

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

  deleteProduct(productoCheckout: FacturaDetalle) {
    console.log(productoCheckout);

    Swal.fire({
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
    Swal.fire({
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
            Swal.fire({
              title: "¡Pedido Generado!",
              text: "Su pedido fue generado con exito",
              icon: "success",
              confirmButtonColor: "#34b5b8",
              confirmButtonText: "Ok",
            }).then((result) =>
              this.router.navigateByUrl(`/factura/detalle/${data.factura_id}`)
            );
          } else {
            Swal.fire({
              title: "Error",
              text: "Error generando la factura",
              icon: "error",
            });
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);

          Swal.fire({
            title: "Error",
            text: errorResponse.error.mensaje,
            icon: "error",
          });
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
      Swal.fire({
        title: "¡Error!",
        text: mensaje,
        icon: "warning",
        confirmButtonColor: "#34b5b8",
        confirmButtonText: "Volver",
      });
    }

    return error;
  }
}
