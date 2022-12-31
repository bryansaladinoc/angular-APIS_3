import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { Product, CreateProductDTO } from '../../models/product.model';

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
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
      typeImg: ''
    },
    description: ''
  };

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
      this.toggleShowDetail();
      this.productChosen = data;
    });
  }

  toggleShowDetail() {
    this.showProduct = !this.showProduct;
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      price: 1000,
      images: [''],
      description: 'bla bla bla',
      categoryId: 3
    }
    this.productsService.create(product).subscribe(data => {
      this.products.unshift(data);
    });
  }
}
