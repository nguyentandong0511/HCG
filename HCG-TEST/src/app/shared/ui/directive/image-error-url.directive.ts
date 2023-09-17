import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'img[src][appImageErrorUrl]',
  standalone: true,
})
export class ImageErrorUrlDirective {
  constructor(private _el: ElementRef) { }

  @HostListener('error')
  ifSrcInvalid() {
    (this._el.nativeElement as HTMLImageElement).src = '/assets/images/no-avatar.png';
  }
}
