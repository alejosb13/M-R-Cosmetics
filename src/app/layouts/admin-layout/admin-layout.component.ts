import { Component, OnInit } from "@angular/core";
import { CommunicationService } from "@app/shared/services/communication.service";
import { AuthService } from "app/auth/login/service/auth.service";
import { CronService } from "app/shared/services/cron.service";
import logger from "app/shared/utils/logger";
import { interval, Subject, Subscription } from "rxjs";
import { catchError, exhaustMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  themeSubscription: Subscription;
  themeSite: string;

  constructor(
    private _CronService: CronService,
    private _AuthService: AuthService,
    public _CommunicationService: CommunicationService
  ) {}

  ngOnInit() {
    this.refreshIndices();
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color;
      });
  }

  private refreshIndices() {
    if (this._AuthService.isLogin) {
      const { roleId, roleName, userId } = this._AuthService.dataStorage.user;
      // let refreshIndices = interval(40000).pipe(
      let refreshIndices = interval(40000).pipe(
        exhaustMap(() =>
          this._CronService.getRefreshIndices({
            roleId,
            roleName,
            userId,
            disablePaginate: 1,
            estado: 1,
          })
        ),
        takeUntil(this.ngUnsubscribe),
        catchError((e, caught) => caught)
      );
      // if(environment.production)
      refreshIndices.subscribe((result) => {
        logger.log(result);
      });
      // }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.themeSubscription.unsubscribe();
  }
}
