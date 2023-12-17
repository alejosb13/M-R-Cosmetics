import { Component, Input, OnInit } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import logger from 'app/shared/utils/logger';

export interface Messages {
  [key: string]: string;
}

@Component({
  selector: "app-valid-error-messages-form",
  templateUrl: "./valid-error-messages-form.component.html",
  styleUrls: ["./valid-error-messages-form.component.scss"],
})
export class ValidErrorMessagesFormComponent implements OnInit {
  @Input() errors: ValidationErrors;
  @Input() messages: Messages;

  constructor() {}

  ngOnInit(): void {
    logger.log("errors ",this.errors)
    logger.log("messages ",this.messages)
  }
}
