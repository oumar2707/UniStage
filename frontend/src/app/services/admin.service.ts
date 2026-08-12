import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EntrepriseAdminDTO {
  id: number;
  raisonSociale: string;
  secteurActivite: string;
  adresse: string;
  siteWeb: string;
  statutValidation: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    createdAt: string;
  };
}

export interface EtudiantAdminDTO {
  id: number;
  matricule: string;
  filiere: string;
  niveau: string;
  telephone: string;
  cv: string;
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    createdAt: string;
  };
}

export interface GlobalStatsDTO {
  totalEtudiants: number;
  totalEntreprises: number;
  totalOffres: number;
  totalCandidatures: number;
  entreprisesValides: number;
  entreprisesEnAttente: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // ENTREPRISES
  getAllEntreprises(statut?: string): Observable<EntrepriseAdminDTO[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    return this.http.get<EntrepriseAdminDTO[]>(`${this.apiUrl}/entreprises`, { params });
  }

  validerEntreprise(id: number, statut: 'VALIDE' | 'REFUSE'): Observable<EntrepriseAdminDTO> {
    return this.http.patch<EntrepriseAdminDTO>(`${this.apiUrl}/entreprises/${id}/validation`, { statut });
  }

  deleteEntreprise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/entreprises/${id}`);
  }

  // ÉTUDIANTS
  getAllEtudiants(): Observable<EtudiantAdminDTO[]> {
    return this.http.get<EtudiantAdminDTO[]>(`${this.apiUrl}/etudiants`);
  }

  updateEtudiant(id: number, data: Partial<EtudiantAdminDTO>): Observable<EtudiantAdminDTO> {
    return this.http.put<EtudiantAdminDTO>(`${this.apiUrl}/etudiants/${id}`, data);
  }

  deleteEtudiant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/etudiants/${id}`);
  }

  // STATISTIQUES
  getStats(): Observable<GlobalStatsDTO> {
    return this.http.get<GlobalStatsDTO>(`${this.apiUrl}/stats`);
  }
}
