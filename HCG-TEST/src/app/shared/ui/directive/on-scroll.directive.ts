import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appOnScroll]',
  standalone: true
})
export class OnScrollDirective {
  @Output() emitScroll: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('scroll', ['$event'])
  onWindowScroll($event: { target: { scrollTop: any; clientHeight: any; scrollHeight: any; }; }) {
    const { scrollTop, clientHeight, scrollHeight } = $event.target;
    if ((scrollTop + clientHeight + 5) >= scrollHeight) {
      this.emitScroll.emit(true)
    }
  }
}
