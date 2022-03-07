import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  //create an instance to avoid conflict of race conditions
  product: Product = new Product();


  constructor(private productService: ProductService,
             private cartService: CartService,
             private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  //get the id param string and convert to number
  //asynchronous call- happens in the backgroup- RACE condition
  handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
    ;
  }

  addToCart(){

    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
