import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GetBrands } from '../Serices/getBrands.service';

type MyBrand = {
  number_profiles: number,
  name: string,
  totalFollowers: number,
  totalEngadgement: number,
  id: string,
  date: number
}
type MyBrandTableChange = [MyBrand[], Boolean]
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(private getBrand: GetBrands) {

  }

  @Output() newTableChange: EventEmitter<{ data: MyBrand[], flag: boolean }> = new EventEmitter<{ data: MyBrand[], flag: boolean }>()

  onClick(range: FormGroup) {
    if (!range.get('start')?.valid && !range.get('end')?.valid) {
      alert("Please insert a good date!")
    }
    const emptyBrand: MyBrand[] = []
    this.newTableChange.emit({ data: emptyBrand, flag: true })
    this.getBrands(range)
  }
  async getBrands(range: FormGroup) {
    const msg = "Please insert a date"
    console.log(range.get('start')?.value, range.get('end')?.value, "Start end dates")
    if (range.get('start')?.value == null || range.get('end')?.value == null)
      alert(msg)
    else {
      const startDate = new Date(range.get('start')?.value).getTime();
      const endDate = new Date(range.get('end')?.value).getTime();
      await this.getBrand.getBrands(startDate, endDate);
      // this.getBrand.show(dateTimestamp);
      this.newTableChange.emit({ data: this.getBrand.brandArray, flag: true })
    }
  }
  resetDate() {
    this.range.controls['start'].setValue(null)
    this.range.controls['end'].setValue(null)
  }
}
