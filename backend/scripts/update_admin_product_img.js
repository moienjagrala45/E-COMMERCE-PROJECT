const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/AdminProduct.jsx', 'utf8').replace(/\r\n/g, '\n');

const target = `<img
                    src={product.image}
                    alt={product.name}
                    className="admin-product-image"`;

const replacement = `<img
                    src={
                      (typeof product.image === "string" && product.image.trim()) ||
                      (typeof product.imageUrl === "string" && product.imageUrl.trim()) ||
                      (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === "string" && product.images[0].trim()) ||
                      ""
                    }
                    alt={product.name}
                    className="admin-product-image"
                    referrerPolicy="no-referrer"`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('frontend/src/components/AdminProduct.jsx', code);
  console.log('AdminProduct.jsx image updated');
} else {
  console.error('Target not found in AdminProduct.jsx');
}

