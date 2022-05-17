import { Component, OnInit } from '@angular/core';
import { Abono } from 'app/shared/models/Abono.model';
import { AbonoService } from 'app/shared/services/abono.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abono-list',
  templateUrl: './abono-list.component.html',
  styleUrls: ['./abono-list.component.css']
})
export class AbonoListComponent implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;

  Abonos: Abono[];
  isLoad:boolean

  constructor(
    // private _FacturasService:FacturasService,
    private _AbonoService:AbonoService,
    private _TablasService:TablasService,
  ) {}

  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._AbonoService.getAbono().subscribe((abono:Abono[])=> {
      // console.log(abono);

      this.Abonos = [...abono]
      this._TablasService.datosTablaStorage = [...abono]
      console.log("abono",this.Abonos);

      this._TablasService.total = abono.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.total = this.Abonos.length
    this._TablasService.datosTablaStorage = [...this.Abonos]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['cliente','nombreCompleto'],
      ['usuario','name'],
      ['recibo_historial','numero'],
      ['recibo_historial','id'],

    ];

    this._TablasService.buscarEnCampos(this.Abonos,camposPorFiltrar)


    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  eliminar({id}:Abono){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este abono se eliminará y no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._AbonoService.deleteAbono(id).subscribe((data)=>{
          this.Abonos = this.Abonos.filter(abono => abono.id != id)
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
