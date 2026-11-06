const fs = require('fs');

let file = fs.readFileSync('frontend/src/components/EditProduct.jsx', 'utf8');

// Add stock state if not present
if (!file.includes('const [stock, setStock]')) {
  file = file.replace(
    'const [description, setDescription] =',
    'const [stock, setStock] = useState(1);\n  const [description, setDescription] ='
  );
  file = file.replace(
    'setDescription(\n          data.description || ""\n        );',
    'setStock(data.stock !== undefined ? data.stock : 1);\n        setDescription(\n          data.description || ""\n        );'
  );
  file = file.replace(
    'description: description.trim(),',
    'stock: Number(stock) || 1,\n            description: description.trim(),'
  );
  file = file.replace(
    '{/* IMAGE URL */}',
    `{/* STOCK */}

          <input
            type="number"
            placeholder="Stock Quantity (e.g. 1-5)"
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
            min="0"
            required
          />


          {/* IMAGE URL */}`
  );
  fs.writeFileSync('frontend/src/components/EditProduct.jsx', file);
  console.log('Stock field added to EditProduct.jsx');
} else {
  console.log('Stock already present');
}
