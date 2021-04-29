import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/restaurant';
import { OrderService, Order } from './order.service';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GlobalState } from '../store/reducers';
import { createOrder } from '../store/actions';


function minLengthArray(min: number) {
  return (c: AbstractControl): {[key: string]: any} => {
      if (c.value.length >= min)
          return null;
      return { 'minLengthArray': {valid: false }};
  }
}

@Component({
  selector: 'pmo-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  restaurant: Restaurant;
  isLoading: boolean = true;
  items: FormArray;
  orderTotal: number = 0.0;
  orderProcessing: boolean = false;
  createdOrder: Observable<Order | null>;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private store: Store<GlobalState>
  ) { 
    this.createdOrder = store.pipe(
      select('order'),
      select('mostRecentOrder') // normally you'd build a real selector
    );
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.restaurantService.getRestaurant(slug).subscribe((data:Restaurant) => {
      this.restaurant = data;
      this.isLoading = false;      
      this.createOrderForm();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createOrderForm() {
    this.orderForm = this.formBuilder.group({
      restaurant: [this.restaurant._id],
      name: [null],
      address:  [null],
      phone: [null],
      items: [[], minLengthArray(1)]
    });
    this.onChanges();
  }

  onChanges() {
    this.subscription = this.orderForm.get('items').valueChanges.subscribe(val => {
      this.orderTotal = this.orderService.getTotal(val);
    });
  }

  onSubmit() {
    this.orderProcessing = true;
    this.store.dispatch(createOrder({ order: this.orderForm.value }));
  }

  startNewOrder() {
    this.createOrderForm();
  }

}
