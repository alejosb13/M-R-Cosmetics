import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Cliente, ClienteCheck } from "app/shared/models/Cliente.model";
import { Usuario } from "app/shared/models/Usuario.model";
import { TablasService } from "app/shared/services/tablas.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-list-client-migration",
  templateUrl: "./list-client-migration.component.html",
  styleUrls: ["./list-client-migration.component.css"],
})
export class ListClientMigrationComponent implements OnInit, OnChanges {
  @Input() UserId: number = null;
  @Output() idClientesEvent: EventEmitter<any> = new EventEmitter();

  isLoad: boolean = false;

  clientes: ClienteCheck[] = [];

  idClientes: number[] = [];

  selectAll: boolean = true;

  constructor(
    public _UsuariosService: UsuariosService,
    public _TablasService: TablasService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("changes", changes);

    if (this.UserId) this.getClientesByUserId(this.UserId);
  }

  getClientesByUserId(userId: number) {
    this.isLoad = true;
    this._UsuariosService
      .getUsuarioById(userId)
      .pipe(
        map((usuario: Usuario) => {
          let clientes: ClienteCheck[] = usuario.clientes.map((clientes) => ({
            ...clientes,
            checked: false,
          }));
          return clientes;
        })
      )
      .subscribe(
        (clientes: ClienteCheck[]) => {
          console.log("clientes", clientes);

          this.isLoad = false;
          this._TablasService.datosTablaStorage = clientes;
          this.clientes = clientes;
          this.refreshListClient();
        },
        (error) => {
          this.isLoad = true;
        }
      );
  }

  inputChange({ checked, value }: HTMLInputElement) {
    if (checked) this.idClientes = [...this.idClientes, Number(value)];
    else
      this.idClientes = this.idClientes.filter(
        (idCliente) => idCliente !== Number(value)
      );

    this.refreshListClient();
    console.log("idClientes", this.idClientes);
  }

  buscar() {
    let camposPorFiltrar: any[] = [["nombreCompleto"], ["id"]];
    this._TablasService.buscarEnCampos(this.clientes, camposPorFiltrar);
  }

  allSelected() {
    if (this.selectAll) {
      this.clientes = this.clientes.map((cliente) => {
        cliente.checked = true;
        this.idClientes = [...this.idClientes, cliente.id];

        return cliente;
      });
    } else {
      this.clientes = this.clientes.map((cliente) => {
        cliente.checked = false;
        return cliente;
      });

      this.idClientes = [];
    }

    const clientesUnicos = new Set(this.idClientes);
    this.idClientes = [...clientesUnicos];

    this.selectAll = !this.selectAll;

    this.refreshListClient();
    console.log("idClientes", this.idClientes);
    console.log("selectAll", this.selectAll);
  }

  refreshListClient() {
    this.idClientesEvent.next(this.idClientes);
  }
}
