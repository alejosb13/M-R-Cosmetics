import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Subscription } from "rxjs";

@Component({
  moduleId: module.id,
  selector: "fixedplugin-cmp",
  templateUrl: "fixedplugin.component.html",
})
export class FixedPluginComponent implements OnInit {
  public sidebarColor: string = "white";
  public sidebarActiveColor: string = "danger";
  public themeSubscription: Subscription;

  public state: boolean = true;

  constructor(private _CommunicationService: CommunicationService) {}

  changeSidebarColor(color) {
    // let sidebar = <HTMLElement>document.querySelector(".sidebar");
    // let panel = <HTMLElement>document.querySelector(".main-panel");
    this._CommunicationService.setTheme(color);
    // this.sidebarColor = color;

    // if (sidebar != undefined) {
    // sidebar.setAttribute("data-color", color);
    // panel.setAttribute("data-color", color);

    // }
  }

  changeSidebarActiveColor(color) {
    let sidebar = <HTMLElement>document.querySelector(".sidebar");
    let panel = <HTMLElement>document.querySelector(".main-panel");

    this.sidebarActiveColor = color;
    if (sidebar != undefined) {
      sidebar.setAttribute("data-active-color", color);
      panel.setAttribute("data-active-color", color);
    }
  }

  ngOnInit() {
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color) => {
        this.sidebarColor = color;
      });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}
