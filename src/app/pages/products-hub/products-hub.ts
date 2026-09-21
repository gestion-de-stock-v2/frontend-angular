import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';
import { Products } from '../products/products';
import { ProdutosComponent } from '../produtos/produtos.component';

type Tab = 'ms' | 'mono';

@Component({
  selector: 'app-products-hub',
  standalone: true,
  imports: [CommonModule, IconComponent, Products, ProdutosComponent],
  templateUrl: './products-hub.html',
  styleUrls: ['./products-hub.css']
})
export class ProductsHub {
  tab: Tab = 'ms';
  setTab(t: Tab): void { this.tab = t; }
}
