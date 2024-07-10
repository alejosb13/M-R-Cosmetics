import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";

import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Listado } from "@app/shared/services/listados.service";
import { FinanzasService } from "@app/shared/services/finanzas.service";
import { HelpersService } from "@app/shared/services/helpers.service";
import { GastoErrorMessages } from "./utils/valid-messages";
import { TalonarioForm, TalonarioFormBuilder } from "./utils/form";
import { Talonario } from "@app/shared/models/Talonario.model";
import logger from "@app/shared/utils/logger";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-talonario-por-lote",
  templateUrl: "./talonario-por-lote.component.html",
  styleUrls: ["./talonario-por-lote.component.scss"],
})
export class TalonarioPorLoteComponent {
  loadInfo: boolean = false;
  readonly GastoErrorMessages = GastoErrorMessages;

  // @Input() Gasto?: Gasto;
  @Output() FormsValues = new EventEmitter<any[]>();

  FormTalonario: FormGroup<TalonarioForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;
  talonarios = [];

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _Listado: Listado,
    public _FinanzasService: FinanzasService,
    public _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.FormTalonario = TalonarioFormBuilder();
    // console.log(this.Gasto);
    // console.log(this.producto_id);

    // this.FormGastos.patchValue({producto_id:this.producto_id});
    this.validStatusFromChange();
    this.changeData();

    // if (this.Gasto) this.setFormValues();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  changeData() {
    this.FormTalonario.valueChanges.subscribe(
      ({ inicio, cantidad, nroXlote }) => {
        this.talonarios = [];
        if (!inicio || !cantidad || !nroXlote) return false;

        let contadorRecibos = inicio;

        for (
          let indexTalonario = 0;
          indexTalonario < cantidad;
          indexTalonario++
        ) {
          const posicionTalonario = indexTalonario;

          this.talonarios[posicionTalonario] = [];

          // let inicioRecibo = inicio + contadorRecibos;
          let inicioRecibo = 0;
          while (inicioRecibo < nroXlote) {
            this.talonarios[posicionTalonario] = [
              ...this.talonarios[posicionTalonario],
              Number(contadorRecibos),
            ];

            logger.log("[contadorRecibos]", contadorRecibos);
            logger.log("[inicioRecibo]", inicioRecibo);

            contadorRecibos = ++contadorRecibos;
            ++inicioRecibo;
          }
        }
        logger.log("[this.talonarios]", this.talonarios);
      }
    );
  }

  validStatusFromChange() {
    this.FormTalonario.statusChanges
      .pipe(
        map((value: string) => {
          return value === "VALID" ? true : false;
        })
      )
      .subscribe((status: boolean) => {
        this.isValidForm = status && this.talonarios.length > 0;
      });
  }

  setFormValues() {
    // this.FormTalonario.patchValue({
    //   ...this.Gasto,
    // });
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormTalonario.controls
      ? this.FormTalonario.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormTalonario.get(name) as FormControl;
  }

  EnviarFormulario() {
    if (this.FormTalonario.valid) {
      this.FormsValues.emit(this.talonarios);
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
