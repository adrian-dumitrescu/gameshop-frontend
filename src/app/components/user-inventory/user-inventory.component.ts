import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-inventory',
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.scss']
})
export class UserInventoryComponent implements OnInit {

  one: string = "one";
  image: string = "../assets/inventory-game-icon/overwatch-2_76x76.png";
  discountApplied: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}
