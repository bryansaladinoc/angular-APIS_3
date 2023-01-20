import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { Product, CreateProductDTO, UpdateProductDTO } from '../../models/product.model';

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
  limit = 10;
  offset = 0;
  totalProducts = 50;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnChanges(): void {
    console.log();

  }

  getAllProducts() {
    this.productsService.getAllProducts(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.toggleShowDetail();
    this.productsService.getProduct(id).subscribe(data => {
      this.productChosen = data;
      this.statusDetail = 'success';
    }, errorMsg => {
      window.alert(errorMsg);
      this.statusDetail = 'error';
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

  updateProduct() {
    const changues: UpdateProductDTO = {
      title: 'gato con ojos azules'
    }

    const id = this.productChosen.id;
    this.productsService.update(id, changues).subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id == this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id == this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.toggleShowDetail();
    });
  }

}
