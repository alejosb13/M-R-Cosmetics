import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Producto } from 'app/shared/models/Producto.model';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';
import { Regalo } from '../../../models/Regalo';

@Component({
  selector: 'app-cargar-regalo',
  templateUrl: './cargar-regalo.component.html',
  styleUrls: ['./cargar-regalo.component.css']
})
export class CargarRegaloComponent implements OnInit {

  ProductForm: UntypedFormGroup;
  // Categorias:Categoria[]
  // Frecuencias:Frecuencia[]
  daysOfWeek:string[]
  loadInfo:boolean = false;
  precio:number

  isAdmin:boolean

  // @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() producto:Producto
  @Input() regalo?:Regalo = null
  @Output() FormsValues = new EventEmitter<Producto|Regalo>();

  constructor(
    private fb: UntypedFormBuilder,
    private _AuthService: AuthService,
  ) {

  }

  ngOnInit(): void {

    this.precio = this.producto.precio
    this.isAdmin = this._AuthService.isAdmin()


    this.definirValidaciones()
    console.log(this.producto);
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
            Validators.max(this.producto.stock),
            Validators.min(1),
          ]),
        ],
      }
    );
  }

  setFormValues(){

      this.ProductForm.setValue({
        "stock" :  (this.producto.stock > 0)? 1 : 0,
        // "precio" : this.producto.precio,
      });

    //   this.loadInfo = false
    // })
  }

  changeValues(){
    this.ProductForm.get("stock").valueChanges.subscribe(valueStock=>{
      this.ProductForm.get("precio").setValue(this.precio * valueStock)
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

      producto.stock           = Number(this.formularioControls.stock.value)
      
      if(this.regalo){
        let regalo = this.regalo 
        regalo.data = producto 
        
        this.FormsValues.emit(regalo)
      }else{
        this.FormsValues.emit(producto)

      }


      // console.log(producto);

    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }

  }
}
