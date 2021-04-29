import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/restaurant';
import { Order } from './order.service';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GlobalState } from '../store/reducers';
import { createOrder } from '../store/actions';
import { FormGroupState } from 'ngrx-forms';
import { map, take } from 'rxjs/operators';


@Component({
  selector: 'pmo-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit, OnDestroy {
  orderFormState$: Observable<FormGroupState<Order>>;
  restaurant: Restaurant;
  isLoading: boolean = true;
  orderTotal: number = 0.0;
  orderProcessing: boolean = false;
  createdOrder: Observable<Order | null>;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private restaurantService: RestaurantService,
    private store: Store<GlobalState>
  ) { 
    this.createdOrder = store.pipe(
      select('order'),
      select('mostRecentOrder') // normally you'd build a real selector
    );
    this.orderFormState$ = store.pipe(
      select('order'),
      select('orderForm')
    );
    this.orderFormState$.subscribe(console.log)
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    this.restaurantService.getRestaurant(slug).subscribe((data:Restaurant) => {
      this.restaurant = data;
      this.isLoading = false;      
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChanges() {
  }

  onSubmit() {
    this.orderProcessing = true;
    this.orderFormState$.pipe(
      take(1),
      map(form => form.value)
    ).subscribe(orderFormValue => {
      this.store.dispatch(createOrder({ order: orderFormValue }));
    })
  }

  startNewOrder() {
  }

}
