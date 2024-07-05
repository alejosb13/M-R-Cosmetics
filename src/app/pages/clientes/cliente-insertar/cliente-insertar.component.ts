import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Cliente } from "app/shared/models/Cliente.model";
import { ClientesService } from "app/shared/services/clientes.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-cliente-insertar",
  templateUrl: "./cliente-insertar.component.html",
  styleUrls: ["./cliente-insertar.component.css"],
})
export class ClienteInsertarComponent implements OnInit {
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _ClientesService: ClientesService,
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

  ClientValuesForm(cliente: Cliente) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Creando cliente",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._ClientesService.IsLoad = true;
    this._ClientesService.insertCliente(cliente).subscribe(
      (ClienteResponse) => {
        this._ClientesService.IsLoad = false;
        console.log(ClienteResponse);
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        })
          .fire({
            text: "Cliente Insertado con exito",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.router.navigate([`cliente/editar/${ClienteResponse.id}`]);
            }
          });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        this._ClientesService.IsLoad = false;
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
}
