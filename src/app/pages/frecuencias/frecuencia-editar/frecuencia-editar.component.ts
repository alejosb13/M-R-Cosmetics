import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Frecuencia } from "app/shared/models/Frecuencia.model";
import { CategoriaService } from "app/shared/services/categoria.service";
import { FrecuenciaService } from "app/shared/services/frecuencia.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-frecuencia-editar",
  templateUrl: "./frecuencia-editar.component.html",
  styleUrls: ["./frecuencia-editar.component.css"],
})
export class FrecuenciaEditarComponent implements OnInit {
  frecuenciaId: number;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    route: ActivatedRoute,
    private _FrecuenciaService: FrecuenciaService,
    private _HelpersService: HelpersService
  ) {
    this.frecuenciaId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  ValuesForm(frecuencia: Frecuencia) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
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
    this._FrecuenciaService.isLoad = true;
    this._FrecuenciaService
      .updateFrecuencia(this.frecuenciaId, frecuencia)
      .subscribe(
        (data) => {
          this._FrecuenciaService.isLoad = false;

          // console.log(data);
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          })
            .fire({
              text: "Frecuencia modificada con exito",
              icon: "success",
            })
            .then((result) => {
              if (result.isConfirmed) window.location.reload();
            });
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          this._FrecuenciaService.isLoad = false;

          // console.log(HttpErrorResponse );
          let error: string =
            this._HelpersService.errorResponse(HttpErrorResponse);

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
