(function() {
  "use strict";

  Neo.Classes.TableTest = Neo.Classes.TestView.extend({
    init: function(config) {
      Neo.Classes.TestView.call(this, config);
    },

    buildComponent: function() {
      return {
        name: "Table",
        columns: {
          edit: {title: "Edit", width: "75px", formatter: function(args) {
            return {
                name: "Button",
                text: "Edit",
                custom: args.row.id
            };
          }},
          date: {title: "Date", width: "100px"},
          voucherNo: {title: "Voucher No", width: "50px"},
          category: {title: "Category", width: "200px"},
          issuedTo: {title: "Issued To", width: "100px"},
          cashAmount: {title: "Cash Amount", width: "100px"},
          chequeAmount: {title: "Cheque Amount", width: "100px"},
          chequeNo: {title: "Cheque Number", width: "100px"},
          chequeDate: {title: "Cheque Date", width: "100px"},
          bankName: {title: "Bank Name", width: "100px"},
          authorizedBy: {title: "Authorized By", width: "200px"},
          remark: {title: "Remark", width: "300px"}
        },
      };
    },

    tests: function(table) {
      var data = [
        {
            "id": "3",
            "date": "2012-09-26",
            "voucherNo": "1",
            "categoryId": "4",
            "issuedTo": "Babu Dey",
            "totalAmount": "640",
            "cashAmount": "640",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": " For Refresment Of Metting",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Pooja"
        },
        {
            "id": "4",
            "date": "2012-09-26",
            "voucherNo": "2",
            "categoryId": "1",
            "issuedTo": "Babu Dey",
            "totalAmount": "100",
            "cashAmount": "100",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "poiything Bag",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Printing & Stationary"
        },
        {
            "id": "5",
            "date": "2012-09-26",
            "voucherNo": "3",
            "categoryId": "10",
            "issuedTo": "Troyee Dewan",
            "totalAmount": "336",
            "cashAmount": "336",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Refrement Of Drama",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Entertainment"
        },
        {
            "id": "6",
            "date": "2012-09-26",
            "voucherNo": "4",
            "categoryId": "1",
            "issuedTo": "Troyee Dewan",
            "totalAmount": "220",
            "cashAmount": "220",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Zerox Of Drama Book",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Printing & Stationary"
        },
        {
            "id": "7",
            "date": "2012-09-05",
            "voucherNo": "5",
            "categoryId": "1",
            "issuedTo": "Babu Dey",
            "totalAmount": "420",
            "cashAmount": "420",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "files,note book,carbon,others",
            "authorizedBy": "P R Duttachuwdhary",
            "authorizedByPersonId": "17",
            "category": "Printing & Stationary"
        },
        {
            "id": "8",
            "date": "2012-10-01",
            "voucherNo": "6",
            "categoryId": "10",
            "issuedTo": "Antara Das",
            "totalAmount": "614",
            "cashAmount": "614",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Refrasment of dance rihersal",
            "authorizedBy": "P R Duttachuwdhary",
            "authorizedByPersonId": "17",
            "category": "Entertainment"
        },
        {
            "id": "9",
            "date": "2012-10-07",
            "voucherNo": "7",
            "categoryId": "1",
            "issuedTo": "S K Guha",
            "totalAmount": "30",
            "cashAmount": "30",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Printing & Stationary"
        },
        {
            "id": "11",
            "date": "2012-10-07",
            "voucherNo": "8",
            "categoryId": "10",
            "issuedTo": "A K Mazumder",
            "totalAmount": "855",
            "cashAmount": "855",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Refrasmen of drame rihersal.",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Entertainment"
        },
        {
            "id": "12",
            "date": "2012-10-10",
            "voucherNo": "9",
            "categoryId": "10",
            "issuedTo": "Troyee Dewan",
            "totalAmount": "89",
            "cashAmount": "89",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Refrasment Of Drama rihersal",
            "authorizedBy": "P R Duttachuwdhary",
            "authorizedByPersonId": "17",
            "category": "Entertainment"
        },
        {
            "id": "13",
            "date": "2012-10-10",
            "voucherNo": "10",
            "categoryId": "10",
            "issuedTo": "Troyee Dewan",
            "totalAmount": "30",
            "cashAmount": "30",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Refrasment Of Drama rihersal",
            "authorizedBy": "P R Duttachuwdhary",
            "authorizedByPersonId": "17",
            "category": "Entertainment"
        },
        {
            "id": "14",
            "date": "2012-10-12",
            "voucherNo": "11",
            "categoryId": "4",
            "issuedTo": "Babu Dey",
            "totalAmount": "5250",
            "cashAmount": "5250",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Shari,Dhoti,Gamcha(For Durga PUja)",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Pooja"
        },
        {
            "id": "15",
            "date": "2012-10-12",
            "voucherNo": "12",
            "categoryId": "4",
            "issuedTo": "Babu Dey",
            "totalAmount": "1050",
            "cashAmount": "1050",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Refrashment Of Puja`s Metting    ?",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Pooja"
        },
        {
            "id": "16",
            "date": "2012-10-12",
            "voucherNo": "13",
            "categoryId": "4",
            "issuedTo": "Babu Dey",
            "totalAmount": "1674",
            "cashAmount": "1674",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "B M C & Police Permision   ?",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Pooja"
        },
        {
            "id": "17",
            "date": "2012-10-04",
            "voucherNo": "14",
            "categoryId": "10",
            "issuedTo": "Antara Das",
            "totalAmount": "200",
            "cashAmount": "200",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Refrashment Of Dance rihersal",
            "authorizedBy": "P R Duttachuwdhary",
            "authorizedByPersonId": "17",
            "category": "Entertainment"
        },
        {
            "id": "18",
            "date": "2012-10-17",
            "voucherNo": "15",
            "categoryId": "8",
            "issuedTo": "Ravi Chowdhary",
            "totalAmount": "7340",
            "cashAmount": "7340",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Gift & prize Of V I A &Arists",
            "authorizedBy": "Babu Dey",
            "authorizedByPersonId": "15",
            "category": "Prize"
        },
        {
            "id": "19",
            "date": "2012-10-17",
            "voucherNo": "16",
            "categoryId": "10",
            "issuedTo": "B C Majumder",
            "totalAmount": "364",
            "cashAmount": "364",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Paid for refreshn\r\nment On 13/10/12   To 17/10/12 Puja Perpes \r\n\r\n",
            "authorizedBy": null,
            "authorizedByPersonId": null,
            "category": "Entertainment"
        },
        {
            "id": "20",
            "date": "2012-10-18",
            "voucherNo": "17",
            "categoryId": "4",
            "issuedTo": "Babu Dey",
            "totalAmount": "626",
            "cashAmount": "626",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Banner Of Durga Puja & Advertiment",
            "authorizedBy": null,
            "authorizedByPersonId": null,
            "category": "Pooja"
        },
        {
            "id": "21",
            "date": "2012-10-18",
            "voucherNo": "18",
            "categoryId": "8",
            "issuedTo": "Babu Dey",
            "totalAmount": "70",
            "cashAmount": "70",
            "chequeAmount": "0",
            "chequeNo": "0",
            "chequeDate": "0000-00-00",
            "bankName": "",
            "remark": "Paid ForFlex Printing durga Puja",
            "authorizedBy": null,
            "authorizedByPersonId": null,
            "category": "Prize"
        }
      ];

      table.data = data;

      describe("Table", function() {
        // Write test cases here
      });
    }
  });
}());