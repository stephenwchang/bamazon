const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon_db'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);

  managerPrompt();
});

function managerPrompt() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'Select an action',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
      name: 'choice'
    }
  ]).then(function(inquirerResponse) {
    switch(inquirerResponse.choice) {
      case 'View Products for Sale':
        return displayStock();
      case 'View Low Inventory':
        return displayLowStock();
      case 'Add to Inventory':
        return addToInventory();
      case 'Add New Product':
        return addNewProduct();
    }
  });
}

function displayStock() {
  let query = connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    console.log(query.sql);
    for (i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    };
    managerPrompt();
  });
}
