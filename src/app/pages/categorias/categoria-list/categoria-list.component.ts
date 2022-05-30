import { Component, OnInit } from '@angular/core';
import { Categoria } from 'app/shared/models/Categoria.model';
import { CategoriaService } from 'app/shared/services/categoria.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.css']
})
export class CategoriaListComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Categorias: Categoria[];
  isLoad:boolean

  constructor(
    private _CategoriaService:CategoriaService,
    private _TablasService:TablasService,
  ) {}

  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._CategoriaService.getCategoria().subscribe((categoria:Categoria[])=> {
      // console.log(producto);

      this.Categorias = [...categoria]
      this._TablasService.datosTablaStorage = [...categoria]
      this._TablasService.total = categoria.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Categorias]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['tipo'],
      ['valor_dias'],
      ['id'],
    ];

    this._TablasService.buscarEnCampos(this.Categorias,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  eliminar({id}:Categoria){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta categoria se eliminará y no podrás recuperarla.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._CategoriaService.deleteCategoria(id).subscribe((data)=>{
          this.Categorias = this.Categorias.filter(categoria => categoria.id != id)
          this.refreshCountries()

          Swal.fire({
            text: data[0],
            icon: 'success',
          })
        })
      }
    })
  }

}
