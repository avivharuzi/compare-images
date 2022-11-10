import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  fromBase64ToImageResolution,
  fromFileToBase64,
} from '@compare-images/shared/util-helpers';

import { InputFileImage } from './input-file-image.model';

@Component({
  selector: 'compare-images-input-file-image',
  standalone: true,
  templateUrl: './input-file-image.component.html',
  styleUrls: ['./input-file-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFileImageComponent {
  @Input() name = '';

  @Output() changed = new EventEmitter<InputFileImage | null>();

  async onInputFileChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (!files.length) {
      this.changed.emit(null);

      return;
    }

    const file = files[0] as File;
    const base64 = await fromFileToBase64(file);
    const resolution = await fromBase64ToImageResolution(base64);

    this.changed.emit({
      base64,
      resolution,
    });
  }
}
