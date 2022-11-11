import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

import {
  BehaviorSubject,
  combineLatestWith,
  first,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import {
  DiffBetweenImageCanvasPointsOptions,
  drawImageAndPointsToCanvas,
  getDiffBetweenImageCanvasPoints,
  getImageCanvasPoints,
} from '@compare-images/shared/util-helpers';

import { DiffFormComponent } from './diff-form';
import { InputFileImage } from './input-file-image';
import { LoaderComponent } from './loader';
import { NavbarComponent } from './navbar';
import { SelectImageComponent } from './select-image';

export type View = 'compare-result' | 'select-images';

@Component({
  selector: 'compare-images-root',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    LoaderComponent,
    NavbarComponent,
    SelectImageComponent,
    DiffFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('resultImageCanvasElement')
  resultImageCanvasElement!: ElementRef<HTMLCanvasElement>;

  @ViewChild(DiffFormComponent) diffFormComponent!: DiffFormComponent;

  private viewBehaviorSubject = new BehaviorSubject<View>('select-images');

  private originalImageBehaviorSubject =
    new BehaviorSubject<InputFileImage | null>(null);

  private changedImageBehaviorSubject =
    new BehaviorSubject<InputFileImage | null>(null);

  private isLoadingBehaviorSubject = new BehaviorSubject<boolean>(false);

  get view$(): Observable<View> {
    return this.viewBehaviorSubject.asObservable();
  }

  get originalImage$(): Observable<InputFileImage | null> {
    return this.originalImageBehaviorSubject.asObservable();
  }

  get changedImage$(): Observable<InputFileImage | null> {
    return this.changedImageBehaviorSubject.asObservable();
  }

  get isLoading$(): Observable<boolean> {
    return this.isLoadingBehaviorSubject.asObservable();
  }

  get images$(): Observable<{
    originalImage: InputFileImage | null;
    changedImage: InputFileImage | null;
  }> {
    return this.originalImage$.pipe(
      combineLatestWith(this.changedImage$),
      map(([originalImage, changedImage]) => {
        return {
          originalImage,
          changedImage,
        };
      })
    );
  }

  get hasLoadedImages$(): Observable<boolean> {
    return this.images$.pipe(
      map((images) => Boolean(images.originalImage && images.changedImage))
    );
  }

  updateOriginalImage(data: InputFileImage | null): void {
    this.originalImageBehaviorSubject.next(data);
  }

  updateChangedImage(data: InputFileImage | null): void {
    this.changedImageBehaviorSubject.next(data);
  }

  compareImages(): void {
    this.isLoadingBehaviorSubject.next(true);

    this.images$
      .pipe(
        first(),
        switchMap((images) => {
          const { originalImage, changedImage } = images;

          if (!originalImage || !changedImage) {
            throw new Error('Images are not loaded yet');
          }

          return forkJoin([
            from(getImageCanvasPoints(originalImage.base64)),
            from(getImageCanvasPoints(changedImage.base64)),
            of(images),
          ]);
        }),
        tap(([originalImageCanvasPoints, changedImageCanvasPoints, images]) => {
          const diffFormValue = this.diffFormComponent.formValue;
          const diffOptions: Partial<DiffBetweenImageCanvasPointsOptions> = {};

          if (diffFormValue.type === 'rgb') {
            diffOptions.inRGB = diffFormValue.value;
          } else {
            diffOptions.inPercent = diffFormValue.value / 100;
          }

          const { diffs } = getDiffBetweenImageCanvasPoints(
            {
              originalPoints: originalImageCanvasPoints,
              changedPoints: changedImageCanvasPoints,
            },
            diffOptions
          );

          if (!images.originalImage) {
            return;
          }

          const points = diffs.map((diff) => {
            return {
              x: diff.originalPoint.x,
              y: diff.originalPoint.y,
            };
          });

          drawImageAndPointsToCanvas(
            this.resultImageCanvasElement.nativeElement,
            images.originalImage.base64,
            {
              points,
            }
          ).then(() => {
            this.isLoadingBehaviorSubject.next(false);
            this.viewBehaviorSubject.next('compare-result');
          });
        })
      )
      .subscribe();
  }
}
