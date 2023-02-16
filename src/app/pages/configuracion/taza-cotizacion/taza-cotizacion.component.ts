import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ConfiguracionService } from "../../../shared/services/configuracion.service";
import { AuthService } from "../../../auth/login/service/auth.service";
import { replaceAll } from "chartist";

@Component({
  selector: "app-taza-cotizacion",
  templateUrl: "./taza-cotizacion.component.html",
  styleUrls: ["./taza-cotizacion.component.css"],
  providers: [NgbModalConfig, NgbModal],
})
export class TazaCotizacionComponent implements OnInit {
  constructor(
    private _ConfiguracionService: ConfiguracionService,
    private _AuthService: AuthService,
    private config: NgbModalConfig,
    private modalService: NgbModal
  ) {}

  montoString: number | string = 0;
  tazaMonto: number = 0;
  isLoad: boolean = false;
  userId: number;
  modal: any;
  isValid: boolean= true

  ngOnInit(): void {
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.getTaza();
  }

  getTaza() {
    this.isLoad = true;
    this._ConfiguracionService.getTaza().subscribe(({ data }) => {
      console.log(data);
      this.tazaMonto = data.monto;
      this.montoString = data.monto;
      this.isLoad = false;
    });
  }

  openFiltros(content: any) {
    // this.modal = this.NgbModal.open(content, {
    //   ariaLabelledBy: "modal-basic-title",
    // }).result.then(
    //   (result) => {},
    //   (reason) => {}
    // );
    this.modalService.open(content);
  }

  actualizarTaza() {
    this._ConfiguracionService
      .setTaza(Number(this.montoString), this.userId)
      .subscribe((data) => {
        console.log(data);
        this.modalService.dismissAll();
        this.getTaza();
      });
  }

  dataChanged(event:KeyboardEvent) {
    let text = event.key
    const regex = new RegExp("[a-zA-Z,]*$", "g")
    
    // this.tazaMonto = Number(text.replace(regex , "")) 
    console.log(this.tazaMonto);

    
  }
}
