export type RoleEnum = 'ETUDIANT' | 'ENTREPRISE' | 'ADMIN';
export type StatutValidation = 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleEnum;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleEnum;
  profileId?: number;
}

export interface RegisterEtudiantRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  matricule: string;
  filiere: string;
  niveau: string;
  telephone?: string;
  cv?: string;
}

export interface RegisterEntrepriseRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  raisonSociale: string;
  secteurActivite: string;
  adresse?: string;
  siteWeb?: string;
}
