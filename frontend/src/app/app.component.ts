import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="content-wrapper">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .content-wrapper {
      min-height: calc(100vh - 140px);
    }
  `]
})
export class AppComponent {
  title = 'UniStage';
}
