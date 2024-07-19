import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Listado } from "@app/shared/services/listados.service";
import { Usuario } from "app/shared/models/Usuario.model";
import { ConfiguracionService } from "app/shared/services/configuracion.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-migrar-informacion-vendedor",
  templateUrl: "./migrar-informacion-vendedor.component.html",
  styleUrls: ["./migrar-informacion-vendedor.component.css"],
})
export class MigrarInformacionVendedorComponent implements OnInit {
  currentUSerID: number;
  migrationUserID: number;
  userIdString: string;
  userStore: Usuario[];

  idClientes: number[] = [];

  isLoad: boolean = false;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _UsuariosService: UsuariosService,
    public _ConfiguracionService: ConfiguracionService,
    public _Listado: Listado,
  ) {}

  ngOnInit(): void {
    this.getUsers();

    this.themeSubscription = this._CommunicationService
    .getTheme()
    .subscribe((color: string) => {
      this.themeSite = color === "black" ? "dark-mode" : "light-mode";
    });
  }

  getUsers() {
    this._Listado
      .UsuariosList({
        disablePaginate: 1,
        estado: 1,
        // factura: 1,
        // recibo: 1,
        // recibosRangosSinTerminar: 1,
      }).subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
    });
  }

  sendDataMigracion() {
    if(this.idClientes.length > 0){
      this.isLoad = true;
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        title: "¿Estas seguro?",
        text: "Una vez que realices este proceso no podrás revertirlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34b5b8",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, estoy seguro",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this._ConfiguracionService
            .migracion(this.currentUSerID, this.migrationUserID, this.idClientes)
            .subscribe(
              (data: any) => {
                this.isLoad = false;
  
                console.log(data);
                Swal.mixin({
                  customClass: {
                    container: this.themeSite, // Clase para el modo oscuro
                  },
                }).fire({
                  text: data.mensaje,
                  icon: "success",
                });
                this.currentUSerID = null
                this.idClientes = []
                this.migrationUserID = 0
              },
              (error) => {
                console.log(error);
  
                this.currentUSerID = null
                this.isLoad = false;
                this.idClientes = []
                this.migrationUserID = 0
                Swal.mixin({
                  customClass: {
                    container: this.themeSite, // Clase para el modo oscuro
                  },
                }).fire({
                  title: "Error",
                  text: "Hay un problema al realizar el proceso",
                  icon: "error",
                });
              }
            );
        } else {
          this.isLoad = false;
        }
      });
      
    }
  }

  get valitData(): boolean {
    return this.currentUSerID &&
      this.migrationUserID &&
      this.currentUSerID > 0 &&
      this.migrationUserID > 0
      ? true
      : false;
  }

  listadoIdClientes(IdClientes: number[]) {
    console.log("listadoIdClientes()", IdClientes);

    this.idClientes = IdClientes;
  }

  get validacionPasos() {
    return {
      paso2: this.idClientes.length > 0,
      paso3: this.migrationUserID > 0,
    };
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
