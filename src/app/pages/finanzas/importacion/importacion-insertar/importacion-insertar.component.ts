import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/auth/login/service/auth.service";
import { Importacion } from "app/shared/models/Importacion.model";
import { FinanzasService } from "app/shared/services/finanzas.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-importacion-insertar",
  templateUrl: "./importacion-insertar.component.html",
  styleUrls: ["./importacion-insertar.component.scss"],
})
export class ImportacionInsertarComponent {
  isAdmin: boolean;
  isSupervisor: boolean;
  userId: number;

  constructor(
    public _FinanzasService: FinanzasService,
    public _AuthService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);
  }

  FormsValues(ImportacionValues: Importacion) {
    Swal.fire({
      title: "Creando Importación",
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
      .insertImportacion({
        importacion: ImportacionValues,
        userId: this.userId,
      })
      .subscribe(
        (data) => {
          Swal.fire({
            text: "Importación creada con exito!",
            icon: "success",
          }).then((result) => {
            return this._router.navigateByUrl("/finanzas/importacion");
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
