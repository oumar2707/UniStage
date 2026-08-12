import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    @switch (status) {
      @case ('OUVERTE') {
        <span class="badge badge-open"><i class="fa-solid fa-circle-check"></i> Ouverte</span>
      }
      @case ('FERMEE') {
        <span class="badge badge-closed"><i class="fa-solid fa-circle-xmark"></i> Fermée</span>
      }
      @case ('EN_ATTENTE') {
        <span class="badge badge-pending"><i class="fa-solid fa-clock"></i> En attente</span>
      }
      @case ('ACCEPTEE') {
        <span class="badge badge-accepted"><i class="fa-solid fa-circle-check"></i> Acceptée</span>
      }
      @case ('VALIDE') {
        <span class="badge badge-accepted"><i class="fa-solid fa-building-circle-check"></i> Validée</span>
      }
      @case ('REJETEE') {
        <span class="badge badge-rejected"><i class="fa-solid fa-circle-xmark"></i> Rejetée</span>
      }
      @case ('REFUSE') {
        <span class="badge badge-rejected"><i class="fa-solid fa-building-circle-xmark"></i> Refusée</span>
      }
      @default {
        <span class="badge badge-pending">{{ status }}</span>
      }
    }
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;
}
