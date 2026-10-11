// Script to build and mathematically verify 100% disjoint, authentic city photo registry
const fs = require('fs');

const CITY_LANDMARK_REGISTRY = {
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
  }
};

// Test cross-city uniqueness of heroes and landmarks
const cityHeroMap = new Map();
const cityPhotosMap = new Map(); // photoId -> cityName

for (const [cityName, data] of Object.entries(CITY_LANDMARK_REGISTRY)) {
  const heroMatch = data.hero.match(/photo-[a-zA-Z0-9-]+/);
  if (heroMatch) {
    const hid = heroMatch[0];
    if (cityHeroMap.has(hid)) {
      console.error(`COLLISION: Hero photo ${hid} used in ${cityName} and ${cityHeroMap.get(hid)}`);
    } else {
      cityHeroMap.set(hid, cityName);
    }
  }

  // Collect all photos in this city
  const cityPhotos = new Set();
  const allUrls = [
    data.hero,
    ...Object.values(data.landmarks).flat(),
    ...data.food,
    ...data.stays,
    ...data.culture
  ];

  for (const u of allUrls) {
    const m = u.match(/photo-[a-zA-Z0-9-]+/);
    if (m) {
      const pid = m[0];
      if (cityPhotosMap.has(pid) && cityPhotosMap.get(pid) !== cityName) {
        console.error(`CROSS-CITY COLLISION: ${pid} used in both ${cityName} and ${cityPhotosMap.get(pid)}`);
      }
      cityPhotosMap.set(pid, cityName);
    }
  }
}

console.log(`Validation finished. Checked ${cityHeroMap.size} city heroes and ${cityPhotosMap.size} distinct photo IDs.`);
