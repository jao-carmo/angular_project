import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
    }
  `]
})
export class AppComponent {
  title = 'angular-supabase-dashboard';
}
