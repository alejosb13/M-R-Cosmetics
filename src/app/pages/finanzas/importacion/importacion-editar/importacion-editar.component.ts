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
import { Importacion } from "../../../../shared/models/Importacion.model";

@Component({
  selector: "app-importacion-editar",
  templateUrl: "./importacion-editar.component.html",
  styleUrls: ["./importacion-editar.component.scss"],
})
export class ImportacionEditarComponent {
  userId: number;
  Id: number;
  constructor(
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.route.paramMap.subscribe((params: ParamMap) => {
      // console.log(params.get("id"));
      this.Id = Number(params.get("id"));
    });
  }

  FormsValues(productoDetalle: Importacion) {
    console.log(productoDetalle);
    // return;
    Swal.fire({
      title: "Creando inversión",
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
      .updateImportacion(
        { importacion: {...productoDetalle}, userId: this.userId },
        this.Id
      )
      .subscribe(
        (data) => {
          Swal.fire({
            text: "Inversión modificada con exito!",
            icon: "success",
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
