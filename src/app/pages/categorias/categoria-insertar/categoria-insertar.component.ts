import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Categoria } from "app/shared/models/Categoria.model";
import { CategoriaService } from "app/shared/services/categoria.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-categoria-insertar",
  templateUrl: "./categoria-insertar.component.html",
  styleUrls: ["./categoria-insertar.component.css"],
})
export class CategoriaInsertarComponent implements OnInit {
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    // private _ClientesService: ClientesService,
    public _CategoriaService: CategoriaService,
    private router: Router,
    private _HelpersService: HelpersService,
    private _CommunicationService: CommunicationService,
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  ValuesForm(categoria: Categoria) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Creando la categoria",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._CategoriaService.isLoad = true;

    this._CategoriaService.insertCategoria(categoria).subscribe(
      (data) => {
        this._CategoriaService.isLoad = false;

        console.log(data);
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "Categoria insertada con exito",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate([`categoria/editar/${data.id}`]);
          }
        });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);
        console.log(error);
        this._CategoriaService.isLoad = false;

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
}
