import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { Regalo } from "app/shared/models/Regalo";
import { RegaloService } from "../../../shared/services/regalo.service";
import { ProductosService } from "../../../shared/services/productos.service";
import { CommunicationService } from "../../../shared/services/communication.service";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Producto } from "../../../shared/models/Producto.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-regalos-list",
  templateUrl: "./regalos-list.component.html",
  styleUrls: ["./regalos-list.component.css"],
})
export class RegalosListComponent implements OnInit {
  @ViewChild("modalProductoEditar") modalP: ElementRef<any>;
  @Input() id: number;
  regaloSelected: Regalo;
  regalos: Regalo[] = [];
  // @Output() FormsValues = new EventEmitter<any>();
  loading: boolean = false;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _RegaloService: RegaloService,
    private modalService: NgbModal,
    private _CommunicationService: CommunicationService
  ) {}

  ngOnInit(): void {
    // console.log(this.id);
    this._CommunicationService.RefreshList.subscribe(() => {
      this.getRegalos();
    });

    this.getRegalos();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  getRegalos() {
    this.loading = true;
    this._RegaloService.getRegalosXProducto(this.id).subscribe((regalos) => {
      // console.log(regalos);
      this.loading = false;
      this.regalos = regalos;
    });
  }

  eliminar({ id }: Regalo) {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    })
      .fire({
        title: "¿Estás seguro?",
        text: "Este regalo se eliminará y no podrás recuperarlo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            title: "Eliminando el regalo",
            text: "Esto puede demorar un momento.",
            timerProgressBar: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          this._RegaloService.deleteRegalo(id).subscribe((response) => {
            this.getRegalos();
            Swal.mixin({
              customClass: {
                container: this.themeSite, // Clase para el modo oscuro
              },
            }).fire({
              text: response[0],
              icon: "success",
            });
          });
        }
      });
  }

  editarRegalo(regalo: Regalo) {
    this.regaloSelected = regalo;

    this.modalService
      .open(this.modalP, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        () => {},
        (reason) => {
          // console.log(reason);
        }
      );
  }

  FormsValues(regalo: Regalo) {
    // console.log(regalo);
    this._RegaloService
      .updateRegalo(regalo.data.stock, regalo.id)
      .subscribe((response) => {
        this.getRegalos();
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: response[0],
          icon: "success",
        });
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
