import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = '/api/v1/payments';

  constructor(private http: HttpClient) {}

  create(req: PaymentRequest): Observable<number> {
    return this.http.post<number>(this.base, req);
  }
}
