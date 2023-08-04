import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { UserService } from '../../services/user.service';
import * as XLSX from 'xlsx';
import { map } from 'rxjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import { saveAs } from "file-saver";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users = new Array();
  currentPage: number = 1;
  totalItems: number = 0;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.currentPage).subscribe(
      (next: any) => {
        this.users = next.data;
        this.totalItems = next.totalUsers;
      }, (err: any) => {
        console.log(err)
      }
    )
  }

  pageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    this.getUsers();
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      next => {
        this.currentPage = this.users.length == 1 ? (this.currentPage - 1) : this.currentPage;
        this.getUsers();
      }, err => {
        console.log(err)
      })
  }

  async exportexcel(withStatus = false) {
    /* table id is passed over here */
    // let element = document.getElementById('user-table');
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    let users = JSON.parse(JSON.stringify(this.users));

    if (withStatus) {
      for (const user of users) {
        user.status = await this.userService.getStatus();
        console.log(user)
      }
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'data.xlsx');

  }

  exportToPdf() {
    var doc = new jsPDF('p', 'pt');
    autoTable(doc, {
      body: this.users,
      columns: [
        { header: 'First Name', dataKey: 'firstName' },
        { header: 'Last Name', dataKey: 'lastName' },
        { header: 'Gender', dataKey: 'gender' },
      ]
    });
    doc.save("table.pdf");
  }

  exportToWord() {
    debugger
    const table = new Table({
      rows: this.getRows(),
    });



    const doc = new Document({
      sections: [{
        children: [table]
      }]
    })


    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }

  getRows() {
    const rows: TableRow[] = [];

    rows.push(new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph('First Name')],
        }),
        new TableCell({
          children: [new Paragraph('Last Name')],
        }),
        new TableCell({
          children: [new Paragraph('Gender')],
        })
      ]
    }))

    this.users.forEach(user => {
      rows.push(
        new TableRow({
          children: this.getCells(user)
        }))
    });
    return rows;
  }

  getCells(user: any) {
    const keysToConsider = ['firstName', 'lastName', 'gender'];
    const cells: TableCell[] = [];
    keysToConsider.forEach(key => {
      cells.push(new TableCell({
        width: {
          size: '100pt',
          type: WidthType.DXA,
        },
        children: [new Paragraph(user[key])],
      }))
    })

    return cells;

  }


}
