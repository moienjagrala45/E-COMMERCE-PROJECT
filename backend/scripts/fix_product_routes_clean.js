const fs = require('fs');

const file = 'backend/routes/productRoutes.js';
let content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const startComment = '// =========================================\n// GET SINGLE PRODUCT BY ID\n// =========================================';
const endComment = '// =========================================\n// UPDATE PRODUCT - ADMIN ONLY\n// =========================================';

const startIndex = content.indexOf(startComment);
const endIndex = content.indexOf(endComment);

if (startIndex === -1 || endIndex === -1) {
  console.error("Comments not found", { startIndex, endIndex });
  process.exit(1);
}

const lines = [
  startComment,
  '',
  'router.get(',
  '  "/:id",',
  '  async (req, res) => {',
  '    try {',
  '      const rawId = (req.params.id || "").trim();',
  '      let product = null;',
  '',
  '      if (mongoose.Types.ObjectId.isValid(rawId)) {',
  '        product = await Product.findById(rawId);',
  '      }',
  '',
  '      if (!product) {',
  '        product = await Product.findOne({ name: rawId });',
  '      }',
  '',
  '      if (!product) {',
  '        return res.status(404).json({',
  '          message: "Product not found",',
  '        });',
  '      }',
  '',
  '      res.status(200).json(product);',
  '    } catch (error) {',
  '      res.status(500).json({',
  '        message: error.message,',
  '      });',
  '    }',
  '  }',
  ');',
  '',
  ''
];

content = content.slice(0, startIndex) + lines.join('\n') + content.slice(endIndex);
fs.writeFileSync(file, content);
console.log('Fixed productRoutes.js cleanly');
