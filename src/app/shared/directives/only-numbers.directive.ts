import { Directive, HostListener, ElementRef } from '@angular/core'

@Directive({
  selector: '[appOnlyNumbers]',
})
export class OnlyNumbersDirective {
  regexStr = '^[0-9]*$'

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    console.log("asfasf");
    
    return new RegExp(this.regexStr).test(event.key)
  }
}
