import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Frecuencia } from "app/shared/models/Frecuencia.model";
import { FrecuenciaService } from "app/shared/services/frecuencia.service";
import { TablasService } from "app/shared/services/tablas.service";
import { environment } from "environments/environment";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-frecuencia-listado",
  templateUrl: "./frecuencia-listado.component.html",
  styleUrls: ["./frecuencia-listado.component.css"],
})
export class FrecuenciaListadoComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Frecuencias: Frecuencia[];
  isLoad: boolean;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _FrecuenciaService: FrecuenciaService,
    private _TablasService: TablasService
  ) {}

  ngOnInit(): void {
    this.asignarValores();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  asignarValores() {
    this.isLoad = true;

    this._FrecuenciaService.getFrecuencia().subscribe(
      (frecuencia: Frecuencia[]) => {
        // console.log(producto);

        this.Frecuencias = [...frecuencia];
        this._TablasService.datosTablaStorage = [...frecuencia];
        this._TablasService.total = frecuencia.length;
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
    this._TablasService.datosTablaStorage = [...this.Frecuencias].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  BuscarValor() {
    this._TablasService.buscar(this.Frecuencias);

    if (this._TablasService.busqueda == "") {
      this.refreshCountries();
    }
  }

  eliminar({ id }: Frecuencia) {
    // console.log(id);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Esta categoria se eliminará y no podrás recuperarla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._FrecuenciaService.deleteFrecuencia(id).subscribe((data) => {
            this.Frecuencias = this.Frecuencias.filter(
              (categoria) => categoria.id != id
            );
            this.refreshCountries();

            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              text: data[0],
              icon: "success",
            });
          });
        }
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
