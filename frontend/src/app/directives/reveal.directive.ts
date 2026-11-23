import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Fait apparaître l'élément (fondu + léger glissement) lorsqu'il entre dans l'écran.
 * Usage : <div appReveal [revealDelay]="100"></div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit() {
    const node: HTMLElement = this.el.nativeElement;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    node.classList.add('reveal');
    node.style.transitionDelay = `${this.revealDelay}ms`;

    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          this.observer?.disconnect();
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
