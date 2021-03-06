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
    console.log('----------------------------------------------------')
    console.log('Displaying Current Stock');
    console.log('----------------------------------------------------')
    for (i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    };
    managerPrompt();
  });
}

function displayLowStock() {
  let query = connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
    if (err) throw err;
    console.log(query.sql);
    console.log('----------------------------------------------------')
    console.log('Displaying Low Stock Items');
    console.log('----------------------------------------------------')
    for (i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    };
    managerPrompt();
  });
}

function addToInventory() {
  inquirer.prompt([
    {
      type: 'input',
      message: 'Enter an item ID to add stock to',
      name: 'itemID'
    },
    {
      type: 'number',
      message: 'How many would you like to add?',
      name: 'itemAmount'
    }
  ]).then(function(inquirerResponse) {
    let query = connection.query(`SELECT * FROM products WHERE item_id = ${inquirerResponse.itemID}`, function(err, res) {
      let query = connection.query(`UPDATE products SET stock_quantity = ${res[0].stock_quantity + inquirerResponse.itemAmount} WHERE item_id = ${inquirerResponse.itemID}`, function(err, res) {
        displayStock();
      });
    });
  });
}

// incomplete function
// function addNewStock() {
//   inquirer.prompt([
//     {
//       type: 'input',
//       message: 'Enter an item ID to add stock to',
//       name: 'itemID'
//     },
//     {
//       type: 'number',
//       message: 'How many would you like to add?',
//       name: 'itemAmount'
//     }
//   ]).then(function(inquirerResponse) {

//   });
// }
