async function test() {
  const res = await fetch('http://localhost:5000/api/products');
  const products = await res.json();
  console.log('Total products from live API:', products.length);
  const laptops = products.filter(p => (p.category || '').toLowerCase() === 'laptops');
  console.log('Active laptops from live API:', laptops.length);
  const categories = {};
  products.forEach(p => categories[p.category] = (categories[p.category] || 0) + 1);
  console.log('Categories breakdown:', categories);
  console.log('\n--- 12 Active Laptops ---');
  laptops.forEach((l, idx) => {
    console.log(`${idx + 1}. [${l._id}] ${l.name}`);
    console.log(`   Price: ₹${l.price} | Stock: ${l.stock} | Brand: ${l.brand}`);
    console.log(`   Specs: ${JSON.stringify(l.specs)}`);
    console.log(`   Image: ${l.image}`);
    console.log(`   Description: ${l.description?.slice(0, 75)}...`);
  });
}

test().catch(console.error);
