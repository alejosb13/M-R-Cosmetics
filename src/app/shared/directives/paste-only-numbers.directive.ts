import { Directive, HostListener } from '@angular/core'

@Directive({
  selector: '[appPasteOnlyNumbers]',
})
export class PasteOnlyNumDirective {
  regexStr = '^[0-9]*$'

  constructor() {}

  @HostListener('paste', ['$event']) blockPasteChar(e: ClipboardEvent) {
    return new RegExp(this.regexStr).test(e.clipboardData.getData('text'))
  }
}
