import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Recibo } from "app/shared/models/Recibo.model";
import { ValidFunctionsValidator } from "app/shared/utils/valid-functions.validator";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-recibo-modal-form",
  templateUrl: "./recibo-modal-form.component.html",
  styleUrls: ["./recibo-modal-form.component.css"],
})
export class ReciboModalFormComponent implements OnInit {
  @Input() recibo: Recibo;
  @Output() FormsValues = new EventEmitter<Recibo>();

  ReciboForm: UntypedFormGroup;
  loadInfo: boolean = false;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.definirValidaciones();

    if (this.recibo) this.setFormValues();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  definirValidaciones() {
    this.ReciboForm = this.fb.group({
      min: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          Validators.maxLength(20),
          Validators.min(1),
        ]),
      ],
      max: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.min(1),
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
        ]),
      ],
    });
  }

  setFormValues() {
    this.ReciboForm.setValue({
      min: this.recibo.min,
      max: this.recibo.max,
    });
  }

  get formularioControls() {
    return this.ReciboForm.controls;
  }

  EnviarFormulario() {
    if (this.ReciboForm.valid) {
      let recibo = {} as Recibo;

      recibo.min = Number(this.formularioControls.min.value);
      recibo.max = Number(this.formularioControls.max.value);
      recibo.recibo_cerrado = 0;
      recibo.estado = 1;

      this.FormsValues.emit(recibo);
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
