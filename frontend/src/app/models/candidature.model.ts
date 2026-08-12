export type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE';

export interface Candidature {
  id?: number;
  dateSoumission?: string;
  lettreMotivation: string;
  statut?: StatutCandidature;
  etudiantId?: number;
  etudiantNom?: string;
  etudiantPrenom?: string;
  etudiantEmail?: string;
  matricule?: string;
  filiere?: string;
  niveau?: string;
  telephone?: string;
  cv?: string;
  offreStageId?: number;
  offreTitre?: string;
  raisonSocialeEntreprise?: string;
}
