import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'compare-images-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
