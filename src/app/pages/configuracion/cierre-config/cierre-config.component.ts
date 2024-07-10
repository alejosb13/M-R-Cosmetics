import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { ConfiguracionService } from "app/shared/services/configuracion.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-cierre-config",
  templateUrl: "./cierre-config.component.html",
  styleUrls: ["./cierre-config.component.css"],
})
export class CierreConfigComponent implements OnInit {
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _ConfiguracionService: ConfiguracionService
  ) {}

  statusCierre: number;

  ngOnInit(): void {
    this.getCierre();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  getCierre() {
    this._ConfiguracionService.getCierraConfig().subscribe(({ data }) => {
      // console.log(data);
      this.statusCierre = data.cierre;
    });
  }

  actualizarCierre() {
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
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

    this._ConfiguracionService.updateCierraConfig().subscribe(({ data }) => {
      // console.log(data);
      if (data.cierre == 1) {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "Cierre activado",
          icon: "success",
        });
      } else {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "Cierre desactivado",
          icon: "success",
        });
      }
      this.getCierre();
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
