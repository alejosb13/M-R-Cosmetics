import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "app/auth/login/service/auth.service";
import { DevolucionProducto } from "app/shared/models/DevolucionProducto.model";
import { Factura } from "app/shared/models/Factura.model";
import { ValidFunctionsValidator } from "app/shared/utils/valid-functions.validator";
import logger from "app/shared/utils/logger";
import Swal from "sweetalert2";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-devolucion-factura-form",
  templateUrl: "./devolucion-factura-form.component.html",
  styleUrls: ["./devolucion-factura-form.component.css"],
})
export class DevolucionFacturaFormComponent implements OnInit {
  DevolucionFacturaForm: UntypedFormGroup;
  @Input() factura: Factura;
  @Output() FormsValues = new EventEmitter<any>();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private fb: UntypedFormBuilder,
    private _AuthService: AuthService
  ) {}

  ngOnInit(): void {
    logger.log("[factura-Form]", this.factura);

    this.definirValidaciones();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  definirValidaciones() {
    this.DevolucionFacturaForm = this.fb.group({
      descripcion: [
        "",
        Validators.compose([
          // Validators.required,
          Validators.maxLength(255),
          // Validators.pattern(ValidFunctionsValidator.DecimalRegEx),
          // Validators.minLength(3),
        ]),
      ],
    });
  }

  get formularioControls() {
    return this.DevolucionFacturaForm.controls;
  }

  EnviarFormulario() {
    if (this.DevolucionFacturaForm.valid) {
      let userId = Number(this._AuthService.dataStorage.user.userId);

      let devolucionFactura: any = {
        factura_id: this.factura.id,
        user_id: userId,
        descripcion: this.formularioControls.descripcion.value,
        estado: 1,
      };

      this.FormsValues.emit(devolucionFactura);
    } else {
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
