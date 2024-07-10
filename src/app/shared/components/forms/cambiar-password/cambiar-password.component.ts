import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { CommunicationService } from "@app/shared/services/communication.service";
import { ValidFunctionsValidator } from "app/shared/utils/valid-functions.validator";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-cambiar-password",
  templateUrl: "./cambiar-password.component.html",
  styleUrls: ["./cambiar-password.component.css"],
})
export class CambiarPasswordComponent implements OnInit {
  editarUsuarioForm: UntypedFormGroup;
  loadInfo: boolean = false;

  @Input() Id?: number;
  @Output() FormsValues: EventEmitter<any> = new EventEmitter();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.definirValidaciones();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  definirValidaciones() {
    this.editarUsuarioForm = this.fb.group(
      {
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(4),
            // Validators.maxLength(12),
          ]),
        ],
        password_confirmation: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(4),
            // Validators.maxLength(12),
          ]),
        ],
      },
      {
        validator: ValidFunctionsValidator.MatchPassword,
      }
    );
  }

  get formularioControls() {
    return this.editarUsuarioForm.controls;
  }

  EnviarFormulario() {
    if (this.editarUsuarioForm.valid) {
      let usuarioService: any = {};
      usuarioService.password = this.formularioControls.password.value;
      usuarioService.password_confirmation =
        this.formularioControls.password_confirmation.value;

      this.FormsValues.emit(usuarioService);
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
