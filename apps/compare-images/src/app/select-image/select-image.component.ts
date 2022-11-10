import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { InputFileImage, InputFileImageComponent } from '../input-file-image';

@Component({
  selector: 'compare-images-select-image',
  standalone: true,
  imports: [NgIf, InputFileImageComponent],
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectImageComponent {
  @Input() title = '';

  @Input() name = '';

  @Input() image: InputFileImage | null = null;

  @Output() changed = new EventEmitter<InputFileImage | null>();
}
