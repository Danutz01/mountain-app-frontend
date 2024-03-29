import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { MeetmountainFormService } from 'src/app/services/meetmountain-form.service';
import { MeetmountainValidators } from 'src/app/validators/meetmountain-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;

  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMoths: number[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  countries: Country[] = [];
  
  constructor(private formBuilder: FormBuilder,
              private meetmountainFormService: MeetmountainFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), MeetmountainValidators.notOnlyWhitespace])
        //validate email, match any comination
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), MeetmountainValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populam cardul cu luni
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.meetmountainFormService.getCreditCardMoths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card moths: " + JSON.stringify(data));
        this.creditCardMoths = data;
      }
    )

    //populam cardul cu ani
    this.meetmountainFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved cred card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    //populam tarile
    this.meetmountainFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  copyShippingAddressToBillingAddress(event: Event) {
    // Use a type guard to narrow down the type of the event target
    if (event.target instanceof HTMLInputElement && event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  //getters for customer
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  //getters for shippingAddress
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  
  //getters for billingAddress
  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  
  //getters for credit card

  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCarSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The shipping address country is: " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is: " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1;
    }else{
      startMonth = 1;
    }

    this.meetmountainFormService.getCreditCardMoths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMoths = data;
      }
    )
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.meetmountainFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    )
  }

}
