import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[appOnlyAlphanumeric]',
})
export class OnlyAlphanumericDirective {
  regexStr = '^[0-9a-zA-ZàáèéìíòóùúÀÁÈÉÌÍÒÓÙÚ ]*$'

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key)
  }
}
