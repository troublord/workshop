
var bookDataFromLocalStorage = [];
var bookCategorySwitch = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];


// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
        
    }
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
var a="";
function AddFontawesome(a) {
    
    if (a != "") {
        a = "fas fa-couch";
    }
    
}




$(function () {
    loadBookData();
    ChangeCategory();
    AddThousand();
    AddFontawesome()
});
var a;
    $(document).ready(function () {
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
                input:  true,
                messages: {
                    display: "顯示項目 {0}-{1} 總共 {2} 項",
                    page: "頁",
                    of: "共 {0}"
                }
            },
            
            columns: [
                { command: { text: "刪除", click: deleteItem }, width: "70px" },
                { field: "BookId", title: "ID", width: "60px" },
                { field: "BookName", title: "書名", width: "210px"},
                { field: "BookCategory", title: "種類", width: "80px" },
                { field: "BookAuthor", title: "作者", width: "100px" },
                { field: "BookBoughtDate", title: "購買日期", width: "90px" },
                {
                    field: "BookDeliveredDate", title: "送達狀態", width: "70px", template: function (dataItem) {
                        var a = kendo.htmlEncode(dataItem.BookDeliveredDate);
                        console.log(a);
                        if (typeof a != 'undefined') {//如果友值加入fontawesome
                            console.log(typeof kendo.htmlEncode(dataItem.BookDeliveredDate));
                            return '<i class="fas fa-address-book" title=' + kendo.htmlEncode(dataItem.BookDeliveredDate) + '></i>';
                        } //如果沒有就用另一張fontawesome
                        else { return '<i class="fas fa-ad"></i>" title=' + kendo.htmlEncode(dataItem.BookDeliveredDate) + '></i>'; }
                    }},
                { field: "BookPrice", title: "金額", width: "70px" },
                { field: "BookAmount", title: "數量", width: "70px" },
                { field: "BookTotal", title: "總計", width: "80px"},

            ]
        });
        function deleteItem(e) { //刪除
            e.preventDefault();

            var grid = $("#book_grid").data("kendoGrid");
            var row = $(e.currentTarget).closest("tr");
            var dataItem = this.dataItem(row);
            alert("確定刪掉: " + dataItem.BookName);
            grid.removeRow(row);
            

        }

        function AddDelete() {
            for (var i in bookDataFromLocalStorage) {
                bookDataFromLocalStorage[i].BookPrice = FormatNumber(bookDataFromLocalStorage[i].BookPrice);
                
            }
        }

});


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

                