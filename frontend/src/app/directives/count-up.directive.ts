import { Directive, ElementRef, Input, OnChanges, OnDestroy, inject } from '@angular/core';

/**
 * Anime un nombre de sa valeur précédente jusqu'à la valeur cible.
 * Usage : <span [appCountUp]="stats.total"></span>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnChanges, OnDestroy {
  @Input({ required: true }) appCountUp = 0;
  @Input() countDuration = 900;

  private el = inject(ElementRef<HTMLElement>);
  private current = 0;
  private frame = 0;

  ngOnChanges() {
    const target = Number(this.appCountUp) || 0;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    cancelAnimationFrame(this.frame);
    if (reduceMotion || target === this.current) {
      this.render(target);
      return;
    }

    const from = this.current;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / this.countDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      this.render(Math.round(from + (target - from) * eased));
      if (t < 1) {
        this.frame = requestAnimationFrame(step);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
  }

  private render(value: number) {
    this.current = value;
    this.el.nativeElement.textContent = String(value);
  }
}
