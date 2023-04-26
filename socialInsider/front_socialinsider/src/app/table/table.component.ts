import { MatTableDataSource } from '@angular/material/table';

import { Component, OnInit } from '@angular/core';
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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: []
})

export class TableComponent {
  dataSource = new MatTableDataSource<MyBrand>()
  displayedColumns: string[] = ['brandname', 'totalProfiles', 'totalFollowers', 'totalEngadgement'];
  isFetching = false

  onFilter(event: { data: MyBrand[], flag: boolean }) {
    const { data, flag } = event
    this.dataSource.data = []
    this.isFetching = flag

    for (const brand of data) {
      const data = this.dataSource.data;
      data.push(brand);
      this.dataSource.data = data
      this.isFetching = flag
    }
    if (this.dataSource.data.length != 0)
      this.isFetching = false
    //this protect the Loading...
  }
}