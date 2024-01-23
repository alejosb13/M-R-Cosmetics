import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
} from "@angular/forms";
import { ImportacionForm, ImportacionFormBuilder } from "./utils/form";
import { ImportacionErrorMessages } from "./utils/valid-messages";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
} from "rxjs/operators";
import Swal from "sweetalert2";
import { Observable, of, OperatorFunction } from "rxjs";
import { Producto } from "app/shared/models/Producto.model";
import { Listado } from "app/shared/services/listados.service";
import { FinanzasService } from "app/shared/services/finanzas.service";
import { FiltrosList } from "app/shared/models/Listados.model";

@Component({
  selector: "app-importacion-form",
  templateUrl: "./importacion-form.component.html",
  styleUrls: ["./importacion-form.component.scss"],
})
export class ImportacionFormComponent {
  loadInfo: boolean = false;
  readonly InversionErrorMessages = ImportacionErrorMessages;

  @Input() Id?: number;
  @Output() FormsValues = new EventEmitter();

  FormImportacion: FormGroup<ImportacionForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;

  searching: boolean = false;
  searchFailed: boolean = false;

  constructor(
    public _Listado: Listado,
    public _FinanzasService: FinanzasService
  ) {}

  ngOnInit(): void {
    this.FormImportacion = ImportacionFormBuilder();

    this.validStatusFromChange();
    // if (this.Id) this.setFormValues();
  }

  validStatusFromChange() {
    this.FormImportacion.statusChanges
      .pipe(
        map((value: string) => {
          return value === "VALID" ? true : false;
        })
      )
      .subscribe((status: boolean) => {
        // console.log("statusForm", status);
        // console.log(this.getControl("fecha_inversion"));

        this.isValidForm = status;
      });
  }

  setFormValues() {}

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormImportacion.controls
      ? this.FormImportacion.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormImportacion.get(name) as FormControl;
  }

  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());

    if (this.FormImportacion.valid) {
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

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        let listadoFilter: FiltrosList = {
          link: null,
          estado: 1,
          disablePaginate: 1,
          filter: term,
        };

        return this._FinanzasService.getInversiones(listadoFilter).pipe(
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
    // setTimeout(() => {
    //   const controlInversion = this.getControlFormArray();
    //   const patchValue = {
    //     codigo: item.id,
    //     // producto: productoCompleto.descripcion,
    //     marca: item.marca,
    //   };
    //   console.log(patchValue);
    //   controlInversion[i].patchValue(patchValue);
    // }, 10);
  }
}
