import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-dinamic-table",
  templateUrl: "./dinamic-table.component.html",
  styleUrls: ["./dinamic-table.component.scss"],
})
export class DinamicTableComponent {
  @Input() data: any[];
  @Input() total: any;
  @Input() headers: any[];
  @Input() loading: boolean;
  @Input() tableVersion!: string ; // Puedes cambiarlo dinámicamente

  // Configuración de paginación
  currentPage: number = 0;
  pageSize: number = 9; // Muestra 2 elementos por página

  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.tableVersion);
    
  }
  ngOnChanges(changes): void {
    console.log(this.data);
    console.log(this.tableVersion);
    
    
  }

  get paginatedData() {
    return this.data.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
