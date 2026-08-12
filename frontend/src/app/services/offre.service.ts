import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OffreStage } from '../models/offre.model';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getOffresPubliques(secteur?: string, motCle?: string): Observable<OffreStage[]> {
    let params = new HttpParams();
    if (secteur) params = params.set('secteur', secteur);
    if (motCle) params = params.set('motCle', motCle);
    return this.http.get<OffreStage[]>(`${this.apiUrl}/offres/public`, { params });
  }

  getOffrePublicById(id: number): Observable<OffreStage> {
    return this.http.get<OffreStage>(`${this.apiUrl}/offres/public/${id}`);
  }

  getOffresEntreprise(): Observable<OffreStage[]> {
    return this.http.get<OffreStage[]>(`${this.apiUrl}/entreprise/offres`);
  }

  createOffre(offre: OffreStage): Observable<OffreStage> {
    return this.http.post<OffreStage>(`${this.apiUrl}/entreprise/offres`, offre);
  }

  updateOffre(id: number, offre: OffreStage): Observable<OffreStage> {
    return this.http.put<OffreStage>(`${this.apiUrl}/entreprise/offres/${id}`, offre);
  }

  deleteOffreEntreprise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/entreprise/offres/${id}`);
  }

  getAllOffresAdmin(): Observable<OffreStage[]> {
    return this.http.get<OffreStage[]>(`${this.apiUrl}/admin/offres`);
  }

  deleteOffreAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/offres/${id}`);
  }
}
