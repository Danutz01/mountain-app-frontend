import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number=1;
  searchMode: boolean = false;

  constructor(private productSerice: ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){

    //verificam daca parametrul id e available

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }

    //this.handleListProducts();
  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else{
      this.currentCategoryId=1;
    }

      this.productSerice.getProductList(this.currentCategoryId).subscribe(
        data => {
          this.products = data;
        }
      )
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    //const keywordParam = this.route.snapshot.paramMap.get('keyword');
    //const theKeyword: string = keywordParam === null ? 'defaultKeyword' : keywordParam;


    this.productSerice.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )

    //cautam produsele folosind keyword-ul
  }

}
