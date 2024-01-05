import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from "@angular/forms";
import {
  FormatInDecimalToFixed,
  InversionForm,
  InversionFormBuilder,
  inversionFormStructure,
  inversionTotalValues,
} from "app/shared/components/forms/inversion-form/utils/form";
import { InversionErrorMessages } from "app/shared/components/forms/inversion-form/utils/valid-messages";
import { Inversion, InversionesTotales } from "app/shared/models/Inversion";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";

@Component({
  selector: "app-inversion-form",
  templateUrl: "./inversion-form.component.html",
  styleUrls: ["./inversion-form.component.scss"],
})
export class InversionFormComponent {
  loadInfo: boolean = false;
  readonly InversionErrorMessages = InversionErrorMessages;

  @Input() Id?: number;
  @Output() FormsValues = new EventEmitter<InversionForm>();

  // inversion: FormArray;
  FormInversion: FormGroup;
  readOnlyInputsForCalculation: boolean = true;
  readOnlyInputsEditable: boolean = false;
  totales: InversionesTotales = { ...inversionTotalValues() };

  isValidForm: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.FormInversion = InversionFormBuilder();
    // this.FormInversion = new FormGroup({
    //   inversion: new FormArray([]),
    // });

    this.validStatusFromChange();
    this.validTotalChange();
    // if (this.Id) this.setFormValues();
  }

  validStatusFromChange() {
    this.FormInversion.statusChanges
      .pipe(
        map((value: string) => {
          return value === "VALID" ? true : false;
        })
      )
      .subscribe((status) => {
        // console.log("statusForm", status);
        this.isValidForm = status;
      });
  }

  validTotalChange() {
    this.FormInversion.get("inversion").valueChanges.subscribe(
      (datos: Inversion[]) => {
        // console.log(datos);
        let totales: InversionesTotales = { ...inversionTotalValues() };
        this.totales = datos.reduce(
          (accumulator: InversionesTotales, currentValue: Inversion) => {
            // console.log(accumulator);
            // console.log(currentValue);

            return {
              cantidad: accumulator.cantidad + Number(currentValue.cantidad),
              costo: accumulator.costo + Number(currentValue.costo),
              peso_porcentual:
                accumulator.peso_porcentual +
                Number(currentValue.peso_porcentual),
              costo_total:
                accumulator.costo_total + Number(currentValue.costo_total),
              precio_venta:
                accumulator.precio_venta + Number(currentValue.precio_venta),
              venta_total:
                accumulator.venta_total + Number(currentValue.venta_total),
              costo_real:
                accumulator.costo_real + Number(currentValue.costo_real),
              ganancia_bruta:
                accumulator.ganancia_bruta +
                Number(currentValue.ganancia_bruta),
              comision_vendedor:
                accumulator.comision_vendedor +
                Number(currentValue.comision_vendedor),
            };
          },
          totales
        );
      }
    );
  }

  validateProductInversion(event: KeyboardEvent, position: number) {
    const { value, name } = event.target as HTMLInputElement;
    if (!value) return false;
    const controlInversion = this.getControlFormArray();

    const FormValue: Partial<Inversion> = controlInversion[position].value; // obtengo los valores del formulario que fue modificado
    const precio_unitario = Number(FormValue.precio_unitario || 0);
    const cantidad = Number(FormValue.cantidad || 0);

    const costo = precio_unitario * cantidad;

    let peso_porcentual =
      this.totales.costo > 0 ? costo / this.totales.costo : 0;
    peso_porcentual = FormatInDecimalToFixed(peso_porcentual);

    let peso_absoluto = peso_porcentual * 165.00; // reemplazar por 0 por precio de tabla peque;a
    peso_absoluto = FormatInDecimalToFixed(peso_absoluto);

    let c_u_distribuido = cantidad > 0 ? peso_absoluto / cantidad : 0;
    c_u_distribuido = FormatInDecimalToFixed(c_u_distribuido);

    let costo_total = precio_unitario + c_u_distribuido;
    costo_total = FormatInDecimalToFixed(costo_total);


    let subida_ganancia = precio_unitario * 1.9;
    subida_ganancia = FormatInDecimalToFixed(subida_ganancia);

    let precio_venta = precio_unitario + c_u_distribuido + subida_ganancia;
    precio_venta = FormatInDecimalToFixed(precio_venta);


    let margen_ganancia_calculo =
      precio_unitario > 0
        ? (precio_venta - c_u_distribuido) / precio_unitario
        : 0;
    let margen_ganancia = margen_ganancia_calculo - 1;
    margen_ganancia = FormatInDecimalToFixed(margen_ganancia);

    let venta = precio_venta - c_u_distribuido;
    venta = FormatInDecimalToFixed(venta);

    let venta_total = venta * cantidad;
    venta_total = FormatInDecimalToFixed(venta_total);

    let costo_real = precio_unitario * cantidad;
    costo_real = FormatInDecimalToFixed(costo_real);

    let ganancia_bruta = venta_total - costo_real;
    ganancia_bruta = FormatInDecimalToFixed(ganancia_bruta);

    let comision_vendedor = precio_venta * cantidad * 0.2; // porcentaje 20% = 0.20
    comision_vendedor = FormatInDecimalToFixed(comision_vendedor);

    controlInversion[position].patchValue({
      costo,
      peso_porcentual,
      peso_absoluto,
      c_u_distribuido,
      costo_total,
      subida_ganancia,
      precio_venta,
      margen_ganancia,
      venta,
      venta_total,
      costo_real,
      ganancia_bruta,
      comision_vendedor,
    });
    console.log({
      costo,
      peso_porcentual,
      peso_absoluto,
      c_u_distribuido,
      costo_total,
      subida_ganancia,
      precio_venta,
      margen_ganancia,
      venta,
      venta_total,
      costo_real,
      ganancia_bruta,
      comision_vendedor,
    });
  }

  setFormValues() {}

  getControlErrorsArray(name: string, index: number): ValidationErrors | null {
    const control = this.FormInversion.controls[index]
      ? this.FormInversion.controls[index].get(name)
      : null;
    // logger.log(
    //   this.FormInversion.controls[index]
    // );
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControlFormArray(): FormGroup<InversionForm>[] {
    // console.log((this.FormInversion.get("inversion") as FormArray).controls);
    let arrayForm: FormArray<FormGroup<InversionForm>> = this.FormInversion.get(
      "inversion"
    ) as FormArray;
    return arrayForm.controls;
  }

  getControlArray(inputName: string, index: number): FormControl {
    const controlInversion = this.getControlFormArray();
    controlInversion[index].get(inputName);

    // console.log(inputName);
    // console.log(controlInversion[index].get(inputName));
    return controlInversion[index].get(inputName) as FormControl;
  }

  addRowItem() {
    // console.log(this.FormInversion);
    // this.inversion = this.FormInversion.get("inversion") as FormArray;
    let newInversion: FormArray = this.FormInversion.get(
      "inversion"
    ) as FormArray;
    if (!this.isValidForm) {
      Swal.fire({
        text: "Asegurese de completar todos los campos editables de los productos existentes",
        icon: "warning",
      });
      return;
    }
    newInversion.push(new FormGroup<InversionForm>(inversionFormStructure()));
    // console.log(newInversion);
  }

  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());

    if (this.FormInversion.valid) {
      // let frecuencia = {} as InversionForm;
      // frecuencia.descripcion = this.formularioControls.descripcion.value;
      // frecuencia.dias = Number(this.formularioControls.dias.value);
      // this.FormsValues.emit(frecuencia);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }

  eliminarItem(position: number) {
    // remove address from the list
    const control = <FormArray>this.FormInversion.controls["inversion"];
    if (control.length == 0) {
      Swal.fire({
        text: "El mínimo de productos es de 1",
        icon: "warning",
      });
    }

    control.removeAt(position);
    // console.log("this.FormInversion", control);
  }
}
