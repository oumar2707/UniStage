import { Component, Input } from '@angular/core';

/**
 * Bandeau d'en-tête des espaces connectés : photo en fond, titre et actions.
 * Le contenu projeté (boutons) s'affiche à droite.
 */
@Component({
  selector: 'app-page-banner',
  standalone: true,
  template: `
    <section class="banner" [style.--banner-img]="'url(' + image + ')'">
      <div class="banner-content">
        <div class="banner-text">
          @if (eyebrow) {
            <span class="banner-eyebrow anim-fade-up">{{ eyebrow }}</span>
          }
          <h1 class="anim-fade-up" style="animation-delay: 80ms">{{ title }}</h1>
          @if (subtitle) {
            <p class="anim-fade-up" style="animation-delay: 160ms">{{ subtitle }}</p>
          }
        </div>
        <div class="banner-actions anim-fade-up" style="animation-delay: 240ms">
          <ng-content></ng-content>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .banner {
      position: relative;
      overflow: hidden;
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;
      color: #ffffff;
      background: var(--primary);
    }
    .banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: var(--banner-img);
      background-size: cover;
      background-position: center 35%;
      animation: banner-zoom 14s ease-out both;
    }
    .banner::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(15, 27, 61, 0.92) 0%, rgba(15, 27, 61, 0.75) 55%, rgba(15, 27, 61, 0.35) 100%);
    }
    .banner-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 2.5rem 2.25rem;
      min-height: 200px;
    }
    .banner-eyebrow {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #c7d2fe;
      margin-bottom: 0.5rem;
    }
    h1 {
      color: #ffffff;
      font-size: 2.1rem;
      margin: 0 0 0.4rem;
    }
    p {
      margin: 0;
      color: #e5e7eb;
      max-width: 560px;
    }
    .banner-actions:empty {
      display: none;
    }
    @keyframes banner-zoom {
      from { transform: scale(1.08); }
      to { transform: scale(1); }
    }
    @media (max-width: 768px) {
      .banner-content {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.75rem 1.25rem;
        min-height: 0;
      }
      h1 { font-size: 1.6rem; }
      .banner-actions { width: 100%; }
    }
  `]
})
export class PageBannerComponent {
  @Input() image = '/images/etudiants.jpg';
  @Input() eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
}
