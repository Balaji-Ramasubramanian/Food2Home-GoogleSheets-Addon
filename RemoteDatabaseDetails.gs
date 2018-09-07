var databaseUrl = <Your_Database_URL>;
var databaseUserName = <Database_Username>;
var databasePwd = <Database_Password>;

var connection;
var SQLstatement;

function connectToDatabase() {
  connection = Jdbc.getConnection(databaseUrl,databaseUserName , databasePwd);
  SQLstatement = connection.createStatement();
}

function closeDatabaseConnection() {
  SQLstatement.close();
  connection.close();
}