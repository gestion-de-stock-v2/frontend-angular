import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {

  getCurrentPosition(): Observable<LocationData> {
    return from(new Promise<LocationData>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Géolocalisation non supportée');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            const data = await res.json();
            resolve({
              latitude,
              longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Inconnu',
              country: data.address?.country || 'Inconnu'
            });
          } catch {
            resolve({ latitude, longitude, city: 'Inconnu', country: 'Inconnu' });
          }
        },
        (error) => reject(error.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }));
  }
}
