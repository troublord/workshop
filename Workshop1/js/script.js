
var bookDataFromLocalStorage = [];
var bookCategorySwitch = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];
function DynamicImage(src) {//更改圖片
    document.getElementById("book-image").src = src;
    console.log(src);

}


// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
        
    }
}
function pushBookData() {
    

    var myselect = document.getElementById("book_category");

    bookDataFromLocalStorage.push({
        "BookId": bookDataFromLocalStorage.length,
        "BookCategory": myselect.options[myselect.selectedIndex].text,
        "BookName": document.getElementById('book_name').value,
        "BookAuthor": document.getElementById('book_author').value,
        "BookBoughtDate": document.getElementById('bought_datepicker').value,
        "BookDeliveredDate": document.getElementById('delivered_datepicker').value,
        "BookPrice": document.getElementById('book_price').value,
        "BookAmount": document.getElementById('book_amount').value,
        "BookTotal": document.getElementById("book_total").textContent
    });
    Pageload();
   
}


//把英文書本種類改成中文
function ChangeCategory() {
    for (var i in bookDataFromLocalStorage) {
        if (bookDataFromLocalStorage[i].BookCategory == "database") {
            bookDataFromLocalStorage[i].BookCategory = "資料庫";
        }
        if (bookDataFromLocalStorage[i].BookCategory == "internet") {
            bookDataFromLocalStorage[i].BookCategory = "網際網路";
        }
        if (bookDataFromLocalStorage[i].BookCategory == "system") {
            bookDataFromLocalStorage[i].BookCategory = "應用系統整合";
        }
        if (bookDataFromLocalStorage[i].BookCategory == "home") {
            bookDataFromLocalStorage[i].BookCategory = "家庭保健";
        }
        if (bookDataFromLocalStorage[i].BookCategory == "language") {
            bookDataFromLocalStorage[i].BookCategory = "語言";
        }
    }
}

//加入千分位的function
function FormatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//加入千分位還有元
function AddThousand() {
    for (var i in bookDataFromLocalStorage) {
        bookDataFromLocalStorage[i].BookPrice = FormatNumber(bookDataFromLocalStorage[i].BookPrice);
        bookDataFromLocalStorage[i].BookTotal = FormatNumber(bookDataFromLocalStorage[i].BookTotal);
        bookDataFromLocalStorage[i].BookTotal = bookDataFromLocalStorage[i].BookTotal + "元";
    }
}





$(function () {
   
});
$(document).ready(
    loadBookData(),
    Pageload(),
    ChangeCategory(),
    AddThousand(),
    DynamicImage()

);

function Pageload() {
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "number" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" },
                        BookDeliveredDate: { type: "string" },
                        BookPrice: { type: "string" },
                        BookAmount: { type: "number" },
                        BookTotal: { type: "string" }
                    }
                }
            },
            pageSize: 20
        },
        height: 600,
        width: 600,
        scrollable: true,
        sortable: true,
        pageable: {
            input: true,
            messages: {
                display: "顯示項目 {0}-{1} 總共 {2} 項",
                page: "頁",
                of: "共 {0}"
            }
        },

        columns: [
            { command: { text: "刪除", click: deleteItem }, width: "70px" },
            { field: "BookId", title: "ID", width: "60px" },
            { field: "BookName", title: "書名", width: "210px" },
            { field: "BookCategory", title: "種類", width: "80px" },
            { field: "BookAuthor", title: "作者", width: "100px" },
            { field: "BookBoughtDate", title: "購買日期", width: "90px" },
            {
                field: "BookDeliveredDate", title: "送達狀態", width: "70px", template: function (dataItem) {
                    var a = kendo.htmlEncode(dataItem.BookDeliveredDate);

                    if ( a != 'undefined') {//如果友值加入fontawesome

                        return '<i class="fas fa-address-book" title=' + kendo.htmlEncode(dataItem.BookDeliveredDate) + '></i>';
                    } //如果沒有就用另一張fontawesome
                    else { return ' '; }
                }
            },
            { field: "BookPrice", title: "金額", width: "70px" },
            { field: "BookAmount", title: "數量", width: "70px" },
            { field: "BookTotal", title: "總計", width: "80px" },

        ]
    });
    function deleteItem(e) { //刪除row
        e.preventDefault();

        var grid = $("#book_grid").data("kendoGrid");
        var row = $(e.currentTarget).closest("tr");
        var dataItem = this.dataItem(row);
        alert("確定刪掉: " + dataItem.BookName);
        grid.removeRow(row);


    }


    $(".fieldlist").kendoWindow({
        width: "500px",
        visible: false,
        modal: true,
        title: "新增書",
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],

    });
    $("#add_book").click(function () {

        $(".fieldlist").data("kendoWindow").open().center();

    });
    $("#bought_datepicker").kendoDatePicker({
        format: "yyyy-MM-dd",
        value: new Date(),
        max: new Date(),
        min: new Date(1990, 10, 10),
        culture: "zh.TW"   //顯示culture檔的kendo not defined

    });
    $("#delivered_datepicker").kendoDatePicker({
        format: "yyyy-MM-dd",
        min: new Date(),
        max: new Date(2019, 10, 10),
        culture: "zh.TW"
    });
    $("#book_price").kendoNumericTextBox({
        value: 0,
        min: 0,
        max: 5000,
        step: 10,
        format: "c0",
        decimals: 0
    });
    $("#book_amount").kendoNumericTextBox({
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        decimals: 0
    });
    console.log(document.getElementById("book_amount").value);




}




//這裡是搜尋text box
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}  //req

function getBoolean(str) {
    if ("true".startsWith(str)) {
        return true;
    } else if ("false".startsWith(str)) {
        return false;
    } else {
        return null;
    }
}
function total() {
    $("#book_amout").val;
    var amout = document.getElementById("book_amount").value;
    var price = document.getElementById("book_price").value;
    var totle = amout * price;
    document.getElementById("book_total").textContent = totle;

}


    $('#filter').on('input', function (e) {//req
        var grid = $('#book_grid').data('kendoGrid');
        var columns = grid.columns;

        var filter = { logic: 'or', filters: [] };
        columns.forEach(function (x) {
            if (x.field) {
                var type = grid.dataSource.options.schema.model.fields[x.field].type;
                if (type == 'string') {
                    filter.filters.push({
                        field: x.field,
                        operator: 'contains',
                        value: e.target.value
                    })
                }
            }
        });
        grid.dataSource.filter(filter);
    
});
//這裡是搜尋text box

                