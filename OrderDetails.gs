var orderSheetName = "Orders";

function loadOrderDetails() {
    connectToDatabase();
  
    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    var orderDetailsSheet = spreadSheet.getSheetByName(orderSheetName);
  
    orderDetailsSheet.clear();
    orderDetailsSheet.getRange("A:F").setDataValidation(null)
  
    setupHeaders(orderDetailsSheet);
    orderStatusDataValidation(orderDetailsSheet);
  
    var result = SQLstatement.executeQuery("SELECT * FROM carts");
  
    var cell = orderDetailsSheet.getRange("A2");
  
    var row = 0;
    while(result.next())
    {
     for(var i =0; i < orderTableColumnCount; i++) {
       cell.offset(row, i).setValue(result.getString(i+1));
      }
     row++;
    }
  
   closeDatabaseConnection();
}

function setupHeaders(orderDetailsSheet) {
  
  var ordersData = SQLstatement.executeQuery("SELECT * FROM carts");
  var tableMetaData = ordersData.getMetaData();
  orderTableColumnCount = tableMetaData.getColumnCount();
  var headers = new Array(new Array(orderTableColumnCount));
  
  for (var col = 0; col < orderTableColumnCount; col++){
      headers[0][col] = tableMetaData.getColumnName(col+1);
  }
  
  orderDetailsSheet.getRange(1, 1,headers.length, headers[0].length).setValues(headers).setBackground("#ffff55");
}

function orderStatusDataValidation(orderDetailsSheet){
  var numRows = orderDetailsSheet.getLastRow()+1;
  var ordersDataRanage = "F2:F"+numRows;
  
  orderDetailsSheet.getRange(ordersDataRanage).setDataValidation(SpreadsheetApp.newDataValidation()
     .setAllowInvalid(false)
     .requireValueInList(["Preparing","On the Way","Delivered","Cancelled"], true)
     .build()); 
}

function updateOrderStatus() {
  
  connectToDatabase();
  
  SQLstatement.executeUpdate("truncate carts");

  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var orderDetailsSheet = spreadSheet.getSheetByName(orderSheetName);
  var lastRowIndex = orderDetailsSheet.getDataRange().getLastRow() - 1;
  Logger.log("Last Row to Update : %s",lastRowIndex);
  
  var cell = orderDetailsSheet.getRange("A2");
  
  var row = 0;
  while(row < lastRowIndex)
  {
    var id = cell.offset(row,0).getValue();
    var facebook_userid = cell.offset(row,1).getValue();
    var items_in_the_cart = cell.offset(row,2).getValue();
    var phone_number = cell.offset(row,3).getValue();
    var full_address = cell.offset(row,4).getValue();
    var order_status = cell.offset(row,5).getValue();
    
    var rowData = cell.getValue();
    
    Logger.log("Row Data "+rowData);
    
    var insertRowQuery = "INSERT INTO `carts` (`id`,`facebook_userid`, `items_in_the_cart`, `phone_number`, `full_address`, `order_status`) VALUES ('"+id+"', '"+facebook_userid+"', '"+items_in_the_cart+"', '"+phone_number+"', '"+full_address+"', '"+order_status+"')";
    SQLstatement.executeUpdate(insertRowQuery);
      
    row++;
  }
  
  closeDatabaseConnection();
  
  SpreadsheetApp.getUi() 
  .alert("Success","You have successfully updated the Order(s)!",SpreadsheetApp.getUi().ButtonSet.OK);
}