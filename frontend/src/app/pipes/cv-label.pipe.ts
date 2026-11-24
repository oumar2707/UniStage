import { Pipe, PipeTransform } from '@angular/core';

/**
 * Libellé lisible pour le champ CV, qui peut contenir un fichier encodé
 * (data:...;base64,...), un lien ou un simple nom de fichier.
 */
@Pipe({
  name: 'cvLabel',
  standalone: true
})
export class CvLabelPipe implements PipeTransform {
  transform(cv?: string | null): string {
    if (!cv || !cv.trim()) {
      return 'Aucun CV';
    }
    if (cv.startsWith('data:')) {
      const mime = cv.slice(5, cv.indexOf(';'));
      if (mime === 'application/pdf') return 'CV joint (PDF)';
      if (mime.includes('word')) return 'CV joint (Word)';
      return 'CV joint';
    }
    if (/^https?:\/\//i.test(cv)) {
      return 'Lien vers le CV';
    }
    return cv;
  }
}
