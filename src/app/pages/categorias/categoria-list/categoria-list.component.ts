import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/auth/login/service/auth.service";
import { Categoria } from "app/shared/models/Categoria.model";
import { CategoriaService } from "app/shared/services/categoria.service";
import { TablasService } from "app/shared/services/tablas.service";
import { environment } from "environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-categoria-list",
  templateUrl: "./categoria-list.component.html",
  styleUrls: ["./categoria-list.component.css"],
})
export class CategoriaListComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Categorias: Categoria[];
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;

  constructor(
    private _CategoriaService: CategoriaService,
    private _AuthService: AuthService,
    private _TablasService: TablasService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();

    this.asignarValores();
  }

  asignarValores() {
    this.isLoad = true;

    this._CategoriaService.getCategoria().subscribe(
      (categoria: Categoria[]) => {
        // console.log(producto);

        this.Categorias = [...categoria];
        this._TablasService.datosTablaStorage = [...categoria];
        this._TablasService.total = categoria.length;
        this._TablasService.busqueda = "";

        this.refreshCountries();
        this.isLoad = false;
      },
      (error) => {
        this.isLoad = false;
      }
    );
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Categorias].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  BuscarValor() {
    let camposPorFiltrar: any[] = [["tipo"], ["valor_dias"], ["id"]];

    this._TablasService.buscarEnCampos(this.Categorias, camposPorFiltrar);

    if (this._TablasService.busqueda == "") {
      this.refreshCountries();
    }
  }

  condicionesToString(categoria: Categoria) {
    if (categoria.tipo == "LN") return "No permite ningun monto";
    if (categoria.condicion == 1) return "El pedido es mayor que monto máximo ";
    if (categoria.condicion == 2) return "El pedido es menor que monto minimo ";
    if (categoria.condicion == 3) return "El pedido es menor o igual que monto minimo ";
    if (categoria.condicion == 4) return "El pedido es mayor o igual que monto máximo ";
    if (categoria.condicion == 5) return "El pedido es entre el monto minimo y maximo";
  }

  condicionesNull(categoria: Categoria, condicion: string) {
    if (condicion == ">") {
      if (
        (categoria.condicion == 1 || categoria.condicion == 4) &&
        categoria.monto_maximo != 0
      ) {
        return this.currencyFormatter(categoria.monto_maximo);
      }
    }
    if (condicion == "<") {
      if (
        (categoria.condicion == 2 || categoria.condicion == 3) &&
        categoria.monto_menor != 0
      ) {
        return this.currencyFormatter(categoria.monto_menor);
      }
    }

    if (categoria.condicion == 5) {
      return this.currencyFormatter(categoria.monto_menor);
    }

    return "-";
  }

  currencyFormatter(value:number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency:"USD"
    }) 
    return formatter.format(value)
  }

  eliminar({ id }: Categoria) {
    // console.log(id);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta categoria se eliminará y no podrás recuperarla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._CategoriaService.deleteCategoria(id).subscribe((data) => {
          this.Categorias = this.Categorias.filter(
            (categoria) => categoria.id != id
          );
          this.refreshCountries();

          Swal.fire({
            text: data[0],
            icon: "success",
          });
        });
      }
    });
  }
}
