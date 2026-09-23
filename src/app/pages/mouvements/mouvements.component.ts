import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-mouvements',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './mouvements.component.html',
  styleUrls: ['./mouvements.component.css']
})
export class MouvementsComponent implements OnInit {
  produtos: any[] = [];
  movimentacoes: any[] = [];
  produtoSelecionadoId: number | null = null;
  novo: any = { type: 'ENTRY', quantity: 1, note: '' };
  erro = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getProdutos().subscribe(d => {
      this.produtos = d;
      if (d.length) {
        this.produtoSelecionadoId = d[0].id;
        this.carregar();
      }
    });
  }

  carregar(): void {
    if (!this.produtoSelecionadoId) return;
    this.api.getMovimentacoes(this.produtoSelecionadoId).subscribe(d => this.movimentacoes = d);
  }

  salvar(): void {
    this.erro = '';
    if (!this.produtoSelecionadoId) return;
    const payload = {
      productId: this.produtoSelecionadoId,
      type: this.novo.type,
      quantity: this.novo.quantity,
      note: this.novo.note
    };
    this.api.createMovimentacao(payload).subscribe({
      next: () => {
        this.novo.note = '';
        this.carregar();
        this.api.getProdutos().subscribe(d => this.produtos = d);
      },
      error: (e) => this.erro = e?.error?.message || 'Erreur : stock insuffisant'
    });
  }
}
