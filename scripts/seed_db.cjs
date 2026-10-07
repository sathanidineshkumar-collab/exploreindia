const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../backend/data_store.json');

// Read existing DB to preserve users, notifications etc.
let dbData = {
  users: [],
  places: [],
  reviews: [],
  searchHistory: [],
  notifications: [],
  cities: [],
  travelTips: []
};

if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbData = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read existing DB, will initialize empty');
  }
}

// 1. Curated Cities
const curatedCities = [
  {
    name: "Goa",
    state: "Goa",
    description: "A tropical paradise featuring pristine beaches, Portuguese heritage churches, and exciting nightlife.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
    lat: 15.2993,
    lng: 74.1240
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    description: "The City of Pearls, famous for its rich history, Charminar, and world-renowned Biryani.",
    image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600&auto=format&fit=crop&q=80",
    lat: 17.3850,
    lng: 78.4867
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    description: "The Silicon Valley of India, known for its pleasant weather, tech startups, and vibrant cafe culture.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    name: "Delhi",
    state: "Delhi",
    description: "The capital territory, where old-world monuments meet modern urban landscapes and bustling street food stalls.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80",
    lat: 28.6139,
    lng: 77.2090
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    description: "The City of Dreams, containing iconic beaches, colonial architecture, and India's Bollywood film industry.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80",
    lat: 19.0760,
    lng: 72.8777
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    description: "The Pink City, celebrated for its magnificent royal palaces, ancient forts, and rich Rajasthani cuisine.",
    image: "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600&auto=format&fit=crop&q=80",
    lat: 26.9124,
    lng: 75.7873
  }
];

dbData.cities = [...curatedCities];

const unsplashPool = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80"
];

const stateCityMap = {
  "Andhra Pradesh": {
    center: { lat: 15.9129, lng: 79.7400 },
    cities: [
      "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kakinada", "Kadapa", 
      "Anantapur", "Eluru", "Ongole", "Vizianagaram", "Srikakulam", "Proddatur", "Nandyal", "Adoni", "Madanapalle", 
      "Chittoor", "Tenali", "Chirala", "Dharmavaram", "Hindupur", "Guntakal", "Tadipatri", "Gudivada", "Bhimavaram", 
      "Narasaraopet", "Chilakaluripet", "Tadepalligudem", "Machilipatnam", "Amalapuram", "Kavali", "Bapatla", "Nuzvid", 
      "Sattenapalle", "Vinukonda", "Markapur", "Kandukur", "Pithapuram", "Samalkot", "Mandapeta", "Tuni", "Ramachandrapuram", 
      "Peddapuram", "Nidadavole", "Tanuku", "Kovvur", "Palakollu", "Narsapuram", "Chintalapudi", "Jangareddygudem", 
      "Tadepalli", "Mangalagiri", "Ponnur", "Repalle", "Jaggaiahpeta", "Nandigama", "Vuyyuru", "Rayachoty", "Yemmiganur", 
      "Dhone", "Srisailam", "Gooty", "Kalyandurg", "Rayadurg", "Kadiri", "Punganur", "Srikalahasti", "Puttur", "Nagari", 
      "Venkatagiri", "Gudur", "Naidupeta", "Atmakur", "Allur", "Kovur", "Buchireddypalem", "Podili", "Kanigiri", 
      "Giddalur", "Cumbum", "Vetapalem", "Chebrolu", "Macherla", "Gurazala", "Piduguralla", "Kanchikacherla", 
      "Jaggaiahpet", "Tiruvuru", "Dowleswaram", "Ravulapalem", "Yeleswaram", "Prathipadu", "Jaggampeta", "Annavaram", 
      "Palasa", "Sompeta", "Ichchapuram", "Tekkali", "Narasannapeta", "Cheepurupalli", "Bobbili", "Parvathipuram", 
      "Salur", "Srungavarapukota", "Bheemunipatnam", "Anakapalle", "Yellamanchili", "Narsipatnam", "Chodavaram", 
      "Madugula", "Paderu", "Araku Valley",
      "Uravakonda", "Pamidi", "Yadiki", "Singanamala", "Putlur", "Penukonda", "Puttaparthi", "Bukkapatnam", 
      "Gorantla", "Madakasira", "Mudigubba", "Tanakal", "Nambulapulikunta", "Badvel", "Pulivendula", "Jammalamadugu", 
      "Mydukur", "Yerraguntla", "Kamalapuram", "Vempalli", "Rajampet", "Pileru", "Lakkireddipalli", "Galiveedu", 
      "Railway Kodur", "Tamballapalle", "Kodumur", "Pathikonda", "Alur", "Nandikotkur", "Peapully", "Allagadda", 
      "Banaganapalle", "Koilkuntla", "Velgode", "Bethamcherla", "Kuppam", "Palamaner", "Gangadhara Nellore", 
      "Karvetinagar", "Bangarupalem", "Sullurpeta", "Renigunta", "Chandragiri", "Satyavedu", "Podalakur", "Rapur", 
      "Venkatachalam", "Indukurpet", "Muthukur", "Singarayakonda", "Chimakurthy", "Addanki", "Karlapalem", 
      "Pittalavanipalem", "Nizampatnam", "Tsundur", "Bhattiprolu", "Dachepalli", "Karampudi", "Pedakakani", 
      "Tadikonda", "Amaravathi", "Phirangipuram", "Ibrahimpatnam", "Mylavaram", "Kondapalli", "Vissannapeta", 
      "Pedana", "Pamidimukkala", "Challapalli", "Avanigadda", "Bantumilli", "Pamarru", "Kaikaluru", "Mudinepalli", 
      "Chatrai", "Denduluru", "Pedapadu", "Akividu", "Undi", "Penugonda", "Veeravasaram", "Anaparthi", "Chagallu", 
      "Gopalapuram", "Devarapalli", "Kothapeta", "Mummidivaram", "Razole", "Malikipuram", "Allavaram", "Ainavilli", 
      "Gollaprolu", "Kasimkota", "Parawada", "Munagapaka", "Rambilli", "Gajuwaka", "Gopalapatnam", "Pendurthi", 
      "Anandapuram", "Padmanabham", "Chintapalli", "Rampachodavaram", "Addateegala", "Maredumilli", "Ananthagiri", 
      "Dumbriguda", "Gajapathinagaram", "Nellimarla", "Pusapatirega", "Bhogapuram", "Kurupam", "Gummalaxmipuram", 
      "Makkuva", "Komarada", "Bhamini", "Amadalavalasa", "Rajam", "Ponduru"
    ]
  },
  "Arunachal Pradesh": {
    center: { lat: 28.2180, lng: 94.7278 },
    cities: ["Itanagar", "Naharlagun", "Pasighat", "Aalo", "Tezu", "Namsai", "Ziro", "Bomdila", "Tawang", "Khonsa", "Changlang", "Roing", "Yingkiong", "Anini", "Seppa", "Koloriang", "Hawai", "Longding", "Sagalee", "Likabali", "Basar", "Rupa", "Dirang", "Yuplia", "Boleng", "Pangin", "Mechuka", "Bhalukpong", "Miao", "Jairampur"]
  },
  "Assam": {
    center: { lat: 26.2006, lng: 92.9376 },
    cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Sivasagar", "Goalpara", "Barpeta", "North Lakhimpur", "Dhubri", "Diphu", "Lumding", "Sadia", "Margherita", "Kokrajhar", "Haflong", "Mangaldai", "Mariani", "Sibsagar", "Nazira", "Bokajan", "Golaghat", "Hojai", "Doom Dooma", "Dhemaji", "Jonai"]
  },
  "Bihar": {
    center: { lat: 25.0961, lng: 85.3131 },
    cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Munger", "Chhapra", "Katihar", "Hajipur", "Sasaram", "Saharsa", "Siwan", "Bettiah", "Motihari", "Kishanganj", "Jamalpur", "Buxar", "Jehanabad", "Aurangabad", "Lakhisarai", "Nawada", "Jamui", "Madhubani", "Samastipur", "Supaul", "Forbesganj"]
  },
  "Chhattisgarh": {
    center: { lat: 21.2787, lng: 81.8661 },
    cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Dhamtari", "Mahasamund", "Durg", "Bhatapara", "Champa", "Naila Janjgir", "Raigarh", "Sunabeda", "Kawardha", "Kanker", "Bemetara", "Balod", "Gariaband", "Baloda Bazar", "Mungeli", "Kondagaon", "Sukma", "Bijapur", "Dantewada", "Narayanpur", "Jashpur", "Baikunthpur", "Surajpur"]
  },
  "Goa": {
    center: { lat: 15.2993, lng: 74.1240 },
    cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Valpoi", "Pernem", "Curchorem", "Sanguem", "Canacona", "Quepem", "Sanquelim", "Aldona", "Calangute", "Candolim", "Baga", "Vagator", "Anjuna", "Colva", "Benaulim", "Varca", "Mobor", "Sinquerim", "Old Goa", "Assagao", "Siolim", "Morjim", "Mandrem", "Arambol"]
  },
  "Gujarat": {
    center: { lat: 22.2587, lng: 71.1924 },
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Nadiad", "Anand", "Morvi", "Mahesana", "Surendranagar", "Bharuch", "Vapi", "Navsari", "Veraval", "Porbandar", "Godhra", "Bhuj", "Ankleshwar", "Botad", "Palanpur", "Patan", "Dahod", "Jetpur", "Valsad", "Kalol", "Gondal", "Deesa"]
  },
  "Haryana": {
    center: { lat: 29.0588, lng: 76.0856 },
    cities: ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal", "Hansi", "Narnaul", "Fatehabad", "Gohana", "Tohana", "Narwana", "Mandi Dabwali", "Charkhi Dadri", "Shahbad", "Pehowa", "Samalkha", "Pinjore"]
  },
  "Himachal Pradesh": {
    center: { lat: 31.1048, lng: 77.1734 },
    cities: ["Shimla", "Dharamshala", "Solan", "Mandi", "Nahan", "Una", "Chamba", "Hamirpur", "Kullu", "Bilaspur", "Paonta Sahib", "Sundarnagar", "Nalagarh", "Kangra", "Keylong", "Kalpa", "Reckong Peo", "Rampur", "Rohru", "Theog", "Parwanoo", "Manali", "Palampur", "Jogindernagar", "Dalhousie", "Kasauli", "Baddi", "Ghumarwin", "Sarkaghat"]
  },
  "Jharkhand": {
    center: { lat: 23.6102, lng: 85.2799 },
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chirkunda", "Jhumri Telaiya", "Sahibganj", "Pakur", "Gumla", "Chaibasa", "Chakradharpur", "Simdega", "Lohardaga", "Latehar", "Garhwa", "Chatra", "Koderma", "Dumka", "Godda", "Jamtara", "Saraikela", "Khunti", "Ghatsila", "Sindri"]
  },
  "Karnataka": {
    center: { lat: 15.3173, lng: 75.7139 },
    cities: ["Bangalore", "Hubli-Dharwad", "Mysore", "Gulbarga", "Belgaum", "Mangalore", "Davanagere", "Bellary", "Shimoga", "Tumkur", "Bijapur", "Raichur", "Bidar", "Hospet", "Hassan", "Gadag", "Udupi", "Kolar", "Mandya", "Chikmagalur", "Gangavati", "Bagalkot", "Ranebennur", "Karwar", "Sirsi", "Sagar", "Koppal", "Yadgir", "Chamarajanagar", "Ramanagara"]
  },
  "Kerala": {
    center: { lat: 10.8505, lng: 76.2711 },
    cities: ["Trivandrum", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kottayam", "Manjeri", "Thalassery", "Ponnani", "Vatakara", "Kanhangad", "Payyannur", "Koyilandy", "Neyyattinkara", "Kayamkulam", "Kannur", "Nedumangad", "Kasaragod", "Malappuram", "Shornur", "Kodungallur", "Pathanamthitta", "Attingal", "Kasargod", "Chengannur", "Muvattupuzha", "Thodupuzha", "Chalakudy"]
  },
  "Madhya Pradesh": {
    center: { lat: 22.9734, lng: 78.6569 },
    cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Katni", "Singrauli", "Chhindwara", "Morena", "Bhind", "Guna", "Shivpuri", "Khandwa", "Bhilai", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", "Khargone", "Neemuch", "Itarsi", "Sehore", "Betul", "Seoni", "Datia"]
  },
  "Maharashtra": {
    center: { lat: 19.7515, lng: 75.7139 },
    cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Pimpri-Chinchwad", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Aurangabad", "Navi Mumbai", "Solapur", "Mira-Bhayandar", "Kolhapur", "Amravati", "Sangli", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Nanded", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Ambarnath", "Bhusawal", "Panvel", "Badlapur", "Satara"]
  },
  "Manipur": {
    center: { lat: 24.6637, lng: 93.9063 },
    cities: ["Imphal", "Thoubal", "Kakching", "Mayang Imphal", "Lilong", "Senapati", "Ukhrul", "Churachandpur", "Chandel", "Tamenglong", "Jiribam", "Kangpokpi", "Noney", "Kamjong", "Tengnoupal", "Pherzawl", "Moirang", "Bishnupur", "Wangjing", "Yairipok", "Heirok", "Nambol", "Sekmai", "Lamlai", "Andro", "Kakching Khunou", "Sugnu", "Moreh", "Samurou", "Thongkhong Laxmi Bazar"]
  },
  "Meghalaya": {
    center: { lat: 25.4670, lng: 91.3662 },
    cities: ["Shillong", "Tura", "Nongpoh", "Nongstoin", "Jowai", "Williamnagar", "Resubelpara", "Baghmara", "Khliehriat", "Mawkyrwat", "Sohra", "Cherrapunji", "Mairang", "Umling", "Nongalbibra", "Garobadha", "Mendipathar", "Phulbari", "Dawki", "Byrnihat", "Jhalupara", "Madanrting", "Nongthymmai", "Pynthorumkhrah", "Shella", "Mawsynram", "Ranikor", "Rymbai", "Shangpung", "Sutnga"]
  },
  "Mizoram": {
    center: { lat: 23.1645, lng: 92.9376 },
    cities: ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Khawzawl", "Hnahthial", "Vairengte", "Thenzawl", "Saitual", "Darlawn", "Biate", "Sairang", "Lengpui", "Tlabung", "Bairabi", "Kanghmun", "Zawlnuam", "Kawrthah", "Nampa", "Ngopa", "Khawhai", "Farkawn", "Sangau", "Tuipang", "Phullen", "Sazaik"]
  },
  "Nagaland": {
    center: { lat: 26.1584, lng: 94.5624 },
    cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Kiphire", "Longleng", "Peren", "Chumoukedima", "Tseminyu", "Shamator", "Noklak", "Medziphema", "Jalukie", "Changtongya", "Tuli", "Pfutsero", "Radhe", "Meluri", "Naganimora", "Bhandari", "Aboi", "Tobu", "Mangkolemba", "Wakching", "Satakha", "Chiephobozou"]
  },
  "Odisha": {
    center: { lat: 20.9517, lng: 85.0985 },
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Rayagada", "Semiliguda", "Bolangir", "Bhawanipatna", "Talcher", "Angul", "Kendrapada", "Jagatsinghpur", "Jajpur", "Keonjhar", "Dhenkanal", "Phulbani", "Chatrapur", "Nabrangpur", "Malkangiri", "Nuapada", "Sonepur", "Sundargarh"]
  },
  "Punjab": {
    center: { lat: 31.1471, lng: 75.3412 },
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Moga", "Abohar", "Khanna", "Phagwara", "Muktsar", "Barnala", "Rajpura", "Firozpur", "Kapurthala", "Zirakpur", "Kotkapura", "Faridkot", "Tarn Taran", "Jagraon", "Malerkotla", "Gurdaspur", "Batala", "Mansa", "Nabha", "Fazilka", "Ropar", "Sangrur"]
  },
  "Rajasthan": {
    center: { lat: 27.0238, lng: 74.2179 },
    cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar", "Sri Ganganagar", "Bharatpur", "Pali", "Barmer", "Seder", "Tonk", "Hanumangarh", "Beawar", "Kishangarh", "Jhelum", "Baran", "Dholpur", "Bundi", "Jalore", "Jaisalmer", "Sawai Madhopur", "Chittorgarh", "Jhunjhunu", "Nagaur", "Banswara", "Dungarpur"]
  },
  "Sikkim": {
    center: { lat: 27.5330, lng: 88.5122 },
    cities: ["Gangtok", "Namchi", "Geyzing", "Mangan", "Soreng", "Pakyong", "Rangpo", "Singtam", "Nayabazar", "Jorethang", "Ravangla", "Lachen", "Lachung", "Pelling", "Yuksom", "Legship", "Dentam", "Kewzing", "Rabong", "Rhenock", "Rongli", "Pedong", "Majitar", "Makha", "Dikchu", "Phodong", "Chungthang", "Gyalshing", "Sombaria", "Temi Tarku"]
  },
  "Tamil Nadu": {
    center: { lat: 11.1271, lng: 78.6569 },
    cities: ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Nagercoil", "Thanjavur", "Dindigul", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", "Pollachi", "Rajapalayam", "Gudiyatham", "Pudukkottai", "Vaniyambadi", "Ambur", "Nagapattinam", "Hosur", "Karaikudi", "Neyveli", "Kumbakonam", "Tiruvannamalai", "Kanchipuram", "Cuddalore"]
  },
  "Telangana": {
    center: { lat: 18.1124, lng: 79.0193 },
    cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Siddipet", "Jagtial", "Mancherial", "Kothagudem", "Bodhan", "Sircilla", "Kamareddy", "Bellampally", "Bhadrachalam", "Vikarabad", "Jangaon", "Wanaparthy", "Gadwal", "Medak", "Sangareddy", "Bhongir", "Tandur", "Nirmal", "Armoor"]
  },
  "Tripura": {
    center: { lat: 23.9408, lng: 91.9882 },
    cities: ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia", "Khowai", "Ambassa", "Jirania", "Mohanpur", "Ranirbazar", "Bishalgarh", "Sonamura", "Melaghar", "Sabroom", "Santirbazar", "Amarpur", "Kamalpur", "Kumarghat", "Teliamura", "Kanchanpur", "Gandacharra", "Karook", "Panisagar", "Jampuijala", "Kakraban", "Boxanagar", "Kathalia", "Hrishyamukh", "Rupaichari", "Silachari"]
  },
  "Uttar Pradesh": {
    center: { lat: 26.8467, lng: 80.9462 },
    cities: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Ayodhya", "Rampur", "Shahjahanpur", "Farrukhabad", "Hapur", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Rae Bareli", "Orai"]
  },
  "Uttarakhand": {
    center: { lat: 30.0668, lng: 79.0193 },
    cities: ["Dehradun", "Haridwar", "Haldwani", "Rudrapur", "Kashipur", "Roorkee", "Rishikesh", "Pithoragarh", "Ramnagar", "Manglaur", "Jaspur", "Kichha", "Srinagar", "Kotdwar", "Mussoorie", "Almora", "Tehri", "Pauri", "Nainital", "Bageshwar", "Champawat", "Uttarkashi", "Gopeshwar", "Chamoli", "Joshimath", "Ranikhet", "Lalkuan", "Vikasnagar", "Herbertpur", "Doiwala"]
  },
  "West Bengal": {
    center: { lat: 22.9868, lng: 87.8550 },
    cities: ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Kharagpur", "Bardhaman", "Malda", "Baharampur", "Habra", "Jalpaiguri", "Balurghat", "Raiganj", "Medinipur", "Krishnanagar", "Purulia", "Bankura", "Cooch Behar", "Darjeeling", "Kalimpong", "Alipurduar", "Suri", "Contai", "Haldia", "Basirhat", "Barasat", "Barrackpore", "Serampore", "Chinsurah", "Kalyani"]
  },
  "Jammu & Kashmir": {
    center: { lat: 33.7780, lng: 76.5762 },
    cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore", "Udhampur", "Poonch", "Rajouri", "Kupwara", "Kargil", "Leh", "Bhaderwah", "Doda", "Ramban", "Kishtwar", "Reasi", "Katra", "Samba", "Ganderbal", "Bandipora", "Budgam", "Pulwama", "Shopian", "Kulgam", "Awantipora", "Pampore", "Tral", "Bijbehara", "Mattan"]
  },
  "Ladakh": {
    center: { lat: 34.1526, lng: 77.5771 },
    cities: ["Leh", "Kargil", "Diskit", "Padum", "Nyoma", "Khaltsi", "Drass", "Sankoo", "Hunder", "Sumur", "Spangmik", "Tangtse", "Chushul", "Demchok", "Hanle", "Turtuk", "Panamik", "Nubra", "Shey", "Thiksey", "Hemis", "Alchi", "Likir", "Lamayuru", "Mulbekh", "Zanskar", "Rangdum", "Sani", "Karsha", "Stongdey"]
  },
  "Delhi": {
    center: { lat: 28.6139, lng: 77.2090 },
    cities: ["New Delhi", "Connaught Place", "Karol Bagh", "Dwarka", "Rohini", "Vasant Kunj", "Saket", "Rajouri Garden", "Hauz Khas", "Shahdara", "Okhla", "Lajpat Nagar", "Mayur Vihar", "Chandni Chowk", "Pitampura", "Janakpuri", "Vikaspuri", "Paschim Vihar", "Shalimar Bagh", "Model Town", "Civil Lines", "Patel Nagar", "Laxmi Nagar", "Preet Vihar", "Vasundhara Enclave", "Kalkaji", "Alaknanda", "Greater Kailash", "Defence Colony", "Chanakyapuri"]
  },
  "Puducherry": {
    center: { lat: 11.9416, lng: 79.8083 },
    cities: ["Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai", "Villianur", "Ariyankuppam", "Bahour", "Nettapakkam", "Mannadipet", "Kalapet", "Lawspet", "Nellithope", "Reddiarpalayam", "Mudaliarpet", "Orleanpet", "Muthialpet", "Velrampet", "Murungapakkam", "Nonankuppam", "Veerampattinam", "Manavely", "Embalam", "Kirumampakkam", "Karikalampakkam", "Madagadipet", "Koodapakkam", "Sultanpet", "Kunichampet", "Sorapet"]
  },
  "Andaman & Nicobar": {
    center: { lat: 11.7401, lng: 92.6586 },
    cities: ["Port Blair", "Garacharma", "Bambooflat", "Prothrapur", "Bathubasti", "Aberdeen", "Phoenix Bay", "Haddo", "Junglighat", "Shadipur", "Lambaline", "Dollygunj", "School Line", "Calicut", "Chouldari", "Wimberlygunj", "Ferrargunj", "Baratang", "Rangat", "Mayabunder", "Diglipur", "Campbell Bay", "Car Nicobar", "Havelock Island", "Neil Island", "Hut Bay", "Nancowry", "Katchal", "Teressa", "Chowra"]
  },
  "Chandigarh": {
    center: { lat: 30.7333, lng: 76.7794 },
    cities: ["Chandigarh", "Sector 17", "Sector 22", "Sector 35", "Sector 43", "Sector 15", "Sector 19", "Sector 8", "Sector 9", "Sector 10", "Sector 11", "Sector 26", "Sector 27", "Sector 28", "Sector 32", "Sector 34", "Sector 36", "Sector 37", "Sector 38", "Sector 40", "Sector 44", "Manimajra", "Hallomajra", "Kajheri", "Palsora", "Maloya", "Dadu Majra", "Kishangarh", "Khuda Lahora", "Khuda Alisher"]
  },
  "Lakshadweep": {
    center: { lat: 10.5667, lng: 72.6417 },
    cities: ["Kavaratti", "Agatti", "Amini", "Andrott", "Bitra", "Chetlat", "Kadmat", "Kalpeni", "Kiltan", "Minicoy", "Bangaram", "Suheli", "Pitti", "Cheriyam", "Kodithala", "Tilakkam", "Sand Key", "Pitti Bird Sanctuary", "Kalpeni Lagoon", "Kavaratti Town", "Minicoy Lighthouse", "Agatti Airport Area", "Amini Village", "Andrott Jetty", "Kadmat Beach Area", "Kiltan Harbor", "Chetlat Village", "Bitra Island Area", "Kalpeni Harbor Area", "Minicoy Village"]
  },
  "Dadra & Nagar Haveli and Daman & Diu": {
    center: { lat: 20.1809, lng: 73.0169 },
    cities: ["Silvassa", "Daman", "Diu", "Dadra", "Naroli", "Masat", "Rakholi", "Khanvel", "Luhari", "Dudhni", "Mandoni", "Sindoni", "Samarvarni", "Sayli", "Galonda", "Kilvani", "Silli", "Vasona", "Chikhli", "Dapada", "Velugam", "Ghoghla", "Fudam", "Bucharwada", "Nani Daman", "Moti Daman", "Dunetha", "Marwad", "Kadaiya", "Bhimpore"]
  }
};

Object.entries(stateCityMap).forEach(([state, data]) => {
  const { center, cities } = data;
  cities.forEach((cityName) => {
    const exists = dbData.cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (!exists) {
      const latOffset = (Math.random() - 0.5) * 1.6;
      const lngOffset = (Math.random() - 0.5) * 1.6;
      const lat = parseFloat((center.lat + latOffset).toFixed(4));
      const lng = parseFloat((center.lng + lngOffset).toFixed(4));

      // Curated City Specific Images
      const CURATED_CITY_IMAGES = {
        "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        "hyderabad": "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800",
        "bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
        "bengaluru": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
        "delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        "new delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        "mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
        "jaipur": "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800",
        "varanasi": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
        "banaras": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
        "kashi": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
        "amritsar": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
        "agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
        "udaipur": "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=800",
        "srinagar": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
        "hampi": "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
        "kochi": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
        "cochin": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
        "munnar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
        "ooty": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        "pondicherry": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
        "puducherry": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
        "rishikesh": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800",
        "haridwar": "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
        "kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
        "calcutta": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
        "chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        "madras": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        "tirupati": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
        "tirupathi": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
        "tirumala": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
        "vizag": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "visakhapatnam": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "madurai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        "puri": "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=800",
        "darjeeling": "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
        "gangtok": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
        "shillong": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
        "mysore": "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800",
        "coorg": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
        "lonavala": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
        "mahabaleshwar": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
        "pune": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800",
        "ahmedabad": "https://images.unsplash.com/photo-1603258593453-14d4291a1a45?w=800",
        "port blair": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
      };

      // General pool for all other cities (50 images)
      const generalCityPool = [
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
        "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=800",
        "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
        "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800",
        "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800",
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
        "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=800",
        "https://images.unsplash.com/photo-1603258593453-14d4291a1a45?w=800",
        "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
      ];

      // Theme-based descriptions
      const descriptions = {
        beaches: `Explore the beautiful coastal city of ${cityName} in ${state}. Famous for its pristine sandy beaches, refreshing sea breezes, local seafood delicacies, and vibrant coastal culture.`,
        scenic_hills: `Discover the breathtaking hill destination of ${cityName} in ${state}. Celebrated for its misty valleys, panoramic viewpoints, pleasant weather, and lush green natural landscape.`,
        temples: `Visit the sacred spiritual heritage center of ${cityName} in ${state}. Renowned for its magnificent ancient temples, rich mythological history, and peaceful cultural atmosphere.`,
        historic_forts: `Step back in time in the historic city of ${cityName} in ${state}. Known for its grand royal forts, majestic palaces, legacy monuments, and stories of ancient heritage.`,
        modern_urban: `Experience the dynamic urban vibes of ${cityName} in ${state}. A major modern hub featuring spectacular skylines, bustling streets, diverse culinary avenues, and tech innovations.`,
        rivers_delta: `Immerse yourself in the scenic beauty of ${cityName} in ${state}. Located in a lush riverfront region, celebrated for its fertile green fields, quiet waterways, and local agrarian heritage.`
      };

      const nameLower = cityName.toLowerCase().trim();
      const stateLower = state.toLowerCase().trim();
      let theme = 'rivers_delta';

      if (
        stateLower === "goa" || stateLower === "andaman & nicobar" || stateLower === "lakshadweep" ||
        nameLower.endsWith("patnam") || nameLower.endsWith("patanam") || nameLower.endsWith("coast") ||
        nameLower.endsWith("beach") || nameLower.endsWith("port") ||
        ["visakhapatnam", "kakinada", "machilipatnam", "bapatla", "mumbai", "puducherry", "chennai", "kochi", "alappuzha", "mangalore", "thoothukudi", "karwar", "daman", "diu"].includes(nameLower)
      ) {
        theme = 'beaches';
      } else if (
        nameLower.includes("valley") || nameLower.includes("hills") || nameLower.includes("giri") ||
        nameLower.includes("mandi") || nameLower.includes("solan") || nameLower.includes("shimla") ||
        nameLower.includes("manali") || nameLower.includes("kullu") || nameLower.includes("dharamshala") ||
        nameLower.includes("ooty") || nameLower.includes("darjeeling") || nameLower.includes("mussoorie") ||
        nameLower.includes("munnar") || nameLower.includes("lonavala") || nameLower.includes("hill") ||
        nameLower.includes("sohra") || nameLower.includes("cherrapunji") || nameLower.includes("paderu") ||
        nameLower.includes("lachen") || nameLower.includes("lachung") || nameLower.includes("tawang") ||
        nameLower.includes("ziro") || nameLower.includes("leh")
      ) {
        theme = 'scenic_hills';
      } else if (
        nameLower.endsWith("giri") || nameLower.endsWith("temple") || nameLower.endsWith("mandir") ||
        nameLower.includes("tirupati") || nameLower.includes("srikalahasti") || nameLower.includes("srisailam") ||
        nameLower.includes("varanasi") || nameLower.includes("puri") || nameLower.includes("gaya") ||
        nameLower.includes("ayodhya") || nameLower.includes("madurai") || nameLower.includes("kanchipuram") ||
        nameLower.includes("vellore") || nameLower.includes("thanjavur") || nameLower.includes("ujjain") ||
        nameLower.includes("pushkar") || nameLower.includes("rameswaram") || nameLower.includes("dwaraka") ||
        nameLower.includes("kedarnath") || nameLower.includes("badrinath") || nameLower.includes("haridwar") ||
        nameLower.includes("rishikesh") || nameLower.includes("amritsar") || nameLower.includes("somnath") ||
        nameLower.includes("shirdi") || nameLower.includes("kalyan") || nameLower.includes("golgonda")
      ) {
        theme = 'temples';
      } else if (
        nameLower.includes("fort") || nameLower.includes("palace") || nameLower.includes("jaipur") ||
        nameLower.includes("jodhpur") || nameLower.includes("udaipur") || nameLower.includes("bikaner") ||
        nameLower.includes("jaisalmer") || nameLower.includes("kota") || nameLower.includes("gwalior") ||
        nameLower.includes("agra") || nameLower.includes("jhansi") || nameLower.includes("delhi") ||
        nameLower.includes("reddy") || nameLower.includes("mahal") || nameLower.includes("nizam")
      ) {
        theme = 'historic_forts';
      } else if (
        ["bangalore", "hyderabad", "gurgaon", "noida", "chandigarh", "pune", "ahmedabad", "navi mumbai", "secunderabad"].includes(nameLower)
      ) {
        theme = 'modern_urban';
      }

      let selectedImage = "";
      if (CURATED_CITY_IMAGES[nameLower]) {
        selectedImage = CURATED_CITY_IMAGES[nameLower];
      } else {
        // Generate a stable hash from the city name to pick from generalCityPool
        let hash = 0;
        for (let i = 0; i < cityName.length; i++) {
          hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const idx = Math.abs(hash) % generalCityPool.length;
        selectedImage = generalCityPool[idx];
      }

      const description = descriptions[theme] || descriptions.rivers_delta;

      dbData.cities.push({
        name: cityName,
        state: state,
        description: description,
        image: selectedImage,
        lat: lat,
        lng: lng
      });
    }
  });
});

// 2. Curated Travel Tips
dbData.travelTips = [
  {
    id: "tip-1",
    title: "Discover India's Street Food Safely",
    category: "food",
    text: "Look for stalls with long queues of locals—it's the best indicator of fresh ingredients and excellent hygiene. Start with hot foods like fresh samosas or jalebis.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500"
  },
  {
    id: "tip-2",
    title: "Best Season to Visit the Coast",
    category: "culture",
    text: "Coastal regions like Goa, Kerala, and Mumbai are best visited between November and February when the weather is warm, dry, and exceptionally pleasant.",
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=500"
  },
  {
    id: "tip-3",
    title: "Booking Trains & Local Stays",
    category: "budget",
    text: "Always book IRCTC trains a few weeks in advance. Use luxury hotels or homestays with verified ratings. Consider heritage Havelis in Rajasthan for an unforgettable experience.",
    image: "https://images.unsplash.com/photo-1589136777351-fdc9c9400c7e?w=500"
  }
];

// 3. New Curated Places List
const placesList = [];

// --- GOA PLACES ---
placesList.push({
  id: "p-goa-1",
  name: "Taj Exotica Resort & Spa",
  type: "resort",
  subtypes: ["Resorts", "Luxury Hotels", "Beach Resorts"],
  rating: 4.8,
  reviewCount: 1240,
  priceLevel: 4,
  priceRange: "₹25,000 - ₹45,000 per night",
  address: "Calwaddo, Benaulim, Goa 403716",
  description: "Embrace the Mediterranean style architecture spread across 56 acres of lush gardens along the beach. Features multi-cuisine fine dining, world-class golf sessions, Ayurvedic spa, and grand outdoor pools.",
  photos: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"],
  facilities: ["WiFi", "Swimming Pool", "Parking", "AC", "Breakfast", "Spa", "Gym", "Private Beach Access"],
  phone: "+91 832 668 3333",
  website: "https://www.tajhotels.com",
  coordinates: { lat: 15.2449, lng: 73.9213 },
  city: "Goa",
  state: "Goa",
  activities: ["Private Beach Dinner", "9-hole Golf Course", "Ayurvedic Jiva Spa", "Water Sports"],
  rooms: [
    { type: "Deluxe Sea View Room", price: "₹28,000", amenities: ["King Bed", "Private Balcony", "Sea View"] },
    { type: "Luxury Villa Plunge Pool", price: "₹52,000", amenities: ["Private Plunge Pool", "Butlers Service", "Garden Access"] }
  ]
});
placesList.push({
  id: "p-goa-2",
  name: "W Goa",
  type: "hotel",
  subtypes: ["Luxury Hotels", "Boutique Stays", "Beach Hotels"],
  rating: 4.7,
  reviewCount: 780,
  priceLevel: 4,
  priceRange: "₹20,000 - ₹38,000 per night",
  address: "Vagator Beach, Bardez, Goa 430509",
  description: "Experience the vibrant spirit of North Goa at this ultra-luxury designer hotel. Located right on the shores of Vagator Beach, featuring dramatic cliffside sunset views, private beach access, a stylish Rockpool bar, and gourmet fusion restaurants.",
  photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Bar", "Breakfast", "Gym", "Private Beach Access"],
  phone: "+91 832 671 8888",
  website: "https://www.marriott.com/w-goa",
  coordinates: { lat: 15.6025, lng: 73.7348 },
  city: "Goa",
  state: "Goa",
  rooms: [
    { type: "Wonderful Room", price: "₹22,000", amenities: ["King Bed", "Garden View", "Rain Shower"] },
    { type: "Marvelous Suite", price: "₹45,000", amenities: ["King Bed", "Ocean Vista", "Private Terrace"] }
  ]
});
placesList.push({
  id: "p-goa-3",
  name: "Fort Aguada",
  type: "attraction",
  subtypes: ["Historical Sites", "Famous Landmarks", "Sightseeing"],
  rating: 4.5,
  reviewCount: 3120,
  priceLevel: 1,
  priceRange: "₹50 (Entry Ticket)",
  address: "Sinquerim, Candolim, Goa 403515",
  description: "A well-preserved seventeenth-century Portuguese fort standing on Sinquerim Beach, overlooking the Arabian Sea. It features a historic four-story lighthouse and massive stone fortifications built to protect the estuary from Dutch attacks.",
  photos: ["https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600"],
  facilities: ["Parking", "Guided Tours", "Camera Allowed", "Kids Friendly"],
  phone: "+91 832 241 1234",
  website: "https://www.goatourism.gov.in",
  coordinates: { lat: 15.4926, lng: 73.7739 },
  city: "Goa",
  state: "Goa"
});
placesList.push({
  id: "p-goa-4",
  name: "The Fisherman's Wharf",
  type: "restaurant",
  subtypes: ["Seafood", "Fine Dining", "Riverside Dining"],
  rating: 4.6,
  reviewCount: 1850,
  priceLevel: 3,
  priceRange: "₹1,800 for two",
  address: "Mobor, Cavelossim, Salcete, Goa 403731",
  description: "A legendary Goan riverside restaurant modeled like a traditional fishing village. Enjoy fresh seafood caught daily, live local music, and an exceptional cocktail deck overlooking the peaceful Sal river.",
  photos: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"],
  facilities: ["AC", "Outdoor Seating", "Live Music", "Parking", "Bar"],
  phone: "+91 832 287 1317",
  website: "https://thefishermanswharf.in",
  coordinates: { lat: 15.1633, lng: 73.9442 },
  city: "Goa",
  state: "Goa",
  menuHighlights: ["Goan Fish Curry", "Masala Fried Calamari", "Prawn Balchao", "Bebinca"],
  popularFoods: ["Kingfish Rawa Fry", "Serradura", "Feni Cocktails"],
  vegFriendly: true,
  nonVegFriendly: true
});
placesList.push({
  id: "p-goa-5",
  name: "Curlies Beach Shack",
  type: "cafe",
  subtypes: ["Beach Shacks", "Cafes", "Hangout Places"],
  rating: 4.4,
  reviewCount: 2900,
  priceLevel: 2,
  priceRange: "₹900 for two",
  address: "South Anjuna Beach, Anjuna, Goa 403509",
  description: "One of the oldest and most iconic beach shacks in Goa. Nestled at the southern end of Anjuna beach, offering wood-fired pizzas, Goan snacks, chilled beers, and a legendary sunset view deck.",
  photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600"],
  facilities: ["WiFi", "Outdoor Seating", "Beachfront Access", "Bar", "Live DJ"],
  phone: "+91 98221 68112",
  website: "http://curliesgoa.com",
  coordinates: { lat: 15.5721, lng: 73.7431 },
  city: "Goa",
  state: "Goa"
});
placesList.push({
  id: "p-goa-6",
  name: "Basilica of Bom Jesus",
  type: "attraction",
  subtypes: ["Historical Sites", "UNESCO Heritage", "Sightseeing"],
  rating: 4.7,
  reviewCount: 4120,
  priceLevel: 1,
  priceRange: "Free Entry",
  address: "Old Goa Road, Bainguinim, Goa 403402",
  description: "A UNESCO World Heritage Site containing the mortal remains of St. Francis Xavier. Built in 1605, it is a magnificent example of Baroque architecture in India.",
  photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"],
  facilities: ["Parking", "Guided Tours", "Historical Museum"],
  phone: "+91 832 228 5790",
  website: "http://www.bomjesus.org",
  coordinates: { lat: 15.5009, lng: 73.9116 },
  city: "Goa",
  state: "Goa"
});
placesList.push({
  id: "p-goa-7",
  name: "Caravela Beach Resort",
  type: "resort",
  subtypes: ["Resorts", "Golf Resorts", "Luxury Resorts"],
  rating: 4.6,
  reviewCount: 990,
  priceLevel: 4,
  priceRange: "₹18,000 - ₹32,000 per night",
  address: "Varca Beach, Salcete, Goa 403721",
  description: "A luxury beach resort on Varca beach featuring a 9-hole golf course, massive swimming pool, Ayurvedic spa, and private beachfront cabanas.",
  photos: ["https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "9-hole Golf Course", "Private Beach Access"],
  phone: "+91 832 669 5000",
  website: "https://www.caravelabeachresortgoa.com",
  coordinates: { lat: 15.2201, lng: 73.9352 },
  city: "Goa",
  state: "Goa",
  activities: ["Golf sessions", "Ayurvedic Massage", "Beach Yoga", "Dolphin Tours"],
  rooms: [
    { type: "Garden View Room", price: "₹18,000", amenities: ["King Bed", "WiFi", "AC"] },
    { type: "Ocean Front Suite", price: "₹35,000", amenities: ["King Bed", "Ocean View", "Mini Bar"] }
  ]
});
placesList.push({
  id: "p-goa-8",
  name: "Shri Mangeshi Temple",
  type: "attraction",
  subtypes: ["Temples", "Historical Sites", "Sightseeing"],
  rating: 4.6,
  reviewCount: 1540,
  priceLevel: 1,
  priceRange: "Free Entry",
  address: "Mangeshi Village, Ponda, Goa 403401",
  description: "A beautiful 450-year-old temple dedicated to Lord Manguesh, an incarnation of Lord Shiva. Known for its gorgeous Goan Hindu architecture, featuring a grand seven-story octagonal lamp tower (Deepastambha) and a scenic temple water tank.",
  photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"],
  facilities: ["Parking", "Camera Allowed", "Lamps Tower", "Sacred Tank"],
  phone: "+91 832 234 3338",
  website: "https://www.shrimangesh.org",
  coordinates: { lat: 15.4437, lng: 73.9678 },
  city: "Goa",
  state: "Goa"
});
placesList.push({
  id: "p-goa-9",
  name: "Museum of Christian Art",
  type: "attraction",
  subtypes: ["Museums", "Historical Sites", "Art Galleries"],
  rating: 4.5,
  reviewCount: 380,
  priceLevel: 1,
  priceRange: "₹100 Entry",
  address: "Convent of Santa Monica, Old Goa 403402",
  description: "Located inside the historic Convent of Santa Monica, this unique museum showcases a stunning collection of Indo-Portuguese Christian art. Examine antique gold-embroidered vestments, ivory sculptures, and historic silver chalices dating back to the 16th century.",
  photos: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600", "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"],
  facilities: ["Parking", "Guided Tours", "Art Gallery", "Kids Friendly"],
  phone: "+91 832 228 5080",
  website: "http://www.museumofchristianart.com",
  coordinates: { lat: 15.5015, lng: 73.9150 },
  city: "Goa",
  state: "Goa"
});

// --- HYDERABAD PLACES ---
placesList.push({
  id: "p-hyd-1",
  name: "Jewel of Nizams - Minar",
  type: "restaurant",
  subtypes: ["Fine Dining", "Non-Vegetarian Restaurants", "Famous Food Places"],
  rating: 4.7,
  reviewCount: 890,
  priceLevel: 4,
  priceRange: "₹3,500 for two",
  address: "The Golkonda Resort, Gandipet, Hyderabad 500075",
  description: "An iconic tower-restaurant elevated 100 feet in the air, offering the ultimate authentic royal Hyderabadi culinary experience, backed by spectacular views of the Osman Sagar lake.",
  photos: ["https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600", "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600"],
  facilities: ["Parking", "AC", "Valet Parking", "Lake View", "Rooftop Deck"],
  phone: "+91 40 2419 3000",
  website: "https://www.golkondaresorts.com",
  coordinates: { lat: 17.3820, lng: 78.3032 },
  city: "Hyderabad",
  state: "Telangana",
  menuHighlights: ["Anokhi Kheer", "Pathar ka Gosht", "Kachis Biryani", "Subz Haleem"],
  popularFoods: ["Royal Hyderabadi Haleem", "Nizami Mutton Biryani", "Double ka Meetha"],
  vegFriendly: true,
  nonVegFriendly: true
});
placesList.push({
  id: "p-hyd-2",
  name: "Taj Falaknuma Palace",
  type: "hotel",
  subtypes: ["Luxury Hotels", "Heritage Stays", "Palace Stays"],
  rating: 4.9,
  reviewCount: 1650,
  priceLevel: 4,
  priceRange: "₹45,000 - ₹95,000 per night",
  address: "Engine Bowli, Falaknuma, Hyderabad 500053",
  description: "Built in 1894, this spectacular royal palace was the former residence of the Nizam of Hyderabad. Experience true royal treatment with horse-drawn carriage arrivals, private palace historians, and dining at the world's longest dining table.",
  photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "Royal Museum", "Horse Carriage", "Gym"],
  phone: "+91 40 6629 8585",
  website: "https://www.tajhotels.com/en-in/hotels/taj-falaknuma-palace-hyderabad/",
  coordinates: { lat: 17.3301, lng: 78.4682 },
  city: "Hyderabad",
  state: "Telangana",
  rooms: [
    { type: "Palace Room Garden View", price: "₹48,000", amenities: ["King Bed", "Nizam-style Decor", "Bathtub"] },
    { type: "The Grand Nizam Suite", price: "₹1,80,000", amenities: ["Private Pool", "Private Butler", "Royal Terrace"] }
  ]
});
placesList.push({
  id: "p-hyd-3",
  name: "Golkonda Resorts & Spa",
  type: "resort",
  subtypes: ["Resorts", "Luxury Resorts", "Spa Resorts"],
  rating: 4.6,
  reviewCount: 1100,
  priceLevel: 4,
  priceRange: "₹9,000 - ₹20,000 per night",
  address: "Sagar Mahal Complex, Gandipet, Hyderabad 500075",
  description: "A tranquil resort set right next to the historic Osman Sagar lake, offering beautiful green lawns, luxury villas, a full-service spa, and multiple fine dining options.",
  photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "Breakfast", "Parking", "Bar"],
  phone: "+91 40 2419 3000",
  website: "https://www.golkondaresorts.com",
  coordinates: { lat: 17.3815, lng: 78.3025 },
  city: "Hyderabad",
  state: "Telangana",
  activities: ["Osman Sagar Boating", "Ayurvedic Massage", "Tennis Court", "Nature Walk"],
  rooms: [
    { type: "Greenwood Villa", price: "₹9,500", amenities: ["King Bed", "Lawn View", "AC"] },
    { type: "Pool Villa", price: "₹18,000", amenities: ["Private Plunge Pool", "King Bed", "WiFi"] }
  ]
});
placesList.push({
  id: "p-hyd-4",
  name: "Charminar",
  type: "attraction",
  subtypes: ["Historical Sites", "Famous Landmarks", "Sightseeing"],
  rating: 4.6,
  reviewCount: 6500,
  priceLevel: 1,
  priceRange: "₹40 Entry",
  address: "Charminar Road, Hyderabad 500002",
  description: "Built in 1591, this mosque and monument is the global symbol of Hyderabad. Known for its gorgeous four grand minarets, historical architecture, and the bustling bazaar surrounding it.",
  photos: ["https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600", "https://images.unsplash.com/photo-1609137144813-2dbe4889fc68?w=600"],
  facilities: ["Camera Allowed", "Guided Tours", "Street Markets"],
  phone: "+91 40 2452 2400",
  website: "http://www.telanganatourism.gov.in",
  coordinates: { lat: 17.3616, lng: 78.4747 },
  city: "Hyderabad",
  state: "Telangana"
});
placesList.push({
  id: "p-hyd-5",
  name: "Roastery Coffee House",
  type: "cafe",
  subtypes: ["Cafes", "Hangout Places", "Specialty Coffee"],
  rating: 4.5,
  reviewCount: 2200,
  priceLevel: 2,
  priceRange: "₹800 for two",
  address: "Road No. 14, Banjara Hills, Hyderabad 500034",
  description: "A gorgeous bungalow-style cafe nestled in the quiet lanes of Banjara Hills. Famous for its specialty house-roasted coffee, green outdoor courtyard, and excellent continental food.",
  photos: ["https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"],
  facilities: ["WiFi", "AC", "Outdoor Seating", "Veg Friendly", "Accepts Cards"],
  phone: "+91 40 2335 1234",
  website: "https://theroasterycoffeehouse.com",
  coordinates: { lat: 17.4172, lng: 78.4312 },
  city: "Hyderabad",
  state: "Telangana"
});
placesList.push({
  id: "p-hyd-6",
  name: "Golconda Fort",
  type: "attraction",
  subtypes: ["Forts", "Historical Sites", "Famous Landmarks"],
  rating: 4.7,
  reviewCount: 5400,
  priceLevel: 1,
  priceRange: "₹80 Entry",
  address: "Ibrahim Bagh, Hyderabad 500008",
  description: "A spectacular medieval fortress that was once the capital of the Qutb Shahi kingdom. Renowned for its brilliant acoustics, secret tunnels, and massive defense cannons.",
  photos: ["https://images.unsplash.com/photo-1608958416710-bbefbd917769?w=600", "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"],
  facilities: ["Camera Allowed", "Light & Sound Show", "Guided Tours"],
  phone: "+91 40 2351 2401",
  website: "https://www.telanganatourism.gov.in",
  coordinates: { lat: 17.3833, lng: 78.4011 },
  city: "Hyderabad",
  state: "Telangana"
});
placesList.push({
  id: "p-hyd-7",
  name: "Salar Jung Museum",
  type: "attraction",
  subtypes: ["Museums", "Historical Sites", "Art Galleries"],
  rating: 4.7,
  reviewCount: 3800,
  priceLevel: 1,
  priceRange: "₹50 Entry",
  address: "Salargunj, Dar-ul-Shifa, Hyderabad 500002",
  description: "One of the three National Museums of India, housing the legendary art collection of the Salar Jung family. Witness the world-famous Veiled Rebecca marble statue, the historic musical bracket clock, and rare ancient manuscripts, weaponry, and royal textiles.",
  photos: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600", "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600"],
  facilities: ["Parking", "Audio Guides", "Locker Room", "Cafeteria", "Kids Friendly"],
  phone: "+91 40 2452 3211",
  website: "https://www.salarjungmuseum.in",
  coordinates: { lat: 17.3712, lng: 78.4804 },
  city: "Hyderabad",
  state: "Telangana"
});
placesList.push({
  id: "p-hyd-8",
  name: "Birla Mandir",
  type: "attraction",
  subtypes: ["Temples", "Famous Landmarks", "Sightseeing"],
  rating: 4.7,
  reviewCount: 4200,
  priceLevel: 1,
  priceRange: "Free Entry",
  address: "Hill Fort Road, Khairatabad, Hyderabad 500004",
  description: "A spectacular Hindu temple built entirely of 2,000 tons of pure white Rajasthani marble. Sitting atop the high Naubath Pahad hill, it offers stunning panoramic views of the city and Hussain Sagar lake, dedicated to Lord Venkateswara.",
  photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600"],
  facilities: ["Parking", "Hilltop Viewpoint", "Shoe Stand", "Holy Prasadam"],
  phone: "+91 40 2345 6789",
  website: "https://www.telanganatourism.gov.in",
  coordinates: { lat: 17.4062, lng: 78.4690 },
  city: "Hyderabad",
  state: "Telangana"
});

// --- BANGALORE PLACES ---
placesList.push({
  id: "p-blr-1",
  name: "The Black Pearl",
  type: "restaurant",
  subtypes: ["Family Restaurants", "Fine Dining", "Famous Food Places"],
  rating: 4.6,
  reviewCount: 2310,
  priceLevel: 3,
  priceRange: "₹1,800 for two",
  address: "5th Block, Koramangala, Bangalore 560095",
  description: "India's famous pirate-themed buffet restaurant. Styled like an authentic wooden pirate ship with skull models, pirate flags, and live music, serving outstanding international barbecues and local favorites.",
  photos: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"],
  facilities: ["WiFi", "Parking", "AC", "Live Music", "Bar", "Kids Friendly Area"],
  phone: "+91 80 4965 2940",
  website: "https://theblackpearl.co.in",
  coordinates: { lat: 12.9344, lng: 77.6212 },
  city: "Bangalore",
  state: "Karnataka",
  menuHighlights: ["Cajun Spiced Potatoes", "Jamaican Jerk Chicken", "Pirate Chocolate Mousse"],
  popularFoods: ["Custom Grill Skewers", "Unlimited Craft Beer", "Prawn Pepper Fry"],
  vegFriendly: true,
  nonVegFriendly: true
});
placesList.push({
  id: "p-blr-2",
  name: "The Leela Palace Bangalore",
  type: "hotel",
  subtypes: ["Luxury Hotels", "Palace Stays", "Business Hotels"],
  rating: 4.9,
  reviewCount: 1950,
  priceLevel: 4,
  priceRange: "₹22,000 - ₹45,000 per night",
  address: "HAL Old Airport Road, Indiranagar, Bangalore 560008",
  description: "A luxury hotel inspired by the grand architectural heritage of the Mysore Palace. Nestled inside nine acres of lush gardens with waterfalls, features gold leaf domes, hand-woven carpets, and multiple world-class restaurants.",
  photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "Gym", "Valet Parking", "Fine Dining"],
  phone: "+91 80 2521 1234",
  website: "https://www.theleela.com/the-leela-palace-bengaluru",
  coordinates: { lat: 12.9606, lng: 77.6483 },
  city: "Bangalore",
  state: "Karnataka",
  rooms: [
    { type: "Deluxe Garden View", price: "₹24,000", amenities: ["King Bed", "Balcony", "AC"] },
    { type: "Royal Club Suite", price: "₹50,000", amenities: ["Butler Service", "Club Access", "King Bed"] }
  ]
});
placesList.push({
  id: "p-blr-3",
  name: "Angsana Oasis Resort",
  type: "resort",
  subtypes: ["Resorts", "Luxury Resorts", "Spa Resorts"],
  rating: 4.5,
  reviewCount: 880,
  priceLevel: 4,
  priceRange: "₹8,500 - ₹18,000 per night",
  address: "Doddaballapur Road, Addevishwanathapura, Bangalore 560064",
  description: "An oasis of calmness just outside the city. Featuring beautiful wellness spa programs, massive swimming pools, outdoor sports, and a highly quiet botanical garden setting.",
  photos: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "Breakfast", "Parking", "Sports Court"],
  phone: "+91 80 2846 8888",
  website: "https://www.angsana.com/india/bengaluru",
  coordinates: { lat: 13.1901, lng: 77.5852 },
  city: "Bangalore",
  state: "Karnataka",
  activities: ["Ayurvedic Massage", "Clay Pot Painting", "Yoga Session", "Billiards"],
  rooms: [
    { type: "Executive Resort Room", price: "₹9,000", amenities: ["King Bed", "Garden View", "WiFi"] },
    { type: "Two Bedroom Villa", price: "₹22,000", amenities: ["Private Kitchen", "Living Room", "Bathtub"] }
  ]
});
placesList.push({
  id: "p-blr-4",
  name: "Bangalore Palace",
  type: "attraction",
  subtypes: ["Historical Sites", "Famous Landmarks", "Sightseeing"],
  rating: 4.5,
  reviewCount: 3500,
  priceLevel: 2,
  priceRange: "₹230 (Entry Ticket)",
  address: "Vasanth Nagar, Bangalore 560052",
  description: "A grand palace built in 1887 by the Maharaja of Mysore, featuring Tudor-style architecture inspired by Windsor Castle. Explore the beautiful wood carvings, historic royal paintings, and lush gardens.",
  photos: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600", "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600"],
  facilities: ["Parking", "Audio Guides", "Camera Allowed", "Historical Museum"],
  phone: "+91 80 2235 1234",
  website: "https://www.karnatakatourism.org",
  coordinates: { lat: 12.9988, lng: 77.5921 },
  city: "Bangalore",
  state: "Karnataka"
});
placesList.push({
  id: "p-blr-5",
  name: "Visvesvaraya Industrial Museum",
  type: "attraction",
  subtypes: ["Museums", "Kids Friendly", "Science Exhibits"],
  rating: 4.6,
  reviewCount: 2900,
  priceLevel: 1,
  priceRange: "₹80 Entry",
  address: "Kasturba Road, Cubbon Park, Bangalore 560001",
  description: "An interactive science and industrial museum in the heart of Bangalore. Features multiple floors of hands-on mechanical, electronics, space, and biotechnology exhibits, including a life-size animated replica of a Spinosaurus dinosaur.",
  photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600"],
  facilities: ["Parking", "Science Shows", "Dinosaur Enclave", "Planetarium Dome"],
  phone: "+91 80 2286 6200",
  website: "https://www.vismuseum.gov.in",
  coordinates: { lat: 12.9751, lng: 77.5963 },
  city: "Bangalore",
  state: "Karnataka"
});
placesList.push({
  id: "p-blr-6",
  name: "Sri Radha Krishna ISKCON Temple",
  type: "attraction",
  subtypes: ["Temples", "Famous Landmarks", "Cultural Centers"],
  rating: 4.7,
  reviewCount: 4500,
  priceLevel: 1,
  priceRange: "Free Entry",
  address: "Hare Krishna Hill, Rajajinagar, Bangalore 560010",
  description: "One of the largest ISKCON temple complexes in the world. Features a grand 17-meter gold-plated flag post, gorgeous marble deity shrines, lush water fountains, and a massive cultural complex promoting Vedic heritage.",
  photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"],
  facilities: ["Parking", "Locker Room", "Vegetarian Food Court", "Holy Prasadam", "Library"],
  phone: "+91 80 2347 1950",
  website: "https://www.iskconbangalore.org",
  coordinates: { lat: 13.0094, lng: 77.5512 },
  city: "Bangalore",
  state: "Karnataka"
});

// --- JAIPUR PLACES ---
placesList.push({
  id: "p-jaipur-1",
  name: "The Raj Palace Hotel",
  type: "hotel",
  subtypes: ["Luxury Hotels", "Heritage Stays", "Palace Stays"],
  rating: 4.9,
  reviewCount: 950,
  priceLevel: 4,
  priceRange: "₹35,000 - ₹75,000 per night",
  address: "Jorawar Singh Gate, Amer Road, Jaipur 302002",
  description: "A breathtaking royal heritage palace built in 1727. Resplendent with antique chandeliers, gold-leafed pillars, royal museums, and sprawling courtyards, giving guests the feeling of true Maharaja royalty.",
  photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"],
  facilities: ["WiFi", "Swimming Pool", "Parking", "AC", "Breakfast", "Royal Museum", "Spa", "Shuttle Service"],
  phone: "+91 141 263 4077",
  website: "http://www.rajpalace.com",
  coordinates: { lat: 26.9388, lng: 75.8310 },
  city: "Jaipur",
  state: "Rajasthan",
  rooms: [
    { type: "Heritage Room", price: "₹38,000", amenities: ["Royal Decor", "Antique Canopy Bed", "Garden View"] },
    { type: "The Maharaja Suite", price: "₹1,20,000", amenities: ["Private Elevator", "Gold Plated Baths", "Private Dining Room"] }
  ]
});
placesList.push({
  id: "p-jaipur-2",
  name: "Chokhi Dhani Resort",
  type: "resort",
  subtypes: ["Resorts", "Ethnic Village", "Cultural Resorts"],
  rating: 4.6,
  reviewCount: 3800,
  priceLevel: 3,
  priceRange: "₹5,000 - ₹12,000 per night",
  address: "12 Mile, Tonk Road, Jaipur 303905",
  description: "A 5-star ethnic village resort that brings the rich culture of Rajasthan alive. Features traditional mud cottages, puppet shows, camel rides, folk dancing, and an incredible open-air traditional Rajasthani feast.",
  photos: ["https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "Cultural Feasts", "Parking"],
  phone: "+91 141 508 5555",
  website: "https://www.chokhidhani.com",
  coordinates: { lat: 26.7663, lng: 75.8362 },
  city: "Jaipur",
  state: "Rajasthan",
  activities: ["Camel Riding", "Folk Dance Show", "Rajasthani Pottery", "Puppet Theater"],
  rooms: [
    { type: "Ethnic Cottage", price: "₹6,000", amenities: ["Mud Wall Finish", "AC", "WiFi"] },
    { type: "Haveli Suite", price: "₹14,000", amenities: ["Traditional Carvings", "Royal Bed", "AC"] }
  ]
});
placesList.push({
  id: "p-jaipur-3",
  name: "Hawa Mahal",
  type: "attraction",
  subtypes: ["Historical Sites", "Famous Landmarks", "Sightseeing"],
  rating: 4.7,
  reviewCount: 5900,
  priceLevel: 1,
  priceRange: "₹50 (Entry Ticket)",
  address: "Hawa Mahal Road, Johari Bazar, Jaipur 302002",
  description: "Built in 1799, this iconic pink sandstone palace features 953 small windows (jharokhas) decorated with intricate latticework, designed to allow royal ladies to watch street festivals without being seen.",
  photos: ["https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"],
  facilities: ["Camera Allowed", "Guided Tours", "Rooftop Cafes Nearby"],
  phone: "+91 141 223 1234",
  website: "http://www.tourism.rajasthan.gov.in",
  coordinates: { lat: 26.9239, lng: 75.8267 },
  city: "Jaipur",
  state: "Rajasthan"
});
placesList.push({
  id: "p-jaipur-4",
  name: "Albert Hall Museum",
  type: "attraction",
  subtypes: ["Museums", "Historical Sites", "Art Galleries"],
  rating: 4.6,
  reviewCount: 2800,
  priceLevel: 1,
  priceRange: "₹40 Entry",
  address: "Ram Niwas Bagh, Adarsh Nagar, Jaipur 302004",
  description: "The oldest museum of Rajasthan, housed in a stunning Indo-Saracenic royal building. Lit up beautifully in vibrant colors at night, it contains an extensive collection of royal ivory carvings, traditional carpets, arms, and a historic Egyptian mummy.",
  photos: ["https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"],
  facilities: ["Parking", "Night Lighting", "Guided Tours", "Camera Allowed"],
  phone: "+91 141 257 0098",
  website: "http://www.alberthalljaipur.gov.in",
  coordinates: { lat: 26.9116, lng: 75.8194 },
  city: "Jaipur",
  state: "Rajasthan"
});
placesList.push({
  id: "p-jaipur-5",
  name: "Birla Mandir Jaipur",
  type: "attraction",
  subtypes: ["Temples", "Historical Sites", "Famous Landmarks"],
  rating: 4.7,
  reviewCount: 2100,
  priceLevel: 1,
  priceRange: "Free Entry",
  address: "Jawahar Lal Nehru Marg, Tilak Nagar, Jaipur 302004",
  description: "A landmark Hindu temple carved out of high-grade white marble, set against the backdrop of the hilly Moti Dungri Fort. Adorned with beautiful mythological relief carvings, stained-glass windows, and lush green gardens.",
  photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600"],
  facilities: ["Parking", "Gardens Walkway", "Holy Prasadam", "Kids Friendly"],
  phone: "+91 141 262 0987",
  coordinates: { lat: 26.8920, lng: 75.8155 },
  city: "Jaipur",
  state: "Rajasthan"
});

// --- DELHI PLACES ---
placesList.push({
  id: "p-del-1",
  name: "The Oberoi New Delhi",
  type: "hotel",
  subtypes: ["Luxury Hotels", "Business Hotels"],
  rating: 4.9,
  reviewCount: 1400,
  priceLevel: 4,
  priceRange: "₹18,000 - ₹35,000 per night",
  address: "Dr. Zakir Hussain Marg, New Delhi 110003",
  description: "Overlooking the Delhi Golf Club and Humayun's Tomb, this legendary luxury hotel is a sanctuary of contemporary design, clean air filters, and exceptional fine dining restaurants.",
  photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "Gym", "Golf Club View", "Bar"],
  phone: "+91 11 2436 3030",
  website: "https://www.oberoihotels.com/hotels-in-delhi/",
  coordinates: { lat: 28.6015, lng: 77.2389 },
  city: "Delhi",
  state: "Delhi",
  rooms: [
    { type: "Deluxe Courtyard Room", price: "₹20,000", amenities: ["King Bed", "Mini Bar", "AC"] },
    { type: "Luxury Golf View Suite", price: "₹45,000", amenities: ["Golf Course View", "Living Room", "King Bed"] }
  ]
});
placesList.push({
  id: "p-del-2",
  name: "Qutub Minar",
  type: "attraction",
  subtypes: ["Historical Sites", "Famous Landmarks", "UNESCO Heritage"],
  rating: 4.6,
  reviewCount: 5200,
  priceLevel: 1,
  priceRange: "₹40 Entry",
  address: "Mehrauli, New Delhi 110030",
  description: "A UNESCO World Heritage Site, this 73-meter tall victory tower was built in 1193. Made of red sandstone and marble, it is surrounded by ancient ruins and the famous rust-resistant Iron Pillar of Delhi.",
  photos: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"],
  facilities: ["Parking", "Guided Tours", "Camera Allowed", "Kids Friendly"],
  phone: "+91 11 2336 5432",
  website: "http://www.delhitourism.gov.in",
  coordinates: { lat: 28.5244, lng: 77.1855 },
  city: "Delhi",
  state: "Delhi"
});
placesList.push({
  id: "p-del-3",
  name: "National Museum",
  type: "attraction",
  subtypes: ["Museums", "Historical Sites", "Art Galleries"],
  rating: 4.7,
  reviewCount: 1950,
  priceLevel: 1,
  priceRange: "₹20 Entry",
  address: "Janpath, Connaught Place, New Delhi 110011",
  description: "One of the premier museums in India, holding over 200,000 works of art spanning 5,000 years of cultural history. Features world-renowned Harappan civilization excavations, rare Buddhist relics, and exquisite miniature paintings.",
  photos: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"],
  facilities: ["Parking", "Audio Guides", "Library", "Cafeteria", "Souvenir Shop"],
  phone: "+91 11 2301 9224",
  website: "http://www.nationalmuseumindia.gov.in",
  coordinates: { lat: 28.6118, lng: 77.2192 },
  city: "Delhi",
  state: "Delhi"
});
placesList.push({
  id: "p-del-4",
  name: "Lotus Temple",
  type: "attraction",
  subtypes: ["Temples", "Famous Landmarks", "Sightseeing"],
  rating: 4.6,
  reviewCount: 4800,
  priceLevel: 1,
  priceRange: "Free Entry",
  address: "Lotus Temple Road, Kalkaji, New Delhi 110019",
  description: "A spectacular Baháʼí House of Worship notable for its flowerlike shape composed of 27 free-standing marble petals. Surrounded by nine ponds and pristine gardens, it serves as a sanctuary for silent prayer and meditation.",
  photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600"],
  facilities: ["Gardens", "Visitor Center", "Shoe Keeping", "Wheelchair Accessible"],
  phone: "+91 11 2644 4078",
  website: "http://www.bahaihouseofworship.in",
  coordinates: { lat: 28.5535, lng: 77.2588 },
  city: "Delhi",
  state: "Delhi"
});

// --- MUMBAI PLACES ---
placesList.push({
  id: "p-mum-1",
  name: "The Taj Mahal Palace",
  type: "hotel",
  subtypes: ["Luxury Hotels", "Heritage Stays", "Landmarks"],
  rating: 4.9,
  reviewCount: 3500,
  priceLevel: 4,
  priceRange: "₹28,000 - ₹85,000 per night",
  address: "Apollo Bunder, Colaba, Mumbai 400001",
  description: "An iconic heritage hotel built in 1903 overlooking the Gateway of India and the Arabian Sea. Renowned for its historic grandeur, royal service, and list of distinguished international guests.",
  photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"],
  facilities: ["WiFi", "AC", "Swimming Pool", "Spa", "Harbor View", "Valet Parking", "Fine Dining"],
  phone: "+91 22 6665 3366",
  website: "https://www.tajhotels.com/en-in/hotels/the-taj-mahal-palace-mumbai/",
  coordinates: { lat: 18.9217, lng: 72.8330 },
  city: "Mumbai",
  state: "Maharashtra",
  rooms: [
    { type: "Luxury Grande City View", price: "₹30,000", amenities: ["King Bed", "High Ceilings", "WiFi"] },
    { type: "Taj Club Sea View", price: "₹55,000", amenities: ["Sea View", "Club Lounge Access", "Butler Service"] }
  ]
});
placesList.push({
  id: "p-mum-2",
  name: "Gateway of India",
  type: "attraction",
  subtypes: ["Famous Landmarks", "Historical Sites", "Sightseeing"],
  rating: 4.6,
  reviewCount: 7800,
  priceLevel: 1,
  priceRange: "Free Access",
  address: "Apollo Bunder, Colaba, Mumbai 400001",
  description: "An iconic arch monument built in 1911 to commemorate the landing of King George V and Queen Mary. A hub of local activity and the departure point for boats heading to Elephanta Caves.",
  photos: ["https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"],
  facilities: ["Ferry Access", "Guided Tours Nearby", "Camera Allowed"],
  phone: "+91 22 2202 3567",
  website: "https://www.maharashtratourism.gov.in",
  coordinates: { lat: 18.9220, lng: 72.8347 },
  city: "Mumbai",
  state: "Maharashtra"
});
placesList.push({
  id: "p-mum-3",
  name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
  type: "attraction",
  subtypes: ["Museums", "Historical Sites", "Art Galleries"],
  rating: 4.8,
  reviewCount: 2200,
  priceLevel: 1,
  priceRange: "₹150 Entry",
  address: "159-161 Mahatma Gandhi Road, Fort, Mumbai 400023",
  description: "Formerly the Prince of Wales Museum, this magnificent Indo-Saracenic heritage building houses 50,000 artifacts from ancient India, including Indus Valley relics, Parsi collections, and a gorgeous natural history section.",
  photos: ["https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600"],
  facilities: ["Parking", "Audio Guides", "Gift Shop", "Cafeteria", "Lush Gardens"],
  phone: "+91 22 2284 5543",
  website: "https://www.csmvs.in",
  coordinates: { lat: 18.9269, lng: 72.8327 },
  city: "Mumbai",
  state: "Maharashtra"
});
placesList.push({
  id: "p-mum-4",
  name: "Siddhivinayak Temple",
  type: "attraction",
  subtypes: ["Temples", "Historical Sites", "Famous Landmarks"],
  rating: 4.7,
  reviewCount: 6100,
  priceLevel: 1,
  priceRange: "Free Entry",
  address: "SK Bole Road, Prabhadevi, Mumbai 400028",
  description: "A famous historic Hindu temple dedicated to Lord Ganesha, built in 1801. Visited by millions of devotees daily, featuring a gold-plated sanctum ceiling and a beautiful Ganesha idol carved out of a single black stone.",
  photos: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600"],
  facilities: ["Parking", "Shoe Cabinets", "Security Check", "Holy Prasadam Shops"],
  phone: "+91 22 2422 4438",
  website: "http://www.siddhivinayak.org",
  coordinates: { lat: 19.0169, lng: 72.8300 },
  city: "Mumbai",
  state: "Maharashtra"
});

// Copy all remaining places not explicitly defined
dbData.places = placesList;

// Write DB back
fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
console.log('Seeded database successfully with ' + dbData.places.length + ' premium curated places.');
