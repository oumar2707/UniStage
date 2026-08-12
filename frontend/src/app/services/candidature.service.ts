import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidature } from '../models/candidature.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  postuler(offreId: number, lettreMotivation: string, cv?: string): Observable<Candidature> {
    const params = new HttpParams().set('offreId', offreId.toString());
    return this.http.post<Candidature>(`${this.apiUrl}/etudiant/candidatures`, { lettreMotivation, cv }, { params });
  }

  getMesCandidaturesEtudiant(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/etudiant/candidatures`);
  }

  getCandidaturesEntreprise(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/entreprise/candidatures`);
  }

  getCandidaturesByOffre(offreId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/entreprise/offres/${offreId}/candidatures`);
  }

  updateStatutCandidature(candidatureId: number, statut: string): Observable<Candidature> {
    return this.http.patch<Candidature>(`${this.apiUrl}/entreprise/candidatures/${candidatureId}/statut`, { statut });
  }
}
