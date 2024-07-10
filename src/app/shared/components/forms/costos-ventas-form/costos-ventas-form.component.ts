import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";

import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Listado } from "@app/shared/services/listados.service";
import { FinanzasService } from "@app/shared/services/finanzas.service";
import { HelpersService } from "@app/shared/services/helpers.service";
import {
  CostosVentasFormBuilder,
  CostoVentasForm,
} from "@app/shared/components/forms/costos-ventas-form/utils/form";
import { CostoVentaErrorMessages } from "@app/shared/components/forms/costos-ventas-form/utils/valid-messages";
import { CostoVenta } from "@app/shared/models/CostosVentas.model";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-costos-ventas-form",
  templateUrl: "./costos-ventas-form.component.html",
  styleUrls: ["./costos-ventas-form.component.scss"],
})
export class CostosVentasFormComponent {
  loadInfo: boolean = false;
  readonly CostoVentaErrorMessages = CostoVentaErrorMessages;

  @Input() Id?: number;
  @Input() producto_id: number;
  @Output() FormsValues = new EventEmitter();

  FormCostoVenta: FormGroup<CostoVentasForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;

  searching: boolean = false;
  searchFailed: boolean = false;

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _Listado: Listado,
    public _FinanzasService: FinanzasService,
    public _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.FormCostoVenta = CostosVentasFormBuilder();
    if (this.Id) this.setFormValues();
    // console.log(this.producto_id);

    this.FormCostoVenta.patchValue({ producto_id: this.producto_id });
    this.validStatusFromChange();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  validStatusFromChange() {
    this.FormCostoVenta.statusChanges
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
    // this.loadInfo = true;
    // this._FinanzasService.getImportacionById(this.Id).subscribe(
    //   (data: any) => {
    //     const patchValue: Partial<CostoVenta> = {
    //       producto_id: data.producto_id,
    //       costo: data.costo,
    //     };
    //     this.FormCostoVenta.patchValue(patchValue);
    //     this.loadInfo = false;
    //   },
    //   () => {
    //     this.loadInfo = false;
    //   }
    // );
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormCostoVenta.controls
      ? this.FormCostoVenta.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormCostoVenta.get(name) as FormControl;
  }

  EnviarFormulario() {
    if (this.FormCostoVenta.valid) {
      console.log(this.FormCostoVenta.getRawValue());
      const DATA_FORM = this.FormCostoVenta.getRawValue();

      let importacion: CostoVenta = {
        costo: DATA_FORM.costo,
        producto_id: DATA_FORM.producto_id,
      };
      console.log(importacion);
      // frecuencia.descripcion = this.formularioControls.descripcion.value;
      // frecuencia.dias = Number(this.formularioControls.dias.value);
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
