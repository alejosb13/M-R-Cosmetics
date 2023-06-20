import { Component, OnInit } from "@angular/core";
import { ConfiguracionService } from "app/shared/services/configuracion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-cierre-config",
  templateUrl: "./cierre-config.component.html",
  styleUrls: ["./cierre-config.component.css"],
})
export class CierreConfigComponent implements OnInit {
  constructor(private _ConfiguracionService: ConfiguracionService) {}

  statusCierre: number;

  ngOnInit(): void {
    this.getCierre();
  }

  getCierre() {
    this._ConfiguracionService.getCierraConfig().subscribe(({ data }) => {
      // console.log(data);
      this.statusCierre = data.cierre;
    });
  }

  actualizarCierre() {
    Swal.fire({
      title: "Modificando el estado del cierre",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._ConfiguracionService.updateCierraConfig().subscribe(({data}) => {
      // console.log(data);
      if (data.cierre == 1) {
        Swal.fire({
          text: "Cierre activado",
          icon: "success",
        });
      } else {
        Swal.fire({
          text: "Cierre desactivado",
          icon: "success",
        });
      }
      this.getCierre();
    });
  }
}
