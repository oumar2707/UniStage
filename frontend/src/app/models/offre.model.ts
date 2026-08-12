export type StatutOffre = 'OUVERTE' | 'FERMEE';

export interface OffreStage {
  id?: number;
  titre: string;
  description: string;
  competencesRequises: string;
  dateDebut?: string;
  dateFin?: string;
  lieu: string;
  statut?: StatutOffre;
  createdAt?: string;
  entrepriseId?: number;
  raisonSociale?: string;
  secteurActivite?: string;
  emailContact?: string;
  nombreCandidatures?: number;
}
