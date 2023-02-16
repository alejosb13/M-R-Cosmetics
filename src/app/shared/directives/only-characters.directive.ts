import { Directive, HostListener, ElementRef } from '@angular/core'

@Directive({
  selector: '[appOnlyCharacters]',
})
export class OnlyCharactersDirective {
  regexStr = '^[a-zA-ZàáèéìíòóùúñÀÁÈÉÌÍÒÓÙÚÑ ]*$'

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    return new RegExp(this.regexStr).test(event.key)
  }
}
