import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/auth/login/service/auth.service';
import Swal from 'sweetalert2';
import { FacturaDetalle } from '../models/FacturaDetalle.model';
import { Producto } from '../models/Producto.model';
import { ValidFunctionsValidator } from '../validations/valid-functions.validator';

type ProductoDetalle = Producto & FacturaDetalle

@Component({
  selector: 'app-factura-editar-form',
  templateUrl: './factura-form.component.html',
  styleUrls: ['./factura-form.component.css']
})
export class FacturaEditarFormComponent implements OnInit {
  ProductForm: FormGroup;
  // Categorias:Categoria[]
  // Frecuencias:Frecuencia[]
  daysOfWeek:string[]
  loadInfo:boolean = false;
  precio:number

  isAdmin:boolean

  // @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() producto:ProductoDetalle
  @Output() FormsValues = new EventEmitter<Producto>();

  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    console.log(this.producto);


    // this.precio = this.producto.precio
    this.isAdmin = this._AuthService.isAdmin()


    this.definirValidaciones()
    // // console.log(this.producto);
    this.setFormValues()
    // this.changeValues()
  }


  definirValidaciones(){
    this.ProductForm = this.fb.group(
      {

        stock: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx),
            // Validators.max(this.producto.stock),
            Validators.min(1),
          ]),
        ],
        precio: [
          {value:"", disabled: !this.isAdmin},
          Validators.compose([
            Validators.required,
            // Validators.maxLength(80),
            Validators.pattern(ValidFunctionsValidator.DecimalRegEx),
            // Validators.minLength(3),
          ]),
        ],


      }
    );
  }

  setFormValues(){
    this.ProductForm.setValue({
      "stock" :  this.producto.cantidad,
      "precio" : this.producto.precio,
    });
  }

  changeValues(){
    this.ProductForm.get("stock").valueChanges.subscribe(valueStock=>{
      this.ProductForm.get("precio").setValue(this.precio * valueStock)

      // if()
      // let precio = this.ProductForm.get("precio")?.value
      // this.ProductForm.get("precio").setValue(precio * valueStock)
    })

  }


  get formularioControls(){
    return this.ProductForm.controls
  }


  EnviarFormulario(){

    if(this.ProductForm.valid){
      let producto = {...this.producto}
      producto.precio      = Number(this.formularioControls.precio.value)
      producto.cantidad    = Number(this.formularioControls.stock.value)
      producto.porcentaje  = 0

      // producto.estado      = 1
      // producto.producto_id = this.producto.producto_id
      // producto.factura_id  = this.producto.factura_id
      // producto.comision =  Number(this.formularioControls.comision.value)
      // producto.estado = Number(this.formularioControls.estado.value)
      // producto.linea =  this.formularioControls.linea.value
      // producto.marca =  this.formularioControls.marca.value
      // producto.modelo = this.formularioControls.modelo.value
      // producto.precio = Number(this.formularioControls.precio.value)
      // producto.stock = Number(this.formularioControls.stock.value)
      // producto.descripcion = String(this.formularioControls.stock.value)

      console.log(producto);

      this.FormsValues.emit(producto)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }

  }
}
