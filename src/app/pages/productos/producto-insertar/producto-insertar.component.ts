import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Producto } from "app/shared/models/Producto.model";
import { ClientesService } from "app/shared/services/clientes.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ProductosService } from "app/shared/services/productos.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-producto-insertar",
  templateUrl: "./producto-insertar.component.html",
  styleUrls: ["./producto-insertar.component.css"],
})
export class ProductoInsertarComponent implements OnInit {
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    // private _ClientesService: ClientesService,
    private _ProductosService: ProductosService,
    private router: Router,
    private _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  ProductValuesForm(producto: Producto) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Creando producto",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._ProductosService.IsLoad = true;

    this._ProductosService.insertProducto(producto).subscribe(
      (ProductoResponse) => {
        this._ProductosService.IsLoad = false;

        console.log(ProductoResponse);
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "Producto insertado con exito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([`producto/editar/${ProductoResponse.id}`]);
            }
          });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        this._ProductosService.IsLoad = false;

        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);
        console.log(error);

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          title: "Error",
          html: error,
          icon: "error",
        });
      }
    );
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
