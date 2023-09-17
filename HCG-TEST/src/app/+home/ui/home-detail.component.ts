import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      home-detail works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeDetailComponent {

}
