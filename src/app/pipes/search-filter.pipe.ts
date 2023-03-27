import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../model/product';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(products: Product[], searchInput: string, filterOption: string, userNickname: string): Product[] | null{
    if (!products || !searchInput) {
      return null;
    }  else if (filterOption === "product") {
      let productsArray = products.filter(product => product?.productDetails.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
      productsArray = productsArray.filter(product => product.user.nickname.toLocaleLowerCase() !== userNickname.toLocaleLowerCase()) // if I have products listed for purchase, eliminate them from the results (find by nickname and filter)

      return productsArray.sort((a,b) => (this.getDiscountedPrice(a) < this.getDiscountedPrice(b))? -1 : 1);
    } else if (filterOption === "nickname"){
      let productsArray = products.filter(product => product?.user?.nickname.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
      productsArray = productsArray.filter(product => product.user.nickname.toLocaleLowerCase() !== userNickname.toLocaleLowerCase()) // if I have products listed for purchase, eliminate them from the results (find by nickname and filter)
      
      return productsArray.sort((a,b) => (this.getDiscountedPrice(a) < this.getDiscountedPrice(b))? -1 : 1);
    }else{
      //const productEmpty = new Product[] = [];
      return null;
    }
    // return products.filter(product =>
    //   product.productDetails.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()) ||
    //   product.user.nickname.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
  }

  public getDiscountedPrice(product: Product): number {
    let discountedPrice = product?.pricePerKey - (product?.pricePerKey * product?.discountPercent / 100);
    return discountedPrice;
  }

}
