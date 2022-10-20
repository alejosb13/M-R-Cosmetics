import { Component, OnInit } from "@angular/core";
import { Usuario } from "app/shared/models/Usuario.model";
import { ConfiguracionService } from "app/shared/services/configuracion.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
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

  constructor(
    public _UsuariosService: UsuariosService,
    public _ConfiguracionService: ConfiguracionService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
    });
  }

  sendDataMigracion() {
    if(this.idClientes.length > 0){
      this.isLoad = true;
      Swal.fire({
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
                Swal.fire({
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
                Swal.fire({
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
}
