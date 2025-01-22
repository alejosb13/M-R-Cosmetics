import { Component, Input } from '@angular/core';
import { TablasService } from '@app/shared/services/tablas.service';
import logger from '@app/shared/utils/logger';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-abono-historial-insert',
  templateUrl: './abono-historial-insert.component.html',
  styleUrls: ['./abono-historial-insert.component.scss']
})
export class AbonoHistorialInsertComponent {
  @Input() datosTablaStorage: any;
constructor(
  public _TablasService: TablasService,
) { }
  informacion:any[] = []
  page = 1;
  pageSize = environment.PageSize;
  
  ngOnChanges(): void {
    logger.log('data', this.datosTablaStorage);
    // this.datosTablaStorage.total = this.datosTablaStorage.estado_cuenta.length;
    // this.informacion = this.datosTablaStorage.estado_cuenta

    
    this._TablasService.datosTablaStorage = [...this.datosTablaStorage.estado_cuenta];
    this._TablasService.total = this.datosTablaStorage.estado_cuenta.length;
    this._TablasService.busqueda = "";
    this.refreshCountries();
  }

  refreshCountries() {
    logger.log('this.page', this.page);
    logger.log('this.pageSize', this.pageSize);
    this._TablasService.datosTablaStorage = [...this.datosTablaStorage.estado_cuenta].slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
}
