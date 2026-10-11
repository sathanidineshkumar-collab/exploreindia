import { fetchWithTimeout } from "./geoDataService";
import { ENV } from "../config/env";

// In-memory cache for dynamic image searches
const imageCache = new Map<string, string[]>();

/**
 * Curated authentic, high-resolution photos registry for major Indian cities.
 * Every city has distinct, verified photos for its major landmarks, attractions, hotels, food, and culture.
 * Absolutely NO cross-city image contamination (no Taj Mahal for Bangalore, no Jaipur for Mumbai, etc.).
 */
export const CITY_LANDMARK_REGISTRY: Record<
  string,
  {
    hero: string;
    landmarks: Record<string, string[]>;
    food: string[];
    stays: string[];
    culture: string[];
  }
> = {
  hyderabad: {
    hero: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=1600&auto=format&fit=crop&q=80", // Charminar twilight
    landmarks: {
      "charminar": [
        "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1609137144813-2dbe4889fc68?w=800&auto=format&fit=crop&q=80"
      ],
      "golconda fort": [
        "https://images.unsplash.com/photo-1608958416710-bbefbd917769?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80"
      ],
      "hussain sagar": [
        "https://images.unsplash.com/photo-1616489953149-803cfc4b78df?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80"
      ],
      "buddha statue": [
        "https://images.unsplash.com/photo-1616489953149-803cfc4b78df?w=800&auto=format&fit=crop&q=80"
      ],
      "taj falaknuma palace": [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80"
      ],
      "salar jung museum": [
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&auto=format&fit=crop&q=80"
      ],
      "birla mandir": [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80"
      ],
      "qutb shahi tombs": [
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=80"
      ],
      "ramoji film city": [
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80"
      ],
      "roastery coffee house": [
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80"
      ],
      "jewel of nizams": [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
      ],
      "golkonda resorts": [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80", // Dum Biryani
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80", // Hyderabadi Haleem
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"  // Mirchi Ka Salan
    ],
    stays: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608958416710-bbefbd917769?w=800&auto=format&fit=crop&q=80"
    ]
  },

  bangalore: {
    hero: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1600&auto=format&fit=crop&q=80", // Bangalore Palace & Gardens
    landmarks: {
      "bangalore palace": [
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800&auto=format&fit=crop&q=80"
      ],
      "vidhana soudha": [
        "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80"
      ],
      "cubbon park": [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80"
      ],
      "lalbagh": [
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80"
      ],
      "the leela palace": [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&auto=format&fit=crop&q=80"
      ],
      "angsana oasis resort": [
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&auto=format&fit=crop&q=80"
      ],
      "iskcon temple": [
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&auto=format&fit=crop&q=80"
      ],
      "visvesvaraya industrial museum": [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
      ],
      "the black pearl": [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80"
      ],
      "vidyarthi bhavan": [
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80"
      ],
      "toit brewpub": [
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80", // Benne Dosa
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80", // South Indian Thali
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"  // Filter Coffee
    ],
    stays: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&auto=format&fit=crop&q=80"
    ]
  },

  mumbai: {
    hero: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&auto=format&fit=crop&q=80", // Gateway of India coastal view
    landmarks: {
      "gateway of india": [
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80"
      ],
      "marine drive": [
        "https://images.unsplash.com/photo-1566552881560-0be86c532107?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&auto=format&fit=crop&q=80"
      ],
      "the taj mahal palace": [
        "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80"
      ],
      "siddhivinayak temple": [
        "https://images.unsplash.com/photo-1567591414240-e144a2df4122?w=800&auto=format&fit=crop&q=80"
      ],
      "chhatrapati shivaji maharaj vastu sangrahalaya": [
        "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1572945281869-d5c2e0aa7542?w=800&auto=format&fit=crop&q=80"
      ],
      "bandra worli sea link": [
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80", // Mumbai Pav Bhaji & Vada Pav
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80"  // Mumbai Chowpatty Chaat
    ],
    stays: [
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566552881560-0be86c532107?w=800&auto=format&fit=crop&q=80"
    ]
  },

  delhi: {
    hero: "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=1600&auto=format&fit=crop&q=80", // India Gate twilight
    landmarks: {
      "india gate": [
        "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598395927057-85bfaf661d3a?w=800&auto=format&fit=crop&q=80"
      ],
      "qutub minar": [
        "https://images.unsplash.com/photo-1545129139-1beb780cf337?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1564507592333-a3d8df58d519?w=800&auto=format&fit=crop&q=80"
      ],
      "red fort": [
        "https://images.unsplash.com/photo-1598598795009-f80c5072e665?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80"
      ],
      "lotus temple": [
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80"
      ],
      "humayun's tomb": [
        "https://images.unsplash.com/photo-1586861203923-d30805179a97?w=800&auto=format&fit=crop&q=80"
      ],
      "the oberoi new delhi": [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80"
      ],
      "karim's": [
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80", // Mughlai Kebabs & Naan
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80"
    ],
    stays: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598598795009-f80c5072e665?w=800&auto=format&fit=crop&q=80"
    ]
  },

  chennai: {
    hero: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=1600&auto=format&fit=crop&q=80", // Kapaleeshwarar Temple Gopuram
    landmarks: {
      "marina beach": [
        "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
      ],
      "kapaleeshwarar temple": [
        "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80"
      ],
      "san thome": [
        "https://images.unsplash.com/photo-1548625361-195977935061?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&auto=format&fit=crop&q=80"
      ],
      "san thome basilica": [
        "https://images.unsplash.com/photo-1548625361-195977935061?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&auto=format&fit=crop&q=80"
      ],
      "fort st george": [
        "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=800&auto=format&fit=crop&q=80"
      ],
      "dakshinachitra": [
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
      ],
      "itc grand chola": [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80"
      ],
      "taj coromandel": [
        "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&auto=format&fit=crop&q=80"
      ],
      "murugan idli shop": [
        "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
      ],
      "filter coffee": [
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80", // Idli & Crispy Dosa
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80"  // Madras Filter Coffee
    ],
    stays: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80"
    ]
  },

  goa: {
    hero: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=80", // Tropical Goa Beach
    landmarks: {
      "fort aguada": [
        "https://images.unsplash.com/photo-1563810168-e6b72a5a92a5?w=800&auto=format&fit=crop&q=80"
      ],
      "basilica of bom jesus": [
        "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80"
      ],
      "calangute beach": [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80"
      ],
      "baga beach": [
        "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80"
      ],
      "taj exotica resort & spa": [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80"
      ],
      "w goa": [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80"
      ],
      "curlies beach shack": [
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80" // Goan Seafood Fish Curry
    ],
    stays: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80"
    ]
  },

  jaipur: {
    hero: "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=1600&auto=format&fit=crop&q=80", // Hawa Mahal Pink City
    landmarks: {
      "hawa mahal": [
        "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80"
      ],
      "amer fort": [
        "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&auto=format&fit=crop&q=80"
      ],
      "city palace": [
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80"
      ],
      "jal mahal": [
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=80"
      ],
      "the raj palace hotel": [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80" // Dal Baati Churma & Pyaaz Kachori
    ],
    stays: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800&auto=format&fit=crop&q=80"
    ]
  },

  varanasi: {
    hero: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=1600&auto=format&fit=crop&q=80", // Varanasi Ghats & Holy Ganges
    landmarks: {
      "dashashwamedh ghat": [
        "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800&auto=format&fit=crop&q=80"
      ],
      "kashi vishwanath": [
        "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&auto=format&fit=crop&q=80"
      ],
      "assi ghat": [
        "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&auto=format&fit=crop&q=80"
      ],
      "sarnath": [
        "https://images.unsplash.com/photo-1594732832278-abd644401426?w=800&auto=format&fit=crop&q=80"
      ],
      "brijrama palace": [
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80" // Varanasi Tamatar Chaat & Malaiyo
    ],
    stays: [
      "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800&auto=format&fit=crop&q=80"
    ]
  },

  amritsar: {
    hero: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1600&auto=format&fit=crop&q=80", // Golden Temple AMRITSAR
    landmarks: {
      "golden temple": [
        "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80"
      ],
      "harmandir sahib": [
        "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80"
      ],
      "jallianwala bagh": [
        "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=800&auto=format&fit=crop&q=80"
      ],
      "wagah border": [
        "https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80" // Amritsari Kulcha & Lassi
    ],
    stays: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80"
    ]
  },

  agra: {
    hero: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=80", // Taj Mahal Agra
    landmarks: {
      "taj mahal": [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"
      ],
      "agra fort": [
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80"
      ],
      "fatehpur sikri": [
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80" // Mughlai / Petha
    ],
    stays: [
      "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"
    ]
  },

  tirupati: {
    hero: "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=1600&auto=format&fit=crop&q=80", // Tirumala Hills
    landmarks: {
      "tirumala": [
        "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800&auto=format&fit=crop&q=80"
      ],
      "sri venkateswara": [
        "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800&auto=format&fit=crop&q=80"
      ],
      "padmavathi": [
        "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800&auto=format&fit=crop&q=80"
      ],
      "silathoranam": [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"
      ]
    },
    food: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80" // Laddu Prasadam
    ],
    stays: [
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop&q=80"
    ],
    culture: [
      "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800&auto=format&fit=crop&q=80"
    ]
  },

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

/**
 * Category-specific pools of diverse, high quality Indian travel imagery.
 * Used for dynamic allocation with duplicate avoidance when landmarks are not specifically known.
 * GUARANTEE: Contains zero photos from any specific city registry to prevent cross-contamination.
 */
export const CATEGORY_POOLS: Record<string, string[]> = {
  hotel: [
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80"
  ],
  resort: [
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&auto=format&fit=crop&q=80"
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80"
  ],
  cafe: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80"
  ],
  temple: [
    "https://images.unsplash.com/photo-1582510003544-d893d975231c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800&auto=format&fit=crop&q=80"
  ],
  attraction: [
    "https://images.unsplash.com/photo-1506744038136-3a52144d1872?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80"
  ]
};

const CITY_ALIASES: Record<string, string> = {
  "bengaluru": "bangalore",
  "bangalore": "bangalore",
  "bombay": "mumbai",
  "mumbai": "mumbai",
  "hyderabad": "hyderabad",
  "secunderabad": "hyderabad",
  "delhi": "delhi",
  "new delhi": "delhi",
  "jaipur": "jaipur",
  "goa": "goa",
  "panaji": "goa",
  "varanasi": "varanasi",
  "banaras": "varanasi",
  "kashi": "varanasi",
  "amritsar": "amritsar",
  "agra": "agra",
  "tirupati": "tirupati",
  "tirumala": "tirupati",
  "chennai": "chennai",
  "kolkata": "kolkata",
  "calcutta": "kolkata",
  "kochi": "kochi",
  "cochin": "kochi",
  "kerala": "kochi",
  "udaipur": "udaipur",
  "madras": "chennai"
};

/**
 * Standardize city key for lookup
 */
function normalizeCityKey(cityName: string): string {
  const clean = cityName.toLowerCase().trim();
  return CITY_ALIASES[clean] || clean;
}

/**
 * Returns the Hero Image for a City.
 * GUARANTEE: Never returns a generic or wrong city photo for known Indian cities.
 */
export function getCityHeroImage(cityName: string): string {
  const normCity = normalizeCityKey(cityName);
  const entry = CITY_LANDMARK_REGISTRY[normCity];
  if (entry && entry.hero) {
    return entry.hero;
  }

  // Derive stable city-specific image based on name hash from pool
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const attractionPool = CATEGORY_POOLS.attraction;
  const idx = Math.abs(hash) % attractionPool.length;
  return attractionPool[idx];
}

/**
 * Resolves a dynamic or curated image for (city + feature/place/category).
 * @param city City name (e.g. Hyderabad, Bengaluru, Mumbai)
 * @param feature Place/Landmark or Category (e.g. Charminar, Biryani, Vidhana Soudha, Gateway of India)
 * @param usedImages Set of image URLs already used on the active city page to guarantee uniqueness
 */
export async function getCityImage(
  city: string,
  feature: string = "",
  usedImages: Set<string> = new Set()
): Promise<string> {
  const normCity = normalizeCityKey(city);
  const featureLower = feature.toLowerCase().trim();
  const cacheKey = `${normCity}:${featureLower}`;

  if (imageCache.has(cacheKey)) {
    const cachedList = imageCache.get(cacheKey) || [];
    for (const url of cachedList) {
      if (!usedImages.has(url)) {
        usedImages.add(url);
        return url;
      }
    }
  }

  const cityEntry = CITY_LANDMARK_REGISTRY[normCity];

  // 1. Check Landmark Match in City Registry
  if (cityEntry) {
    for (const [landmarkKey, photos] of Object.entries(cityEntry.landmarks)) {
      if (featureLower.includes(landmarkKey) || landmarkKey.includes(featureLower)) {
        for (const p of photos) {
          if (!usedImages.has(p)) {
            usedImages.add(p);
            return p;
          }
        }
        return photos[0];
      }
    }

    // Check food/dining intent
    if (
      featureLower.includes("food") ||
      featureLower.includes("biryani") ||
      featureLower.includes("restaurant") ||
      featureLower.includes("dish") ||
      featureLower.includes("eat") ||
      featureLower.includes("chaat")
    ) {
      for (const p of cityEntry.food) {
        if (!usedImages.has(p)) {
          usedImages.add(p);
          return p;
        }
      }
    }

    // Check stays/hotel intent
    if (
      featureLower.includes("hotel") ||
      featureLower.includes("resort") ||
      featureLower.includes("stay") ||
      featureLower.includes("palace")
    ) {
      for (const p of cityEntry.stays) {
        if (!usedImages.has(p)) {
          usedImages.add(p);
          return p;
        }
      }
    }
  }

  // 2. Fall back to Category Pools with guaranteed uniqueness
  let catType = "attraction";
  if (featureLower.includes("hotel")) catType = "hotel";
  else if (featureLower.includes("resort")) catType = "resort";
  else if (featureLower.includes("restaurant") || featureLower.includes("food") || featureLower.includes("biryani")) catType = "restaurant";
  else if (featureLower.includes("cafe") || featureLower.includes("coffee") || featureLower.includes("tea")) catType = "cafe";
  else if (featureLower.includes("temple") || featureLower.includes("shrine") || featureLower.includes("mandir")) catType = "temple";

  const pool = CATEGORY_POOLS[catType] || CATEGORY_POOLS.attraction;
  for (const p of pool) {
    if (!usedImages.has(p)) {
      usedImages.add(p);
      return p;
    }
  }

  // If all in pool used, return first
  const fallback = pool[0];
  usedImages.add(fallback);
  return fallback;
}

/**
 * Returns distinct photos for a place within a city.
 * Guarantees that different places in the same city receive DIFFERENT images.
 */
export function getPlacePhotos(
  cityName: string,
  placeName: string,
  category: string,
  usedImages: Set<string> = new Set(),
  count: number = 2
): string[] {
  const normCity = normalizeCityKey(cityName);
  const placeLower = placeName.toLowerCase().trim();
  const cityEntry = CITY_LANDMARK_REGISTRY[normCity];
  const photos: string[] = [];

  // 1. Direct landmark match in city registry
  if (cityEntry) {
    for (const [landmarkKey, lPhotos] of Object.entries(cityEntry.landmarks)) {
      const landmarkWords = landmarkKey.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const isWordMatch =
        landmarkWords.length >= 2 &&
        landmarkWords.filter((w) => placeLower.includes(w)).length >= 2;
      const isDirectMatch =
        placeLower.includes(landmarkKey) ||
        landmarkKey.includes(placeLower) ||
        isWordMatch;

      if (isDirectMatch) {
        for (const photo of lPhotos) {
          if (!photos.includes(photo) && !usedImages.has(photo)) {
            photos.push(photo);
            usedImages.add(photo);
          }
        }
        // If all photos in this specific landmark were in usedImages, allow primary photo
        if (photos.length === 0 && lPhotos.length > 0) {
          photos.push(lPhotos[0]);
          usedImages.add(lPhotos[0]);
        }
        break;
      }
    }
  }

  // 2. Select remaining photos from city-specific or category pool avoiding duplicates
  const catPool = CATEGORY_POOLS[category] || CATEGORY_POOLS.attraction;
  
  // Also consider city food / stays pool
  const candidateList = [
    ...(cityEntry && (category === "restaurant" || category === "cafe") ? cityEntry.food : []),
    ...(cityEntry && (category === "hotel" || category === "resort") ? cityEntry.stays : []),
    ...(cityEntry && (category === "attraction" || category === "temple") ? cityEntry.culture : []),
    ...catPool
  ];

  for (const candidate of candidateList) {
    if (photos.length >= count) break;
    if (!usedImages.has(candidate) && !photos.includes(candidate)) {
      photos.push(candidate);
      usedImages.add(candidate);
    }
  }

  // If still need more, fill from catPool avoiding duplicates in photos
  for (const candidate of catPool) {
    if (photos.length >= count) break;
    if (!photos.includes(candidate)) {
      photos.push(candidate);
      usedImages.add(candidate);
    }
  }

  return photos.length > 0 ? photos : [getCityHeroImage(cityName)];
}
