import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { Regalo } from "app/shared/models/Regalo";
import { RegaloService } from "../../../shared/services/regalo.service";
import { ProductosService } from "../../../shared/services/productos.service";
import { CommunicationService } from "../../../shared/services/communication.service";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Producto } from "../../../shared/models/Producto.model";

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
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este regalo se eliminará y no podrás recuperarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._RegaloService.deleteRegalo(id).subscribe((response) => {
          this.getRegalos();
          Swal.fire({
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
        Swal.fire({
          text: response[0],
          icon: "success",
        });

      });
  }
}
