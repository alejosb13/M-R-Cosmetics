import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Frecuencia } from "app/shared/models/Frecuencia.model";
import { FrecuenciaFacturaService } from "app/shared/services/frecuenciaFactura.service";
import { HelpersService } from "app/shared/services/helpers.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-frecuencia-factura-insertar',
  templateUrl: './frecuencia-factura-insertar.component.html',
  styleUrls: ['./frecuencia-factura-insertar.component.css']
})
export class FrecuenciaFacturaInsertarComponent implements OnInit {
  constructor(
    // private _ClientesService: ClientesService,
    private _FrecuenciaFacturaService:FrecuenciaFacturaService,
    private router: Router,
    private _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {}

  ValuesForm(frecuencia: Frecuencia) {
    Swal.fire({
      title: "Creando la frecuencia",
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
    this._FrecuenciaFacturaService.insertFrecuencia(frecuencia).subscribe(
      (data) => {
        this._FrecuenciaFacturaService.isLoad = false;

        console.log(data);
        Swal.fire({
          text: "Frecuencia insertada con exito",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate([`frecuencia-factura/editar/${data.id}`]);
          }
        });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        this._FrecuenciaFacturaService.isLoad = false;

        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);
        console.log(error);

        Swal.fire({
          title: "Error",
          html: error,
          icon: "error",
        });
      }
    );
  }

}
