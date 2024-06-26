import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "app/auth/login/service/auth.service";
import {
  InversionesTotales,
  InversionGeneral,
} from "app/shared/models/Inversion.model";
import { FinanzasService } from "app/shared/services/finanzas.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-inversion-editar",
  templateUrl: "./inversion-editar.component.html",
  styleUrls: ["./inversion-editar.component.scss"],
})
export class InversionEditarComponent {
  userId: number;
  Id: number;
  constructor(
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.route.paramMap.subscribe((params: ParamMap) => {
      // console.log(params.get("id"));
      this.Id = Number(params.get("id"));
    });
  }

  FormsValues(productoDetalle: {
    InversionGeneral: InversionGeneral;
    Totales: InversionesTotales;
  }) {
    Swal.fire({
      title: "Creando importación",
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
      .updateInversion({ ...productoDetalle, userId: this.userId }, this.Id)
      .subscribe(
        (data) => {
          Swal.fire({
            text: "Importación modificada con éxito!",
            icon: "success",
          });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          // console.log(HttpErrorResponse);
          
          let error = HttpErrorResponse.error;

          Swal.fire({
            title: "Error",
            html: error.mensaje,
            icon: "error",
          });
        }
      );
  }
}
