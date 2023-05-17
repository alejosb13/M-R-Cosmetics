import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Frecuencia } from "app/shared/models/Frecuencia.model";
import { FrecuenciaFacturaService } from "app/shared/services/frecuenciaFactura.service";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-frecuencia-factura-editar',
  templateUrl: './frecuencia-factura-editar.component.html',
  styleUrls: ['./frecuencia-factura-editar.component.css']
})
export class FrecuenciaFacturaEditarComponent implements OnInit {
  frecuenciaId: number;
  constructor(
    route: ActivatedRoute,
    private _FrecuenciaFacturaService:FrecuenciaFacturaService,
    private _HelpersService: HelpersService
  ) {
    this.frecuenciaId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {}

  ValuesForm(frecuencia: Frecuencia) {
    Swal.fire({
      title: "Editando la Frecuencia",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._FrecuenciaFacturaService.isLoad = true;
    this._FrecuenciaFacturaService
      .updateFrecuencia(this.frecuenciaId, frecuencia)
      .subscribe(
        (data) => {
          this._FrecuenciaFacturaService.isLoad = false;

          // console.log(data);
          Swal.fire({
            text: "Frecuencia modificada con exito",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) window.location.reload();
          });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          this._FrecuenciaFacturaService.isLoad = false;

          // console.log(HttpErrorResponse );
          let error: string =
            this._HelpersService.errorResponse(HttpErrorResponse);

          Swal.fire({
            title: "Error",
            html: error,
            icon: "error",
          });
        }
      );
  }

}
