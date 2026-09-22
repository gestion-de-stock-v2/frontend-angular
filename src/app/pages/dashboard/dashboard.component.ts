import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../../components/icon/icon.component';
import { GeolocationService, LocationData } from '../../services/geolocation.service';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // Stats
  totalProducts = 0;
  totalCustomers = 0;
  totalOrders = 0;
  stockTotal = 0;
  totalRevenue = 0;

  lowStockProducts: any[] = [];
  recentOrders: any[] = [];

  erro = '';
  loading = false;

  // Widgets
  currentTime = '';
  currentDate = '';
  timezone = '';
  private clockInterval: any;

  location: LocationData | null = null;
  locationError = '';

  weather: WeatherData | null = null;
  weatherError = '';
  weatherLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private geolocService: GeolocationService,
    private weatherService: WeatherService,
    private timeService: TimeService
  ) {}

  ngOnInit(): void {
    this.startClock();
    this.refreshLocation();
    this.carregar();
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  // Horloge temps réel
  startClock(): void {
    const update = () => {
      this.currentTime = this.timeService.getCurrentTime();
      this.currentDate = this.timeService.getCurrentDate();
      this.timezone = this.timeService.getTimezone();
    };
    update();
    this.clockInterval = setInterval(update, 1000);
  }

  // Géolocalisation + météo
  refreshLocation(): void {
    this.locationError = '';
    this.weatherError = '';
    this.weatherLoading = true;

    this.geolocService.getCurrentPosition().subscribe({
      next: (loc) => {
        this.location = loc;
        this.loadWeather(loc.latitude, loc.longitude);
      },
      error: (err) => {
        this.locationError = 'Position indisponible : ' + err;
        this.weatherLoading = false;
      }
    });
  }

  loadWeather(lat: number, lon: number): void {
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (res: any) => {
        this.weather = {
          temperature: res.current_weather.temperature,
          windspeed: res.current_weather.windspeed,
          weathercode: res.current_weather.weathercode,
          humidity: res.hourly?.relativehumidity_2m?.[0] || 0
        };
        this.weatherLoading = false;
      },
      error: () => {
        this.weatherError = 'Météo indisponible';
        this.weatherLoading = false;
      }
    });
  }

  weatherLabel(code: number): string {
    return this.weatherService.getWeatherLabel(code);
  }

  // Statistiques
  carregar(): void {
    this.erro = '';
    this.loading = true;

    // Produits (backend standalone)
    this.http.get<any>(`/api/produtos`).subscribe({
      next: (d) => {
        const list = Array.isArray(d) ? d : (d.content ?? []);
        this.totalProducts = list.length;
        this.stockTotal = list.reduce((s: number, p: any) => s + (p.quantidade || 0), 0);
        this.lowStockProducts = list
          .filter((p: any) => (p.quantidade || 0) < 10)
          .slice(0, 5)
          .map((p: any) => ({ name: p.nome, availableQuantity: p.quantidade }));
      },
      error: () => this.erro = 'Erreur chargement produits'
    });

    // Clients (microservices)
    this.http.get<any[]>(`/api/v1/customers`).subscribe({
      next: (d) => this.totalCustomers = d.length,
      error: () => {}
    });

    // Commandes (microservices)
    this.http.get<any[]>(`/api/v1/orders`).subscribe({
      next: (d) => {
        this.totalOrders = d.length;
        this.totalRevenue = d.reduce((s, o) => s + (o.totalAmount || 0), 0);
        this.recentOrders = d.slice(-5).reverse();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
