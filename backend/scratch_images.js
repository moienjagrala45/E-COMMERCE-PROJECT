async function getImages(query) {
  try {
    const res = await fetch(`https://unsplash.com/s/photos/${query}`);
    const html = await res.text();
    const regex = /https:\/\/images\.unsplash\.com\/photo-([0-9a-zA-Z_-]+)\?([^"'\s>]+)/g;
    const seen = new Set();
    const list = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      const id = match[1];
      if (!seen.has(id)) {
        seen.add(id);
        list.push(`https://images.unsplash.com/photo-${id}`);
      }
    }
    return list;
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function run() {
  const macbooks = await getImages("macbook-pro");
  console.log("Macbooks:", macbooks.slice(0, 6));
  const dell = await getImages("laptop-computer");
  console.log("Laptops:", dell.slice(0, 8));
  const smartwatches = await getImages("apple-watch");
  console.log("Smartwatches:", smartwatches.slice(0, 6));
  const jackets = await getImages("jacket");
  console.log("Jackets:", jackets.slice(0, 6));
}

run();
