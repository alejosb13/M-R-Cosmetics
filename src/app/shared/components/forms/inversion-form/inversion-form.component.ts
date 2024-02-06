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
  InversionGeneralForm,
  inversionTotalValues,
} from "app/shared/components/forms/inversion-form/utils/form";
import { InversionErrorMessages } from "app/shared/components/forms/inversion-form/utils/valid-messages";
import {
  InversionesTotales,
  InversionGeneral,
  InversionResponse,
} from "app/shared/models/Inversion.model";
import Swal from "sweetalert2";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
} from "rxjs/operators";
import { FinanzasService } from "app/shared/services/finanzas.service";
import { Observable, of, OperatorFunction } from "rxjs";
import { Listado } from "app/shared/services/listados.service";
import { catchError } from "rxjs/operators";
import { Producto } from "app/shared/models/Producto.model";

@Component({
  selector: "app-inversion-form",
  templateUrl: "./inversion-form.component.html",
  styleUrls: ["./inversion-form.component.scss"],
})
export class InversionFormComponent {
  loadInfo: boolean = true;
  readonly InversionErrorMessages = InversionErrorMessages;

  @Input() Id?: number;
  @Output() FormsValues = new EventEmitter<{
    InversionGeneral: InversionGeneral;
    Totales: InversionesTotales;
  }>();

  // inversionResponse:InversionResponse;
  FormInversion: FormGroup<InversionGeneralForm>;
  readOnlyInputsForCalculation: boolean = true;
  readOnlyInputsCierre: boolean = false;
  producto_insertado: boolean = false;
  totales: InversionesTotales = { ...inversionTotalValues() };

  isValidForm: boolean = false;
  searching: boolean = false;
  searchFailed: boolean = false;
  productos: Producto[] = [];

  InversionData: InversionResponse;

  constructor(
    public _FinanzasService: FinanzasService,
    public _Listado: Listado
  ) {}

  formatterValue = (x: { descripcion: string } | string) =>
    typeof x === "string" ? x : x.descripcion;

  ngOnInit(): void {
    this.FormInversion = InversionFormBuilder();

    if (this.Id) {
      // console.log("22");

      this.setFormValues();
    } else {
      this.loadInfo = false;
    }
    this.validStatusFromChange();
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
    const { inversion } = this.FormInversion.value;
    let totales: InversionesTotales = { ...inversionTotalValues() };
    // console.log(totales)que ;

    this.totales = inversion.reduce((accumulator, currentValue) => {
      return {
        ...accumulator,
        cantidad: FormatInDecimalToFixed(
          Number(accumulator.cantidad) + Number(currentValue.cantidad)
        ),
        costo: FormatInDecimalToFixed(accumulator.costo + currentValue.costo),
        peso_porcentual: FormatInDecimalToFixed(
          accumulator.peso_porcentual + currentValue.peso_porcentual
        ),
        costo_total: FormatInDecimalToFixed(
          accumulator.costo_total + currentValue.costo_total
        ),
        precio_venta: FormatInDecimalToFixed(
          accumulator.precio_venta + currentValue.precio_venta
        ),
        venta_total: FormatInDecimalToFixed(
          accumulator.venta_total + currentValue.venta_total
        ),
        costo_real: FormatInDecimalToFixed(
          accumulator.costo_real + currentValue.costo_real
        ),
        ganancia_bruta: FormatInDecimalToFixed(
          accumulator.ganancia_bruta + currentValue.ganancia_bruta
        ),
        comision_vendedor: FormatInDecimalToFixed(
          accumulator.comision_vendedor + currentValue.comision_vendedor
        ),
      };
    }, totales);
    this.totales.ganancia_total = FormatInDecimalToFixed(
      this.totales.ganancia_bruta - this.totales.comision_vendedor
    );
    // console.log(this.totales);
  }

  validateProductInversion() {
    const { envio, porcentaje_comision_vendedor, inversion } =
      this.FormInversion.value;
    // console.log({ envio, porcentaje_comision_vendedor, inversion });

    this.validTotalChange();

    inversion.map((producto, index) => {
      const precio_unitario = Number(producto.precio_unitario || 0);
      const cantidad = Number(producto.cantidad || 0);
      const porcentaje_ganancia = Number(producto.porcentaje_ganancia || 0);

      const costo = FormatInDecimalToFixed(precio_unitario * cantidad);
      // console.log("costo", costo);

      let peso_porcentual =
        this.totales.costo > 0 ? costo / this.totales.costo : 0;
      peso_porcentual = FormatInDecimalToFixed(peso_porcentual);

      let peso_absoluto = peso_porcentual * envio; // reemplazar por 0 por precio de tabla peque;a
      peso_absoluto = FormatInDecimalToFixed(peso_absoluto);

      let c_u_distribuido = cantidad > 0 ? peso_absoluto / cantidad : 0;
      c_u_distribuido = FormatInDecimalToFixed(c_u_distribuido);

      let costo_total = precio_unitario + c_u_distribuido;
      costo_total = FormatInDecimalToFixed(costo_total);

      let subida_ganancia = precio_unitario * porcentaje_ganancia; // porcentaje_ganancia
      subida_ganancia = FormatInDecimalToFixed(subida_ganancia);

      let precio_venta = c_u_distribuido + subida_ganancia + precio_unitario;
      precio_venta = FormatInDecimalToFixed(precio_venta);

      let margen_ganancia_calculo =
        precio_unitario > 0
          ? (precio_venta - c_u_distribuido) / precio_unitario
          : 0;
      let margen_ganancia = (margen_ganancia_calculo - 1) * 100;
      margen_ganancia = FormatInDecimalToFixed(margen_ganancia);

      let venta = precio_venta - c_u_distribuido;
      venta = FormatInDecimalToFixed(venta);

      let venta_total = venta * cantidad;
      venta_total = FormatInDecimalToFixed(venta_total);

      let costo_real = precio_unitario * cantidad;
      costo_real = FormatInDecimalToFixed(costo_real);

      let ganancia_bruta = venta_total - costo_real;
      ganancia_bruta = FormatInDecimalToFixed(ganancia_bruta);

      let comision_vendedor =
        precio_venta * cantidad * porcentaje_comision_vendedor; // porcentaje 20% = 0.20
      comision_vendedor = FormatInDecimalToFixed(comision_vendedor);

      const patchValue = {
        costo,
        peso_porcentual: FormatInDecimalToFixed(peso_porcentual * 100),
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
      };

      const controlInversion = this.getControlFormArray();
      controlInversion[index].patchValue(patchValue);
      this.validTotalChange();
    });
  }

  setFormValues() {
    this._FinanzasService.getInversionById(this.Id).subscribe(
      (data: InversionResponse) => {
        // console.log("respuesta", data);
        this.readOnlyInputsCierre = data.estatus_cierre == 1 ? true : false;
        // this.producto_insertado = data.producto_insertado == 1 ? true : false;
        const controlInversion = this.getControlFormArray();
        this.InversionData = { ...data };
        this.FormInversion.patchValue({
          envio: data.envio,
          porcentaje_comision_vendedor: data.porcentaje_comision_vendedor,
        });

        data.inversion_detalle.forEach((row, index) => {
          if (!controlInversion[index]) {
            let newInversion: FormArray = this.FormInversion.get(
              "inversion"
            ) as FormArray;
            newInversion.push(
              new FormGroup<InversionForm>(inversionFormStructure())
            );
          }

          const patchValue = {
            codigo: row.codigo,
            producto: row.producto,
            marca: row.marca,
            costo: row.costo,
            cantidad: row.cantidad,
            precio_unitario: row.precio_unitario,
            porcentaje_ganancia: row.porcentaje_ganancia,
            peso_porcentual: row.peso_porcentual,
            peso_absoluto: row.peso_absoluto,
            c_u_distribuido: row.c_u_distribuido,
            costo_total: row.costo_total,
            subida_ganancia: row.subida_ganancia,
            precio_venta: row.precio_venta,
            margen_ganancia: row.margen_ganancia,
            venta: row.venta,
            venta_total: row.venta_total,
            costo_real: row.costo_real,
            ganancia_bruta: row.ganancia_bruta,
            comision_vendedor: row.comision_vendedor,
          };
          controlInversion[index].patchValue(patchValue);
        });

        this.validTotalChange();

        this.loadInfo = false;
      },
      () => {
        this.loadInfo = false;
      }
    );
  }

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
    // console.log(this.FormInversion.getRawValue());
    // return
    if (this.FormInversion.valid) {
      let InversionFrom = this.FormInversion.getRawValue();
      let newInversionFrom = InversionFrom.inversion.map(
        (productoInversion: any) => ({
          ...productoInversion,
          producto:
            typeof productoInversion.producto === "string"
              ? productoInversion.producto
              : productoInversion.producto.descripcion,
        })
      );
      let response:any = {
        Totales: this.totales,
        InversionGeneral: {
          ...InversionFrom,
          inversion: newInversionFrom,
        },
      };

      if (this.Id) {
        response.InversionGeneral.numero_seguimiento =
          this.InversionData.numero_seguimiento;
      }
      console.log(response);

      this.FormsValues.emit(response);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormInversion.controls
      ? this.FormInversion.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormInversion.get(name) as FormControl;
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        let listadoFilter = {
          estado: 1,
          disablePaginate: 1,
          filter: term,
        };

        return this._Listado.ProductoList(listadoFilter).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      tap(() => (this.searching = false))
    );
  };

  eventInputTypeHead({ item }: { item: Producto }, i: string) {
    setTimeout(() => {
      const controlInversion = this.getControlFormArray();
      const patchValue = {
        codigo: item.id,
        // producto: productoCompleto.descripcion,
        marca: item.marca,
      };
      console.log(patchValue);

      controlInversion[i].patchValue(patchValue);
    }, 10);
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

  agregarAlInventario(data:number) {

    // console.log(this.InversionData.inversion_detalle[data]);
    Swal.fire({
      title: "¿Deseas cargar este producto al inventario?",
      text: "Una vez cargado se actualizara el stock y el precio del producto. Esta accion no podras revertirla luego de aceptar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51cbce",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this._FinanzasService
          .insertProducto( {
            producto_insertado: 1,
            id_inversion: this.InversionData.id,
            id_inversion_detail:this.InversionData.inversion_detalle[data].id,
          })
          .subscribe((data) => {
            // this.Frecuencias = this.Frecuencias.filter(categoria => categoria.id != id)
            Swal.fire({
              text: data[0],
              icon: "success",
            }).then(() => {
              window.location.reload();
            })
          });
      }
    });
  }
}
