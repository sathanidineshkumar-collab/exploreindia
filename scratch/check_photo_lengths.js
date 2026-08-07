const url = 'http://localhost:3000/api/discover';

async function test() {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'guntur', lat: 16.3067, lng: 80.4365 })
  });
  const data = await response.json();
  console.log('--- Photo Lengths check ---');
  data.places.slice(0, 5).forEach(p => {
    console.log(`Place: ${p.name}`);
    console.log(`Photos list length: ${p.photos.length}`);
    console.log(`Photos:`, p.photos);
  });
}

test();
