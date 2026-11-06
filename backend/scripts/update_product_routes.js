const fs = require('fs');

let code = fs.readFileSync('backend/routes/productRoutes.js', 'utf8');

if (!code.includes('const mongoose = require("mongoose");')) {
  code = code.replace(
    'const router = express.Router();',
    'const mongoose = require("mongoose");\n\nconst router = express.Router();'
  );
}

// Replace the GET /:id route implementation
const oldRoute = `router.get(
  "/:id",
  async (req, res) => {
    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message:
            "Product not found",
        });

      }

      res.status(200).json(
        product
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);`;

const newRoute = `router.get(
  "/:id",
  async (req, res) => {
    try {
      const rawId = (req.params.id || "").trim();
      let product = null;

      if (mongoose.Types.ObjectId.isValid(rawId)) {
        product = await Product.findById(rawId);
      }

      if (!product) {
        product = await Product.findOne({
          name: new RegExp("^" + rawId.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&") + "$", "i")
        });
      }

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);`;

// Normalize line endings for replacement
const normalizedCode = code.replace(/\r\n/g, '\n');
const normalizedOldRoute = oldRoute.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedOldRoute)) {
  code = normalizedCode.replace(normalizedOldRoute, newRoute);
  fs.writeFileSync('backend/routes/productRoutes.js', code);
  console.log('Successfully updated productRoutes.js');
} else {
  console.log('Could not find oldRoute block. Replacing via regex...');
  const regex = /router\.get\(\s*"\/:id"[\s\S]*?res\.status\(500\)[\s\S]*?\}\s*\)\s*;/;
  if (regex.test(normalizedCode)) {
    code = normalizedCode.replace(regex, newRoute);
    fs.writeFileSync('backend/routes/productRoutes.js', code);
    console.log('Successfully updated productRoutes.js via regex');
  } else {
    console.error('Regex match failed');
  }
}

