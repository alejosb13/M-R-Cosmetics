import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'app/shared/models/Categoria.models';
import { Frecuencia } from 'app/shared/models/Frecuencia.models';
import { CategoriaService } from 'app/shared/services/categoria.service';
import { FrecuenciaService } from 'app/shared/services/frecuencia.service';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: ['./cliente-editar.component.css']
})
export class ClienteEditarComponent implements OnInit {
  
  editarClienteForm: FormGroup;
  Categorias:Categoria[]
  Frecuencias:Frecuencia[]
  
  constructor(
    private fb: FormBuilder,
    private _CategoriaService: CategoriaService,
    private _FrecuenciaService: FrecuenciaService,
    
  ) { 
    this._CategoriaService.getCategoria().subscribe((data:Categoria[]) => this.Categorias = [...data]);
    this._FrecuenciaService.getFrecuencia().subscribe((data:Frecuencia[]) => this.Frecuencias = [...data]);
  }

  ngOnInit(): void {
    
    this.definirValidaciones()
  }
  
  definirValidaciones(){
    this.editarClienteForm = this.fb.group(
      {
        categoria_id: [
          '',
          Validators.compose([
            Validators.required,        
            // Validators.maxLength(100),
          ]),
        ],
        frecuencia_id: [
          '',
          Validators.compose([
            Validators.required,
            // Validators.min(2000),
            // Validators.max(this.anioActual),

          ]),
        ],
        nombre: [
          '',
          Validators.compose([
            Validators.required,
            
          ]),
        ],
        apellido: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
        celular: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
        telefono: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
        direccion_casa: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
        direccion_negocio: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
        cedula: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
        dias_cobro: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
        // fecha_vencimiento: [
        //   '',
        //   Validators.compose([
        //     // Validators.required,

        //   ]),
        // ],
        estado: [
          '',
          Validators.compose([
            // Validators.required,

          ]),
        ],
      }
    ); 
  }
}
