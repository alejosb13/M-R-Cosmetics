import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/auth/login/service/auth.service";
import {
  InversionesTotales,
  InversionGeneral,
} from "app/shared/models/Inversion.model";
import { FinanzasService } from "app/shared/services/finanzas.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-inversion-insertar",
  templateUrl: "./inversion-insertar.component.html",
  styleUrls: ["./inversion-insertar.component.scss"],
})
export class InversionInsertarComponent {
  userId: number;

  constructor(
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
  }

  FormsValues(productoDetalle: {
    InversionGeneral: InversionGeneral;
    Totales: InversionesTotales;
  }) {
    Swal.fire({
      title: "Modificando inversión",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    // console.log("retorno: ", productoDetalle);
    this._FinanzasService
      .insertInversion({ ...productoDetalle, userId: this.userId })
      .subscribe(
        (data) => {
          Swal.fire({
            text: "Inversión creada con exito!",
            icon: "success",
          }).then((result) => {
            return this._router.navigateByUrl("/finanzas/inversion");
          });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          let error: string = HttpErrorResponse.error[0];

          Swal.fire({
            title: "Error",
            html: error,
            icon: "error",
          });
        }
      );
  }
}
