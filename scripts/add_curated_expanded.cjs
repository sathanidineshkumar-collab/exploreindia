const fs = require('fs');

// Read existing imageService.ts
const imageServiceSrc = fs.readFileSync('backend/src/services/imageService.ts', 'utf8');

// Collect all existing photo IDs
const existingPhotos = new Set([...imageServiceSrc.matchAll(/photo-[a-zA-Z0-9-]+/g)].map(m => m[0]));
console.log('Currently existing unique photo IDs:', existingPhotos.size);

// Define candidate photos for expanded cities
const candidates = {
  kolkata: {
    hero: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&auto=format&fit=crop&q=80", // Howrah Bridge
    landmarks: {
      "victoria memorial": [
        "https://images.unsplash.com/photo-1608463123864-dd0e2946c0a0?w=800&auto=format&fit=crop&q=80"
      ],
      "howrah bridge": [
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80"
      ],
      "dakshineswar kali temple": [
        "https://images.unsplash.com/photo-1627993078496-e2600ff51efd?w=800&auto=format&fit=crop&q=80"
      ],
      "indian museum": [
        "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80"
      ],
      "the oberoi grand": [
        "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=800&auto=format&fit=crop&q=80"
      ],
      "peter cat": [
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80"
    ],
    stays: [
      "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1608463123864-dd0e2946c0a0?w=800&auto=format&fit=crop&q=80"
    ]
  },

  kochi: {
    hero: "https://images.unsplash.com/photo-1609137840173-477861a8e688?w=1600&auto=format&fit=crop&q=80", // Kerala Palms & Waters
    landmarks: {
      "fort kochi": [
        "https://images.unsplash.com/photo-1593693475878-362cb9666fc2?w=800&auto=format&fit=crop&q=80"
      ],
      "chinese fishing nets": [
        "https://images.unsplash.com/photo-1593693475878-362cb9666fc2?w=800&auto=format&fit=crop&q=80"
      ],
      "mattancherry palace": [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80"
      ],
      "st francis church": [
        "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800&auto=format&fit=crop&q=80"
      ],
      "grand hyatt kochi bolgatty": [
        "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&auto=format&fit=crop&q=80"
      ],
      "paragon restaurant": [
        "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop&q=80"
    ],
    stays: [
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1609137840173-477861a8e688?w=800&auto=format&fit=crop&q=80"
    ]
  },

  udaipur: {
    hero: "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=1600&auto=format&fit=crop&q=80", // Udaipur Lake Palace
    landmarks: {
      "city palace udaipur": [
        "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=800&auto=format&fit=crop&q=80"
      ],
      "lake pichola": [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80"
      ],
      "taj lake palace": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
      ],
      "saheliyon ki bari": [
        "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80"
      ],
      "ambrai waterfront restaurant": [
        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&auto=format&fit=crop&q=80"
    ],
    stays: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1599818818585-802c613c723b?w=800&auto=format&fit=crop&q=80"
    ]
  }
};

// Check which of these are already in existingPhotos
console.log('Checking collisions...');
for (const [cityName, data] of Object.entries(candidates)) {
  const allUrls = [data.hero, ...Object.values(data.landmarks).flat(), ...data.food, ...data.stays, ...data.culture];
  for (const u of allUrls) {
    const m = u.match(/photo-[a-zA-Z0-9-]+/);
    if (m && existingPhotos.has(m[0])) {
      console.log(`Collision for ${cityName}: ${m[0]}`);
    }
  }
}
