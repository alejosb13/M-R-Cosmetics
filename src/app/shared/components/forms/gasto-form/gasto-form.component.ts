import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";

import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Listado } from "@app/shared/services/listados.service";
import { FinanzasService } from "@app/shared/services/finanzas.service";
import { HelpersService } from "@app/shared/services/helpers.service";
import { Gasto } from "@app/shared/models/Gasto.model";
import { GastoFormBuilder, GastosForm } from "./utils/form";
import { GastoErrorMessages } from "./utils/valid-messages";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Subscription } from "rxjs";
export const TIPOS_GASTOS: string[] = ["Empresa", "MaRo", "Adicional"];

@Component({
  selector: "app-gasto-form",
  templateUrl: "./gasto-form.component.html",
  styleUrls: ["./gasto-form.component.scss"],
})
export class GastoFormComponent {
  loadInfo: boolean = false;
  readonly GastoErrorMessages = GastoErrorMessages;

  @Input() Gasto?: Gasto;
  @Output() FormsValues = new EventEmitter<Gasto>();

  FormGastos: FormGroup<GastosForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;
  selectValues: string[] = TIPOS_GASTOS;

  selectValuesPago: string[] = ["Efectivo", "Transferencia", "Otro"];

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _Listado: Listado,
    public _FinanzasService: FinanzasService,
    public _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.FormGastos = GastoFormBuilder();
    console.log(this.Gasto);
    // console.log(this.producto_id);

    // this.FormGastos.patchValue({producto_id:this.producto_id});
    this.validStatusFromChange();
    if (this.Gasto) this.setFormValues();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  validStatusFromChange() {
    this.FormGastos.statusChanges
      .pipe(
        map((value: string) => {
          return value === "VALID" ? true : false;
        })
      )
      .subscribe((status: boolean) => {
        this.isValidForm = status;
      });
  }

  setFormValues() {
    this.FormGastos.patchValue({
      ...this.Gasto,
      fecha_comprobante: this._HelpersService.changeformatDate(
        this.Gasto.fecha_comprobante,
        "YYYY-MM-DD HH:mm:ss",
        "YYYY-MM-DD"
      ),
    });
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormGastos.controls ? this.FormGastos.get(name) : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormGastos.get(name) as FormControl;
  }

  EnviarFormulario() {
    if (this.FormGastos.valid) {
      const DATA_FORM = this.FormGastos.getRawValue();

      let importacion: Gasto = {
        ...DATA_FORM,
        fecha_comprobante: this._HelpersService.changeformatDate(
          DATA_FORM.fecha_comprobante,
          "YYYY-MM-DD",
          "YYYY-MM-DD HH:mm:ss"
        ),
        tipo_desc: this.selectValues[DATA_FORM.tipo],
        tipo_pago_str: this.selectValuesPago[DATA_FORM.tipo_pago],
      };
      if (this.Gasto) importacion.id = this.Gasto.id;
      console.log(importacion);

      this.FormsValues.emit(importacion);
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
