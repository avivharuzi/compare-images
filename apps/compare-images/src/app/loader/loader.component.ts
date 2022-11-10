import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'compare-images-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
