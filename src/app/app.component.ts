import { Component } from '@angular/core';

export class Customer {
	constructor(public first, public last, public streetAddr) {}
}

export class Order {
	constructor(public fruitName, public fruitPrice, public quantity, public total) {}
}

export class Fruit {
	constructor(public name, public price) {}
}

@Component({
	selector: 'app-root',
	template: `<h1>{{title}}</h1><br/>
	<form #customerForm="ngForm">
		<label class="custLabel">First Name</label>
		<input type="text" pattern="[a-zA-Z'-]*" [(ngModel)]="currentCustomer.first" name="firstName" #firstName="ngModel"> 
		<span class="errorMessage" *ngIf="firstName?.errors?.pattern">Only alphabets, hyphens and apostrophes are allowed.</span><br/>
		
		<label class="custLabel">Last Name</label>
		<input type="text" pattern="[a-zA-Z'-]*" [(ngModel)]="currentCustomer.last" name="lastName" #lastName="ngModel">
		<span class="errorMessage" *ngIf="lastName?.errors?.pattern">Only alphabets, hyphens and apostrophes are allowed.</span><br/>
		
		<label class="custLabel">Street Address</label>
		<input type="text" required [(ngModel)]="currentCustomer.streetAddr" name="address" #address="ngModel"><br/>
		<button type="submit" [disabled]="!customerForm.form.valid" (click)=process()>Submit Address</button>
		<span class="errorMessage" *ngIf="address?.errors?.required" [hidden]="address.pristine">The street address is required.</span><br/><br/>
	</form>

	<button type="button" [disabled]="!orderForm.form.valid" (click)=addOrder(fruitSelect)>Add Item</button>		
	<select [(ngModel)]='fruitSelect'>
		<option *ngFor="let fruit of fruits" [ngValue]="fruit">{{fruit.name}}</option>
	</select>
	<form #orderForm="ngForm" id="orderForm">
		<label id="qty">Qty</label>
		<input type="text" id="qtyInput" pattern="^[1-9][0-9]*" required [(ngModel)]="orderQuantity" name="quantity" #quantity="ngModel">
		<span class="errorMessage" *ngIf="quantity?.errors?.required">A quantity is required.</span>
		<span class="errorMessage" *ngIf="quantity?.errors?.pattern">Please enter a valid quantity.</span>
	</form><br/><br/><br/>

	<table>
		<tr>
			<th id="thMargin"></th>
			<th id="thQty">Qty</th>
			<th></th>
			<th>Unit Price</th>
			<th></th>
			<th>Amount</th>
		</tr>
		<tr *ngFor="let order of orders">
			<td class="trString">{{order.fruitName}}</td>
			<td class="tdNum">{{order.quantity}}</td>
			<td></td>
			<td class="tdNum">{{order.fruitPrice}}</td>
			<td></td>
			<td class="tdNum">{{order.total}}</td>
			<td></td>
			<td><input type='button' id="deleteBut" value='Delete' (click)=removeOrder(order)></td>
		</tr>
		<tr>
			<td>Subtotal</td><td></td><td></td><td></td><td></td>
			<td class="tdNum tdBorder">{{subtotal.toFixed(2)}}</td>
		</tr>
		<tr>
			<td>Taxes 7%</td><td></td><td></td><td></td><td></td>
			<td class="tdNum tdBorder">{{taxesTotal.toFixed(2)}}</td>
		</tr>
		<tr>
			<td>Total</td><td></td><td></td><td></td><td></td>
			<td class="tdNum tdBorder tdTotal">{{total.toFixed(2) | currency:'CAD':'symbol-narrow'}}</td>
		</tr>
	</table><br/>

	<p *ngIf="isFormSubmitted">Order for {{customerFirst}} {{customerLast}} at {{customerAddr}}.</p>`,
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'Fruit Orders';
	isFormSubmitted = false;
	fruitSelect: Fruit;
	orderQuantity = 1;
	subtotal = 0.00;
	taxes = 0.07;
	taxesTotal = 0.00;
	total = 0.00;
	orders:Array<Order> = [];
	customerFirst: string;
	customerLast: string;
	customerAddr: string;

	currentCustomer:Customer = {
		first: '',
		last: '',
		streetAddr: ''
	};

	fruits: Fruit[] = [
		{name: "Apples", price: 0.89},
		{name: "Peaches", price: 1.45},
		{name: "Pears", price: 1.18},
		{name: "Plums", price: 2.02},
	];

	addOrder(fruit: Fruit) {
		let currentOrder: Order = {
			fruitName: '',
			fruitPrice: 0,
			quantity: 0,
			total: 0
		}

		currentOrder.fruitName = fruit.name;
		currentOrder.fruitPrice = fruit.price;
		currentOrder.quantity = this.orderQuantity;
		currentOrder.total = parseFloat((currentOrder.fruitPrice * currentOrder.quantity).toFixed(2));
		this.subtotal += currentOrder.total;
		this.taxesTotal = this.subtotal * this.taxes;
		this.total = this.subtotal + this.taxesTotal;
		this.orders.push(currentOrder);
	}

	removeOrder(order: Order) {
		for(let i = 0; i < this.orders.length; i++) {
			if(this.orders[i] === order) {
				if(this.orders.length === 1) {
					this.subtotal = 0.00;
					this.taxesTotal = 0.00;
					this.total = 0.00;

				} else {
					this.subtotal -= this.orders[i].total;
					this.taxesTotal = this.subtotal * this.taxes;
					this.total = this.subtotal + this.taxesTotal;
				}
				
				this.orders.splice(i, 1);
			}
		}
	}

	process() {
		this.isFormSubmitted = true;
		this.customerFirst = this.currentCustomer.first;
		this.customerLast = this.currentCustomer.last;
		this.customerAddr = this.currentCustomer.streetAddr;
	}
}
