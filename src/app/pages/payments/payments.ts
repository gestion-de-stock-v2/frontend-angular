import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { OrderService } from '../../services/order.service';
import { PaymentRequest } from '../../models/payment.model';
import { Order } from '../../models/order.model';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsComponent implements OnInit {
  orders: Order[] = [];
  novo: PaymentRequest = {
    amount: 0,
    paymentMethod: 'CREDIT_CARD',
    orderReference: '',
    customerFirstname: '',
    customerLastname: '',
    customerEmail: ''
  };
  loading = false;
  erro = '';
  success = '';

  constructor(private service: PaymentService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.findAll().subscribe((d: Order[]) => this.orders = d);
  }

  onOrderSelect(ref: string): void {
    const o = this.orders.find(x => x.reference === ref);
    if (o) {
      this.novo.amount = o.totalAmount;
      this.novo.paymentMethod = o.paymentMethod;
    }
  }

  submit(): void {
    this.erro = '';
    this.success = '';
    if (!this.novo.orderReference) { this.erro = 'Sélectionnez une commande'; return; }
    if (this.novo.amount <= 0) { this.erro = 'Montant invalide'; return; }

    this.loading = true;
    this.service.create(this.novo).subscribe({
      next: (id: number) => {
        this.loading = false;
        this.success = `Paiement enregistré (ID : ${id})`;
        this.novo = { amount: 0, paymentMethod: 'CREDIT_CARD', orderReference: '', customerFirstname: '', customerLastname: '', customerEmail: '' };
      },
      error: (e: HttpErrorResponse) => { this.loading = false; this.erro = e?.error?.message || 'Erreur'; }
    });
  }
}
