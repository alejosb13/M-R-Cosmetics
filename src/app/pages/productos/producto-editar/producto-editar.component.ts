import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Producto } from "app/shared/models/Producto.model";
import { ClientesService } from "app/shared/services/clientes.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ProductosService } from "app/shared/services/productos.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-producto-editar",
  templateUrl: "./producto-editar.component.html",
  styleUrls: ["./producto-editar.component.css"],
})
export class ProductoEditarComponent implements OnInit {
  productoId: number;
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    route: ActivatedRoute,
    private _ProductosService: ProductosService,
    // private fb: FormBuilder,
    // private _FrecuenciaService: FrecuenciaService,
    private _HelpersService: HelpersService
  ) {
    this.productoId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  ProductoValuesForm(producto: Producto) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Modificando producto",
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

    this._ProductosService.updateProducto(this.productoId, producto).subscribe(
      (data) => {
        // console.log(data);
        this._ProductosService.IsLoad = false;

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "Producto modificado con exito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) window.location.reload();
          });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        // console.log(HttpErrorResponse );
        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);
        this._ProductosService.IsLoad = false;

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
