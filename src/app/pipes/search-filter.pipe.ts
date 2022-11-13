import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../model/product';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(products: Product[], searchInput: string, filterOption: string): Product[] {
    //console.log(filterOption);
    if (!products || !searchInput) {
      return products;
    } else if (filterOption === "product") {
      return products.filter(product => product.productDetails.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()))
    } else {
      return products.filter(product => product.user.nickname.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
    }
    // return products.filter(product =>
    //   product.productDetails.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()) ||
    //   product.user.nickname.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
  }

}
