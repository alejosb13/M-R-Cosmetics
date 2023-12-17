import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/auth/login/service/auth.service';
import { DevolucionProducto } from 'app/shared/models/DevolucionProducto.model';
import { FacturaDetalle } from 'app/shared/models/FacturaDetalle.model';
import { Producto } from 'app/shared/models/Producto.model';
import { ValidFunctionsValidator } from 'app/shared/utils/valid-functions.validator';
import Swal from 'sweetalert2';

type ProductoDetalle = Producto & FacturaDetalle

@Component({
  selector: 'app-devolucion-producto-form',
  templateUrl: './devolucion-producto-form.component.html',
  styleUrls: ['./devolucion-producto-form.component.css']
})
export class DevolucionProductoFormComponent implements OnInit {

  DevolucionProductoForm: UntypedFormGroup;
  // Categorias:Categoria[]
  // Frecuencias:Frecuencia[]

  // isAdmin:boolean

  // @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() producto:ProductoDetalle
  @Output() FormsValues = new EventEmitter<DevolucionProducto>();

  constructor(
    private fb: UntypedFormBuilder,
    private _AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    console.log("[producto]",this.producto);


    // this.precio = this.producto.precio
    // this.isAdmin = this._AuthService.isAdmin()


    this.definirValidaciones()
    // // console.log(this.producto);
    this.setFormValues()
    // this.changeValues()
  }


  definirValidaciones(){
    this.DevolucionProductoForm = this.fb.group(
      {

        cantidad: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx),
            Validators.max(this.producto.cantidad),
            Validators.min(1),
          ]),
        ],
        descripcion: [
          "",
          Validators.compose([
            // Validators.required,
            Validators.maxLength(255),
            // Validators.pattern(ValidFunctionsValidator.DecimalRegEx),
            // Validators.minLength(3),
          ]),
        ],


      }
    );
  }

  setFormValues(){
    this.DevolucionProductoForm.patchValue({
      "cantidad" :  1,
      // "precio" : this.producto.precio,
    });
  }


  get formularioControls(){
    return this.DevolucionProductoForm.controls
  }


  EnviarFormulario(){

    if(this.DevolucionProductoForm.valid){
      let userId = Number(this._AuthService.dataStorage.user.userId)

      let devolucion:DevolucionProducto = {} as DevolucionProducto
      devolucion.cantidad           = Number(this.formularioControls.cantidad.value)
      devolucion.descripcion         = this.formularioControls.descripcion.value
      devolucion.factura_detalle_id = this.producto.id
      devolucion.estado             = 1
      devolucion.user_id          = userId

      this.FormsValues.emit(devolucion)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }

  }
}
