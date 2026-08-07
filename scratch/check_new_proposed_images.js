const ids = [
  '545128485-c400e7702796',
  '506126613408-eca07ce68773',
  '447752875215-b2761acb3c5d',
  '470071459604-3b5ec3a7fe05',
  '1608958416715-4ba284c1f6cb',
  '1503177119275-0aa32b3a9368',
  '1581010866487-f8a486326161',
  '1507163546645-5c17d79b3b0a',
  '1525906856004-94612f4a181b',
  '1518241353330-0f7941c2d9b5',
  '1519046904884-53103b34b206',
  '1473448912268-2022ce9509d8',
  '1441974231531-c6227db76b6e',
  '1470240731273-7821a6eeb6bd',
  '1482862549707-f63cb32c5fd9',
  '1565192647048-f997ded87958',
  '1528164344705-47542687000d',
  '1584917865442-de89df76afd3'
];

async function check() {
  for (const id of ids) {
    const url = `https://images.unsplash.com/photo-${id}?w=600`;
    try {
      const res = await fetch(url, { method: 'HEAD', timeout: 5000 });
      console.log(`${res.status === 200 ? '✅' : '❌'} (${res.status}): ${url}`);
    } catch (e) {
      console.log(`⚠️ ERROR (${e.message}): ${url}`);
    }
  }
}

check();
