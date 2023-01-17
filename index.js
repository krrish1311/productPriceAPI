//to load express
const express = require("express");

//to create an object
const app = express();

//to bind it
app.use(express.json());

fs = require("fs");

function loading(path) {
  let fileData = require(path);
  return fileData;
}
function fileWriting(path, objectData) {
  //to store error in global variable
  let error;

  fs.writeFile(path, JSON.stringify(objectData), (err) => {
    if (err) {
      error = err;
    }
  });
  if (error) {
    return error;
  } else {
    return "The data has been saved properly";
  }
}

app.get("/api/products", (req, resp) => {
  //if any changes has been done then i need to load the file
  const products = loading("./product.json");
  resp.send(products);
});

app.get("/api/products/:productInfo", (req, resp) => {
  const products = loading("./product.json");
  let flag = true;
  let productInf = req.params.productInfo;
  for (let i = 0; i < productInf.length; i++) {
    let ascii = productInf[0].charCodeAt(0);
    if (!(ascii >= 48 && ascii <= 57)) {
      flag = false;
    }
  }
  if (flag) {
    const productById = products.find((v) => v.id == parseInt(productInf));
    if (!productById) resp.status(404).send("No ID found !");
    resp.send(productById);
  } else {
    const productByName = products.find((v) => v.product == productInf);
    if (!productByName) resp.status(404).send("No product found of given Name");
    resp.send(productByName);
  }
});
app.post("/api/products/addproduct", (req, resp) => {
  const products = loading("./product.json");
  let productByUser = {
    product: req.body.product,
    price: req.body.price,
    id: (products.length += 1),
  };
  products.push(productByUser);

  products.splice(products.length - 2, 1);
  console.log(products);
  let message = fileWriting("product.json", products);
  resp.send(message);
});

app.put("/api/products/edit/:id", (req, resp) => {
  const products = loading("./product.json");
  const productById = products.find((v) => v.id == parseInt(req.params.id));
  if (!productById) resp.status(404).send("No ID found !");
  productById.product = req.body.product;
  productById.price = req.body.price;
  let message = fileWriting("product.json", products);
  resp.send(message);
});

app.delete("/api/products/delete/:id", (req, resp) => {
  const products = loading("./product.json");
  const productById = products.find((v) => v.id == parseInt(req.params.id));
  if (!productById) resp.status(404).send("No ID found !");
  const index = products.indexOf(productById);
  products.splice(index, 1);
  let message = fileWriting("product.json", products);
  resp.send("The product has been deleted");
});

app.listen(4000);
