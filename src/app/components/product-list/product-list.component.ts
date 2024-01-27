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
  previousCategoryId: number = 1;

  //new properties for pagination

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

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

    //Check if we have different category than previous
    //Note: Angular will reuse a component if it is currently being viewed
    //If we have a different categ id than previous
    //than set thePageNumber to 1

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

      this.productSerice.getProductListPaginate(this.thePageNumber - 1,
                                        this.thePageSize,
                                        this.currentCategoryId)
                                        .subscribe(
                                          data => {
                                            this.products = data._embedded.products;
                                            this.thePageNumber = data.page.number + 1;
                                            this.thePageSize = data.page.size;
                                            this.theTotalElements = data.page.totalElements;
                                          }
                                        );
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
