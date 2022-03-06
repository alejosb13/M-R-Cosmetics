import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'app/shared/models/Producto.model';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturar-producto',
  templateUrl: './facturar-producto.component.html',
  styleUrls: ['./facturar-producto.component.css']
})
export class FacturarProductoComponent implements OnInit {

  ProductForm: FormGroup;
  // Categorias:Categoria[]
  // Frecuencias:Frecuencia[]
  daysOfWeek:string[]
  loadInfo:boolean = false;
  precio:number
  
  @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() producto:Producto
  @Output() FormsValues = new EventEmitter<Producto>();
  
  constructor(
    private fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.precio = this.producto.precio
    this.definirValidaciones()
    console.log(this.producto);
    this.setFormValues()
    this.changeValues()
  }
  
  definirValidaciones(){
    this.ProductForm = this.fb.group(
      {
        // marca: [
        //   '',
        //   Validators.compose([
        //     Validators.required,        
        //     Validators.maxLength(30),
        //   ]),
        // ],
        // modelo: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     Validators.maxLength(43),
        //   ]),
        // ],
        stock: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx), 
            Validators.max(this.producto.stock),
            Validators.min(1),
          ]),
        ],
        precio: [
          {value:"", disabled:true},
          Validators.compose([
            Validators.required,
            // Validators.maxLength(80),
            Validators.pattern(ValidFunctionsValidator.DecimalRegEx),
            // Validators.minLength(3),
          ]),
        ],
        // comision: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     Validators.pattern(ValidFunctionsValidator.NumberRegEx),    
        //     Validators.maxLength(11),
        //   ]),
        // ],
        // linea: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     Validators.maxLength(50),
            
        //     // Validators.maxLength(12),
        //   ]),
        // ],
        // descripcion: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     Validators.maxLength(200),
            
        //     // Validators.maxLength(12),
        //   ]),
        // ],
        // estado: [
        //   1,
        //   Validators.compose([
        //     Validators.required,
        //   ]),
        // ],
        
      }
    ); 
  }
  
  setFormValues(){
    // this.loadInfo = true
    // this._ProductosService.getProductoById(this.Id).subscribe((producto:Producto)=>{
      this.ProductForm.setValue({
        // "marca" : producto.marca,
        // "modelo" : producto.modelo,
        "stock" :  (this.producto.stock > 0)? 1 : 0,
        "precio" : this.producto.precio,
        // "comision" : this.producto.comision,
        // "linea" : producto.linea,
        // "descripcion" : producto.descripcion,
        // "estado" : producto.estado,
      });
      
    //   this.loadInfo = false
    // })
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
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());
    
    if(this.ProductForm.valid){
      let producto = {...this.producto}
      producto.precio   = Number(this.formularioControls.precio.value)
      producto.stock    = Number(this.formularioControls.stock.value)
      producto.estado   = 1
      // producto.comision =  Number(this.formularioControls.comision.value)
      // producto.comision =  Number(this.formularioControls.comision.value)
      // producto.estado = Number(this.formularioControls.estado.value)
      // producto.linea =  this.formularioControls.linea.value
      // producto.marca =  this.formularioControls.marca.value
      // producto.modelo = this.formularioControls.modelo.value
      // producto.precio = Number(this.formularioControls.precio.value)
      // producto.stock = Number(this.formularioControls.stock.value)
      // producto.descripcion = String(this.formularioControls.stock.value)
 
      // console.log(producto);
      
      this.FormsValues.emit(producto)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }
}
