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

  displayStock();
});

function displayStock() {
  let query = connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    console.log(query.sql);
    for (i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    };
    buyPrompt();
  })
}

function buyPrompt() {
  inquirer.prompt([
    {
      type: 'number',
      message: 'Enter the ID of the product you would like to purchase',
      name: 'itemID'
    },
    {
      type: 'number',
      message: 'How many units would you like to purchase?',
      name: 'productQuantity'
    }
  ]).then(function(inquirerResponse) {
    let query = connection.query(`SELECT * FROM products WHERE item_id = ${inquirerResponse.itemID}`, function(err, res) {
      if (err) throw err;
      console.log(query.sql);
      if (res[0].stock_quantity < inquirerResponse.productQuantity) {
        console.log('Insufficient quantity!');
      } else {
        console.log(`Your total bill is $${(inquirerResponse.productQuantity * res[0].price).toFixed(2)}`);
        let query = connection.query(`UPDATE products SET stock_quantity = ${res[0].stock_quantity - inquirerResponse.productQuantity} WHERE item_id = ${inquirerResponse.itemID}`, function(err, res) {
          if (err) throw err;
          console.log(query.sql);
          displayStock();
        });
      }
    })
  });
}
