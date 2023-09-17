import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found-route',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      not-found-route works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundRouteComponent {

}
