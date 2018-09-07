function onOpen(event) {
  
  loadOrderDetails();
  
  var ordersSheetUI = SpreadsheetApp.getUi();
  
  ordersSheetUI.createMenu('Update Orders')
      .addItem('Update Orders', 'updateOrderStatus')
      .addToUi();
}


