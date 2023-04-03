import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UsuarioServ } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-usuario-insertar",
  templateUrl: "./usuario-insertar.component.html",
  styleUrls: ["./usuario-insertar.component.css"],
})
export class UsuarioInsertarComponent implements OnInit {
  constructor(
    private router: Router,
    private _UsuariosService: UsuariosService,
    private _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {}

  ValuesForm(usuario: UsuarioServ) {
    Swal.fire({
      title: "Creando el usario",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._UsuariosService.isLoad = true;

    this._UsuariosService.insertUsuario(usuario).subscribe(
      (UsuarioResponse) => {
        this._UsuariosService.isLoad = false;

        Swal.fire({
          text: "Usuario agregado con exito",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed)
            this.router.navigate([`usuario/editar/${UsuarioResponse.id}`]);
        });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        let error: string =
          this._HelpersService.errorResponse(HttpErrorResponse);
        this._UsuariosService.isLoad = false;

        Swal.fire({
          title: "Error",
          html: error,
          icon: "error",
        });
      }
    );
  }
}
