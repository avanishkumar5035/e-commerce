const fs = require('fs');

const html = fs.readFileSync('puma.html', 'utf8');
const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);

if (match && match[1]) {
    const data = JSON.parse(match[1]);
    
    // We navigate to find product data inside the Next.js props
    // usually in props.pageProps.initialState or similar
    // The safest way is to stringify and use a basic regex to find images and titles
    let rawJson = match[1];
    let productsFound = [];
    
    try {
        // Look for items array or something similar, for now we will extract product titles and images via regex
        let names = [...rawJson.matchAll(/"name":"([^"]+)"/g)].map(m => m[1]).filter(n => n.includes('Running') || n.includes('Shoe'));
        let prices = [...rawJson.matchAll(/"price":(\d+)/g)].map(m => m[1]);
        let images = [...rawJson.matchAll(/"image":"([^"]+)"/g)].map(m => m[1]);
        let descs = [...rawJson.matchAll(/"description":"([^"]+)"/g)].map(m => m[1]);
        
        // This is a bit flaky, let's explore the actual Next.js object structure
        const props = data.props;
        const pageProps = props.pageProps;
        const initialState = pageProps.initialState;
        
        // In most modern Next.js commerce sites, products are within search results
        const products = pageProps.initialState?.category?.products || pageProps.initialState?.search?.results || pageProps.page?.search?.productResults || [];
        
        console.log("Found products using direct path:", products.length);
        
        let extracted = [];
        // If direct navigation fails, let's just create some dummy items from strings found
        const uniqueNames = [...new Set(names)].filter(n => !n.includes('Icon') && !n.includes('Logo') && n.length > 5).slice(0, 5);
        
        uniqueNames.forEach((name, i) => {
            extracted.push({
                name: name,
                image: images[i] || 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
                description: descs[i] || `High performance ${name} designed for ultimate comfort and speed.`,
                brand: 'PUMA',
                category: 'Apparel', // Following Nike Air Jordan category
                price: parseInt(prices[i]) || 4999,
                countInStock: 15,
                rating: 4 + (Math.random()),
                numReviews: Math.floor(Math.random() * 200) + 10,
            });
        });
        
        fs.writeFileSync('extracted.json', JSON.stringify(extracted, null, 2));
        console.log('Saved extracted.json');
        
    } catch(e) {
        console.log(e);
    }
}
