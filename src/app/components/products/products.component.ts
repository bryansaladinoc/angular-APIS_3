import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { Product } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnChanges {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProduct = false;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
      .subscribe(data => {
        this.products = data;
      });
  }

  ngOnChanges(): void {
    console.log('xd');
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  onShowDetail(id: string) {
    this.productsService.getProduct(id).subscribe(data => {
      console.log(data);
      this.showProduct = true;
    });
  }

  toggleShowDetail() {
    this.showProduct = !this.showProduct;
  }
}
