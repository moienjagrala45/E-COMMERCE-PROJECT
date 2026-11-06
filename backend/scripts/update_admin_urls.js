const fs = require('fs');

// 1. Update AdminProduct.jsx
let adminProduct = fs.readFileSync('frontend/src/components/AdminProduct.jsx', 'utf8');
if (!adminProduct.includes('getApiUrl')) {
  adminProduct = 'import { getApiUrl } from "../config/api";\n' + adminProduct;
}
adminProduct = adminProduct.replace(
  'https://e-commerce-project-backend-vpdz.onrender.com/api/products',
  'getApiUrl("/api/products")'
);
adminProduct = adminProduct.replace(
  '`https://e-commerce-project-backend-vpdz.onrender.com/api/products/${id}`',
  'getApiUrl(`/api/products/${id}`)'
);
// In case the quotes were string literals:
adminProduct = adminProduct.replace(
  '"getApiUrl("/api/products")"',
  'getApiUrl("/api/products")'
);
fs.writeFileSync('frontend/src/components/AdminProduct.jsx', adminProduct);
console.log('AdminProduct updated');

// 2. Update EditProduct.jsx
let editProduct = fs.readFileSync('frontend/src/components/EditProduct.jsx', 'utf8');
if (!editProduct.includes('getApiUrl')) {
  editProduct = 'import { getApiUrl } from "../config/api";\n' + editProduct;
}
editProduct = editProduct.replace(
  '`https://e-commerce-project-backend-vpdz.onrender.com/api/products/${id}`',
  'getApiUrl(`/api/products/${id}`)'
);
editProduct = editProduct.replace(
  '`https://e-commerce-project-backend-vpdz.onrender.com/api/products/${id}`',
  'getApiUrl(`/api/products/${id}`)'
);
fs.writeFileSync('frontend/src/components/EditProduct.jsx', editProduct);
console.log('EditProduct updated');

// 3. Update AddProduct.jsx
let addProduct = fs.readFileSync('frontend/src/components/AddProduct.jsx', 'utf8');
if (!addProduct.includes('getApiUrl')) {
  addProduct = 'import { getApiUrl } from "../config/api";\n' + addProduct;
}
addProduct = addProduct.replace(
  '"https://e-commerce-project-backend-vpdz.onrender.com/api/products"',
  'getApiUrl("/api/products")'
);
fs.writeFileSync('frontend/src/components/AddProduct.jsx', addProduct);
console.log('AddProduct updated');
