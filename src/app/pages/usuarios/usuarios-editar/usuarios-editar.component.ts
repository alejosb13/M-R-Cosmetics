import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UsuarioServ } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import Swal from "sweetalert2";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-usuarios-editar",
  templateUrl: "./usuarios-editar.component.html",
  styleUrls: ["./usuarios-editar.component.css"],
})
export class UsuariosEditarComponent implements OnInit {
  UsuarioId: number;

  constructor(
    route: ActivatedRoute,
    private _UsuariosService: UsuariosService,
    private _HelpersService: HelpersService,
    private modalService: NgbModal
  ) {
    this.UsuarioId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {}

  ValuesForm(usuario: UsuarioServ) {
    Swal.fire({
      title: "Editando el usario",
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

    this._UsuariosService.updateUsuario(this.UsuarioId, usuario).subscribe(
      (data) => {
        this._UsuariosService.isLoad = false;

        // console.log(data);
        Swal.fire({
          text: "Usuario modificado con exito",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) window.location.reload();
        });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
        // console.log(HttpErrorResponse );
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

  FormPassword(password: any) {
    this._UsuariosService.updatePassword(this.UsuarioId, password).subscribe(
      (data) => {
        // console.log(data);
        Swal.fire({
          text: "Contraseña modificada",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) window.location.reload();
        });
      },
      (HttpErrorResponse: HttpErrorResponse) => {
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

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
