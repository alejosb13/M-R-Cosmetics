import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[appOnlyDecimals]',
})
export class OnlyDecimalsDirective {
  regexStr = '^[0-9],*$'

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key)
  }
}
