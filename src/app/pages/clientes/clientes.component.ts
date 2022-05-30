import { Component, OnInit, PipeTransform } from '@angular/core';
import { TablasService } from 'app/shared/services/tablas.service';
import { Cliente } from '../../shared/models/Cliente.model';
import { ClientesService } from '../../shared/services/clientes.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Clientes: Cliente[];
  isLoad:boolean

  constructor(
    private _ClientesService:ClientesService,
    private _TablasService:TablasService,
  ) {}

  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._ClientesService.getCliente().subscribe((clientes:Cliente[])=> {
      console.log(clientes);
      clientes.map(cliente=>{
        const regex = /,/g;
        cliente.dias_cobro = cliente.dias_cobro.replace(regex," - ")
        return cliente
      })
      this.Clientes = [...clientes]
      this._TablasService.datosTablaStorage = [...clientes]
      this._TablasService.total = clientes.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Clientes]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    // this._TablasService.buscar(this.Clientes)
    let camposPorFiltrar:any[] = [
      ['nombreCompleto'],
      ['nombreEmpresa'],
      ['dias_cobro'],
      ['direccion_negocio'],
      ['direccion_casa'],
      ['id'],
    ];

    this._TablasService.buscarEnCampos(this.Clientes,camposPorFiltrar)
    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  eliminar({id}:Cliente){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este cliente se eliminará y no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._ClientesService.deleteCliente(id).subscribe((data)=>{
          this.Clientes = this.Clientes.filter(cliente => cliente.id != id)
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
