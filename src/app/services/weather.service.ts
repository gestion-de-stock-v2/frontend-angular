import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`
    );
  }

  getWeatherLabel(code: number): string {
    const labels: Record<number, string> = {
      0: 'Ciel dégagé', 1: 'Peu nuageux', 2: 'Partiellement nuageux', 3: 'Couvert',
      45: 'Brouillard', 48: 'Brouillard givrant',
      51: 'Bruine légère', 53: 'Bruine modérée', 55: 'Bruine dense',
      61: 'Pluie légère', 63: 'Pluie modérée', 65: 'Pluie forte',
      71: 'Neige légère', 73: 'Neige modérée', 75: 'Neige forte',
      80: 'Averses légères', 81: 'Averses modérées', 82: 'Averses violentes',
      95: 'Orage', 96: 'Orage avec grêle', 99: 'Orage violent'
    };
    return labels[code] || 'Inconnu';
  }
}
