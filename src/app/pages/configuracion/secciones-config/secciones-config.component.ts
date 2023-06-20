import { Component, OnInit } from "@angular/core";
import { ConfiguracionService } from "app/shared/services/configuracion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-secciones-config",
  templateUrl: "./secciones-config.component.html",
  styleUrls: ["./secciones-config.component.css"],
})
export class SeccionesConfigComponent implements OnInit {
  constructor(private _ConfiguracionService: ConfiguracionService) {}
  statusCierre: number;

  ngOnInit(): void {}
}
