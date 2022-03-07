import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();


  constructor() { }

  addToCart(theCartItem: CartItem) {

    //check if we already have item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //find item in cart based on item id 

     existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );
     
      //check if we found item
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart){
      //increment the quanity
      existingCartItem.quantity++;
    }
    else{
      //just add the item to the array
      this.cartItems.push(theCartItem);
    }
    //comput cart total price and total quantity
    this.computeCartTotals();

  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0; 

    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values...all subscribers receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue)
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log('------');
  }

  decrementQuantity(theCartitem: CartItem) {
    theCartitem.quantity--;

    if(theCartitem.quantity ===0){
      this.remove(theCartitem);

    }
    else{
      this.computeCartTotals();
      
    }
  }
  remove(theCartitem: CartItem) {
    
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartitem.id);

    // if found, remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

}

