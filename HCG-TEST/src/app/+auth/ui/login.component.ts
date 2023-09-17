import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-40">
      <button class="px-6 py-3 bg-black rounded-sm text-white" (click)="login()">Login with github</button>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  clientId = '3f68ca8366b5d9990f6d';

  login() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${this.clientId}`);
  }
}
