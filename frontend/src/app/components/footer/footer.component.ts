import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="brand-logo">
            <i class="fa-solid fa-graduation-cap logo-icon"></i>
            <span class="logo-text">UniStage <span>Labé</span></span>
          </div>
          <p class="brand-desc">
            Plateforme officielle de gestion des offres de stage pour l'Université de Labé. Système centralisé pour la sélection, la candidature et la validation des stages de fin d'études.
          </p>
        </div>

        <div class="footer-links">
          <h4 class="footer-heading">Université de Labé</h4>
          <ul>
            <li><a href="https://www.univ-labe.edu.gn" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i> Site Web Officiel (univ-labe.edu.gn)</a></li>
            <li><a href="https://www.univ-labe.edu.gn" target="_blank" rel="noopener"><i class="fa-solid fa-building-columns"></i> Campus Universitaire de Hafia</a></li>
            <li><a href="https://www.univ-labe.edu.gn" target="_blank" rel="noopener"><i class="fa-solid fa-microchip"></i> Département d'Informatique (FST)</a></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4 class="footer-heading">Contact Officiel</h4>
          <p><i class="fa-solid fa-location-dot contact-icon"></i> Hafia, Préfecture de Labé, BP 210, Guinée</p>
          <p><i class="fa-solid fa-envelope contact-icon"></i> contact&#64;univ-labe.edu.gn</p>
          <p><i class="fa-solid fa-phone contact-icon"></i> (+224) 629 00 58 07</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <p class="copyright">&copy; 2026 Université de Labé (République de Guinée) &bull; Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: auto;
      background: linear-gradient(135deg, #0b132b 0%, #1c2541 100%);
      color: #94a3b8;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.9rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 3rem;
      padding: 3rem 1.5rem 2.25rem;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.85rem;
    }
    .logo-icon {
      font-size: 1.5rem;
      color: #38bdf8;
    }
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
    }
    .logo-text span {
      color: #38bdf8;
    }
    .brand-desc {
      font-size: 0.875rem;
      line-height: 1.6;
      color: #cbd5e1;
      max-width: 420px;
    }
    .footer-heading {
      color: #ffffff;
      font-size: 1rem;
      margin-bottom: 1.15rem;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
    }
    .footer-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer-links li {
      margin-bottom: 0.7rem;
    }
    .footer-links a {
      color: #cbd5e1;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s ease;
    }
    .footer-links a:hover {
      color: #38bdf8;
    }
    .footer-contact p {
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #cbd5e1;
    }
    .contact-icon {
      color: #38bdf8;
      font-size: 0.95rem;
    }
    .footer-bottom {
      background: rgba(0, 0, 0, 0.3);
      padding: 1.15rem 0;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
    }
    .copyright {
      font-size: 0.825rem;
      color: #94a3b8;
      margin: 0;
    }

    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class FooterComponent {}
