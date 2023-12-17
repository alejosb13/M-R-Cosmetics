import { Component, ElementRef, TemplateRef } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import logger from "app/shared/utils/logger";

@Component({
  selector: "app-inversion",
  templateUrl: "./inversion.component.html",
  styleUrls: ["./inversion.component.scss"],
})
export class InversionComponent {
  constructor(private NgbModal: NgbModal) {}

  ngOnInit(): void {}

  FormsValues(productoDetalle: any) {
    console.log(productoDetalle);
  }

  openModal(content: TemplateRef<ElementRef>, options: NgbModalOptions = {}) {
    // logger.log("content", content);
    // logger.log("options", options);

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      ...options,
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }
}
