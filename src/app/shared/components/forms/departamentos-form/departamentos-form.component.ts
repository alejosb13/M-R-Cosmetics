import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";

import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Listado } from "@app/shared/services/listados.service";
import { FinanzasService } from "@app/shared/services/finanzas.service";
import { HelpersService } from "@app/shared/services/helpers.service";
import { DepartamentoErrorMessages } from "./utils/valid-messages";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Subscription } from "rxjs";
import { DepartamentoForm, DepartamentosFormBuilder } from "./utils/form";
import { UbicacionesService } from "@app/shared/services/ubicaciones.service";

@Component({
  selector: "app-departamentos-form",
  templateUrl: "./departamentos-form.component.html",
  styleUrls: ["./departamentos-form.component.scss"],
})
export class DepartamentosFormComponent {
  loadInfo: boolean = false;
  readonly DepartamentoErrorMessages = DepartamentoErrorMessages;
  @Input() Departamento: any = null;
  @Output() FormsValues = new EventEmitter<any>();

  FormTalonario: FormGroup<DepartamentoForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;
  Zonas: any = [];

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    public _Listado: Listado,
    public _FinanzasService: FinanzasService,
    public _HelpersService: HelpersService,
    public _UbicacionesService: UbicacionesService
  ) {}

  ngOnInit(): void {
    this.FormTalonario = DepartamentosFormBuilder();

    console.log(this.Departamento);

    // this.FormGastos.patchValue({producto_id:this.producto_id});
    this.validStatusFromChange();
    if (this.Departamento) this.setFormValues();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });

    this.getZonas();
  }

  getZonas() {
    this._UbicacionesService
      .zonas({
        estado: 1,
        disablePaginate: 1,
      })
      .subscribe((data: any) => {
        this.Zonas = data;
      });
  }

  validStatusFromChange() {
    this.FormTalonario.statusChanges
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
    this.FormTalonario.patchValue({
      nombre: this.Departamento.nombre,
      zona: this.Departamento.zona.id,
    });
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
      const DATA_FORM = this.FormTalonario.getRawValue();

      // if (this.Zona) importacion.id = this.Gasto.id;
      console.log(DATA_FORM);

      this.FormsValues.emit(DATA_FORM);
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
