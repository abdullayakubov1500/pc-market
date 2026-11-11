import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PC Market database...');

  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.game.deleteMany();
  await prisma.category.deleteMany();

  // 1. Categories
  const categories = [
    { id: 'cpu', nameRu: 'Процессоры', nameUz: 'Protsessorlar (CPU)', icon: 'Cpu', order: 1 },
    { id: 'motherboard', nameRu: 'Материнские платы', nameUz: 'Ona platalar (Motherboard)', icon: 'CircuitBoard', order: 2 },
    { id: 'ram', nameRu: 'Оперативная память', nameUz: 'Tezkor xotira (RAM)', icon: 'Layers', order: 3 },
    { id: 'gpu', nameRu: 'Видеокарты', nameUz: 'Videokartalar (GPU)', icon: 'Monitor', order: 4 },
    { id: 'cooler', nameRu: 'Охлаждение процессора', nameUz: 'Sovutish tizimlari', icon: 'Fan', order: 5 },
    { id: 'storage', nameRu: 'Накопители (SSD/HDD)', nameUz: 'Xotira disklari (SSD/HDD)', icon: 'HardDrive', order: 6 },
    { id: 'psu', nameRu: 'Блоки питания', nameUz: 'Quvvat bloklari (PSU)', icon: 'Zap', order: 7 },
    { id: 'case', nameRu: 'Корпуса', nameUz: 'Kompyuter korpuslari', icon: 'Box', order: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // 2. Products
  const products = [
    // --- CPUs ---
    {
      categoryId: 'cpu',
      nameRu: 'Процессор Intel Core i5-12400F OEM',
      nameUz: 'Intel Core i5-12400F OEM protsessori',
      brand: 'Intel',
      model: 'Core i5-12400F',
      priceUzs: 1450000,
      image: '/images/products/i5-12400f.png',
      socket: 'LGA1700',
      ramType: 'DDR4/DDR5',
      tdp: 65,
      cpuScore: 2100,
      descriptionRu: '6 ядер, 12 потоков, базовая 2.5 ГГц, Turbo до 4.4 ГГц. Народный хит для бюджетного и среднего гейминга.',
      descriptionUz: '6 ta yadro, 12 ta oqim, 4.4 GHz Turbo. Byudjet va o\'rta darajadagi o\'yin kompyuterlari uchun ajoyib tanlov.'
    },
    {
      categoryId: 'cpu',
      nameRu: 'Процессор Intel Core i5-13600KF Box',
      nameUz: 'Intel Core i5-13600KF Box protsessori',
      brand: 'Intel',
      model: 'Core i5-13600KF',
      priceUzs: 3400000,
      image: '/images/products/i5-13600kf.png',
      socket: 'LGA1700',
      ramType: 'DDR4/DDR5',
      tdp: 125,
      cpuScore: 3200,
      descriptionRu: '14 ядер (6P + 8E), 20 потоков, Turbo до 5.1 ГГц. Отличная производительность в играх и рабочих задачах.',
      descriptionUz: '14 yadro (6P + 8E), 20 oqim, 5.1 GHz gacha. O\'yinlar va montaj ishlari uchun yuqori quvvat.'
    },
    {
      categoryId: 'cpu',
      nameRu: 'Процессор Intel Core i7-14700K Box',
      nameUz: 'Intel Core i7-14700K Box protsessori',
      brand: 'Intel',
      model: 'Core i7-14700K',
      priceUzs: 5100000,
      image: '/images/products/i7-14700k.png',
      socket: 'LGA1700',
      ramType: 'DDR4/DDR5',
      tdp: 125,
      cpuScore: 4000,
      descriptionRu: '20 ядер (8P + 12E), 28 потоков, Turbo до 5.6 ГГц. Мощнейший процессор для хай-энд сборок.',
      descriptionUz: '20 yadro, 28 oqim, 5.6 GHz gacha. Eng yuqori grafikadagi o\'yinlar va og\'ir dasturlar uchun.'
    },
    {
      categoryId: 'cpu',
      nameRu: 'Процессор AMD Ryzen 5 5600 Tray',
      nameUz: 'AMD Ryzen 5 5600 Tray protsessori',
      brand: 'AMD',
      model: 'Ryzen 5 5600',
      priceUzs: 1350000,
      image: '/images/products/r5-5600.png',
      socket: 'AM4',
      ramType: 'DDR4',
      tdp: 65,
      cpuScore: 2050,
      descriptionRu: '6 ядер, 12 потоков, сокет AM4, кэш L3 32 МБ. Бестселлер для доступных игровых систем.',
      descriptionUz: '6 yadro, 12 oqim, AM4 soket, 32MB L3 kesh. Hamyonbop o\'yin kompyuterlari qiroli.'
    },
    {
      categoryId: 'cpu',
      nameRu: 'Процессор AMD Ryzen 5 7500F Tray',
      nameUz: 'AMD Ryzen 5 7500F Tray protsessori',
      brand: 'AMD',
      model: 'Ryzen 5 7500F',
      priceUzs: 1950000,
      image: '/images/products/r5-7500f.png',
      socket: 'AM5',
      ramType: 'DDR5',
      tdp: 65,
      cpuScore: 2850,
      descriptionRu: '6 ядер Zen 4, 12 потоков, сокет AM5, память DDR5. Лучший вход в современную платформу AM5.',
      descriptionUz: '6 yadro Zen 4, 12 oqim, AM5 soket, DDR5 xotira. AM5 platformasiga eng qulay o\'tish yo\'li.'
    },
    {
      categoryId: 'cpu',
      nameRu: 'Процессор AMD Ryzen 7 7800X3D Box',
      nameUz: 'AMD Ryzen 7 7800X3D Box protsessori',
      brand: 'AMD',
      model: 'Ryzen 7 7800X3D',
      priceUzs: 5400000,
      image: '/images/products/r7-7800x3d.png',
      socket: 'AM5',
      ramType: 'DDR5',
      tdp: 120,
      cpuScore: 4400,
      descriptionRu: '8 ядер, 16 потоков с технологией 3D V-Cache (96 МБ L3). Абсолютный лидер игровых тестов в мире.',
      descriptionUz: '8 yadro, 16 oqim, 3D V-Cache texnologiyasi bilan. Dunyodagi eng kuchli o\'yin protsessorlaridan biri.'
    },
    {
      categoryId: 'cpu',
      nameRu: 'Процессор AMD Ryzen 7 9800X3D Box',
      nameUz: 'AMD Ryzen 7 9800X3D Box protsessori',
      brand: 'AMD',
      model: 'Ryzen 7 9800X3D',
      priceUzs: 7100000,
      image: '/images/products/r7-9800x3d.png',
      socket: 'AM5',
      ramType: 'DDR5',
      tdp: 120,
      cpuScore: 4950,
      descriptionRu: 'Флагман архитектуры Zen 5 с 2-м поколением 3D V-Cache. Бескомпромиссный FPS в любых играх.',
      descriptionUz: 'Zen 5 arxitekturasi va yangi avlod 3D V-Cache. Har qanday o\'yinda maksimal FPS.'
    },

    // --- Motherboards ---
    {
      categoryId: 'motherboard',
      nameRu: 'Материнская плата ASUS PRIME B760M-K D4',
      nameUz: 'ASUS PRIME B760M-K D4 ona platasi',
      brand: 'ASUS',
      model: 'PRIME B760M-K D4',
      priceUzs: 1300000,
      image: '/images/products/b760m-k.png',
      socket: 'LGA1700',
      ramType: 'DDR4',
      ramSlots: 2,
      formFactor: 'Micro-ATX',
      descriptionRu: 'Чипсет B760, поддержка 12-14 поколений Intel, 2x M.2 PCIe 4.0, 2 слота DDR4 до 5333 МГц.',
      descriptionUz: 'Intel 12-14 avlodlar uchun B760 chipset, 2 ta M.2 sloti, DDR4 xotira.'
    },
    {
      categoryId: 'motherboard',
      nameRu: 'Материнская плата MSI PRO B760-P WIFI DDR5',
      nameUz: 'MSI PRO B760-P WIFI DDR5 ona platasi',
      brand: 'MSI',
      model: 'PRO B760-P WIFI',
      priceUzs: 2150000,
      image: '/images/products/b760-p.png',
      socket: 'LGA1700',
      ramType: 'DDR5',
      ramSlots: 4,
      formFactor: 'ATX',
      descriptionRu: 'Полноразмерная ATX плата, 4 слота DDR5, встроенный Wi-Fi 6E и Bluetooth, мощная подсистема питания.',
      descriptionUz: 'ATX formati, 4 ta DDR5 slot, o\'rnatilgan Wi-Fi 6E va Bluetooth, ishonchli quvvat tizimi.'
    },
    {
      categoryId: 'motherboard',
      nameRu: 'Материнская плата ASUS ROG STRIX Z790-F GAMING WIFI',
      nameUz: 'ASUS ROG STRIX Z790-F GAMING WIFI ona platasi',
      brand: 'ASUS',
      model: 'ROG STRIX Z790-F',
      priceUzs: 4900000,
      image: '/images/products/z790-f.png',
      socket: 'LGA1700',
      ramType: 'DDR5',
      ramSlots: 4,
      formFactor: 'ATX',
      descriptionRu: 'Премиальная плата на флагманском чипсете Z790. 16+1 фаз питания, PCIe 5.0, Wi-Fi 6E, 4x M.2 с радиаторами.',
      descriptionUz: 'Flagman Z790 chipseti. Overkloking imkoniyati, PCIe 5.0, Wi-Fi 6E va premium sovutish tizimi.'
    },
    {
      categoryId: 'motherboard',
      nameRu: 'Материнская плата Gigabyte B550M DS3H',
      nameUz: 'Gigabyte B550M DS3H ona platasi',
      brand: 'Gigabyte',
      model: 'B550M DS3H',
      priceUzs: 1100000,
      image: '/images/products/b550m-ds3h.png',
      socket: 'AM4',
      ramType: 'DDR4',
      ramSlots: 4,
      formFactor: 'Micro-ATX',
      descriptionRu: 'Надежная плата для процессоров AMD Ryzen 3000/5000 серии. 4 слота DDR4, 2x M.2 NVMe, PCIe 4.0.',
      descriptionUz: 'AMD Ryzen 3000/5000 protsessorlari uchun qulay va sifatli Micro-ATX plata. 4 ta DDR4 slot.'
    },
    {
      categoryId: 'motherboard',
      nameRu: 'Материнская плата ASRock B650M-HDV/M.2',
      nameUz: 'ASRock B650M-HDV/M.2 ona platasi',
      brand: 'ASRock',
      model: 'B650M-HDV/M.2',
      priceUzs: 1500000,
      image: '/images/products/b650m-hdv.png',
      socket: 'AM5',
      ramType: 'DDR5',
      ramSlots: 2,
      formFactor: 'Micro-ATX',
      descriptionRu: 'Отличная бюджетная плата для Ryzen 7000/9000 на сокете AM5. 8+2+1 фаз питания, PCIe 5.0 M.2.',
      descriptionUz: 'Ryzen 7000/9000 protsessorlari uchun AM5 soketli ajoyib arzon plata. Kuchli VRM tizimi.'
    },
    {
      categoryId: 'motherboard',
      nameRu: 'Материнская плата ASUS TUF GAMING B650-PLUS WIFI',
      nameUz: 'ASUS TUF GAMING B650-PLUS WIFI ona platasi',
      brand: 'ASUS',
      model: 'TUF GAMING B650-PLUS WIFI',
      priceUzs: 2650000,
      image: '/images/products/tuf-b650.png',
      socket: 'AM5',
      ramType: 'DDR5',
      ramSlots: 4,
      formFactor: 'ATX',
      descriptionRu: 'Геймерская плата стандарта TUF Military. Wi-Fi 6, 2.5G LAN, 3 слота M.2, поддержка разгона DDR5.',
      descriptionUz: 'TUF standartidagi o\'yin platasi. Wi-Fi 6, 2.5G LAN, 3 ta M.2, DDR5 qo\'llab-quvvatlash.'
    },

    // --- RAM ---
    {
      categoryId: 'ram',
      nameRu: 'ОЗУ Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz',
      nameUz: 'Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz RAM',
      brand: 'Kingston',
      model: 'FURY Beast DDR4 16GB',
      priceUzs: 480000,
      image: '/images/products/ram-ddr4-16.png',
      ramType: 'DDR4',
      capacityGb: 16,
      speedMhz: 3200,
      descriptionRu: 'Комплект 2x8GB DDR4 3200MHz CL16. Идеальный стандарт для бюджетных игровых ПК.',
      descriptionUz: '2x8GB DDR4 3200MHz CL16 to\'plami. Zamonaviy hamyonbop o\'yinlar uchun zaruriy hajm.'
    },
    {
      categoryId: 'ram',
      nameRu: 'ОЗУ Kingston FURY Renegade 32GB (2x16GB) DDR4 3600MHz',
      nameUz: 'Kingston FURY Renegade 32GB (2x16GB) DDR4 3600MHz RAM',
      brand: 'Kingston',
      model: 'FURY Renegade DDR4 32GB',
      priceUzs: 950000,
      image: '/images/products/ram-ddr4-32.png',
      ramType: 'DDR4',
      capacityGb: 32,
      speedMhz: 3600,
      descriptionRu: 'Скоростной комплект 32 ГБ DDR4 3600MHz с низкими таймингами CL16 для максимального FPS.',
      descriptionUz: 'Tezkor 32GB DDR4 3600MHz to\'plami, past kechikish (CL16) bilan yuqori FPS beradi.'
    },
    {
      categoryId: 'ram',
      nameRu: 'ОЗУ Kingston FURY Beast Black 32GB (2x16GB) DDR5 6000MHz',
      nameUz: 'Kingston FURY Beast Black 32GB (2x16GB) DDR5 6000MHz RAM',
      brand: 'Kingston',
      model: 'FURY Beast DDR5 32GB',
      priceUzs: 1550000,
      image: '/images/products/ram-ddr5-32.png',
      ramType: 'DDR5',
      capacityGb: 32,
      speedMhz: 6000,
      descriptionRu: 'Оптимальный стандарт для AM5 и LGA1700: DDR5-6000 CL30 с поддержкой профилей AMD EXPO и Intel XMP 3.0.',
      descriptionUz: 'AM5 va LGA1700 uchun ideal tanlov: DDR5-6000 CL30, AMD EXPO va Intel XMP 3.0 qo\'llab-quvvatlaydi.'
    },
    {
      categoryId: 'ram',
      nameRu: 'ОЗУ Corsair Vengeance RGB 32GB (2x16GB) DDR5 6400MHz',
      nameUz: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6400MHz RAM',
      brand: 'Corsair',
      model: 'Vengeance RGB DDR5 32GB',
      priceUzs: 1850000,
      image: '/images/products/ram-ddr5-rgb-32.png',
      ramType: 'DDR5',
      capacityGb: 32,
      speedMhz: 6400,
      descriptionRu: 'Стильная оперативная память с яркой настраиваемой RGB подсветкой и высокой частотой 6400 МГц.',
      descriptionUz: 'Chiroyli RGB yoritgichli va 6400MHz yuqori tezlikka ega zamonaviy DDR5 tezkor xotirasi.'
    },
    {
      categoryId: 'ram',
      nameRu: 'ОЗУ G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6000MHz',
      nameUz: 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6000MHz RAM',
      brand: 'G.Skill',
      model: 'Trident Z5 RGB 64GB',
      priceUzs: 3100000,
      image: '/images/products/ram-ddr5-64.png',
      ramType: 'DDR5',
      capacityGb: 64,
      speedMhz: 6000,
      descriptionRu: 'Топовый набор 64 ГБ для стриминга, тяжелого 3D рендера и игр на ультра-настройках в 4K.',
      descriptionUz: 'Strim, 3D modellashtirish va 4K o\'yinlar uchun eng yuqori darajadagi 64GB DDR5 to\'plam.'
    },

    // --- GPUs ---
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта Palit GeForce RTX 3060 Dual 12GB',
      nameUz: 'Palit GeForce RTX 3060 Dual 12GB videokartasi',
      brand: 'Palit',
      model: 'GeForce RTX 3060 12GB',
      priceUzs: 3600000,
      image: '/images/products/rtx-3060.png',
      gpuLength: 245,
      tdp: 170,
      gpuScore: 8800,
      capacityGb: 12,
      descriptionRu: '12 ГБ GDDR6 памяти, поддержка DLSS и трассировки лучей. Хит для игр в 1080p на высоких настройках.',
      descriptionUz: '12GB GDDR6 xotira, DLSS va Ray Tracing. 1080p formatidagi barcha o\'yinlar uchun juda mashhur karta.'
    },
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта MSI GeForce RTX 4060 VENTUS 2X 8GB',
      nameUz: 'MSI GeForce RTX 4060 VENTUS 2X 8GB videokartasi',
      brand: 'MSI',
      model: 'GeForce RTX 4060 8GB',
      priceUzs: 4100000,
      image: '/images/products/rtx-4060.png',
      gpuLength: 199,
      tdp: 115,
      gpuScore: 10800,
      capacityGb: 8,
      descriptionRu: 'Архитектура Ada Lovelace, поддержка генерации кадров DLSS 3.5, сверхнизкое энергопотребление 115 Вт.',
      descriptionUz: 'Ada Lovelace arxitekturasi, DLSS 3.5 freym generatsiyasi, kam quvvat iste\'moli (115W).'
    },
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта ASUS Dual GeForce RTX 4060 Ti OC 8GB',
      nameUz: 'ASUS Dual GeForce RTX 4060 Ti OC 8GB videokartasi',
      brand: 'ASUS',
      model: 'GeForce RTX 4060 Ti 8GB',
      priceUzs: 5300000,
      image: '/images/products/rtx-4060ti.png',
      gpuLength: 227,
      tdp: 160,
      gpuScore: 13600,
      capacityGb: 8,
      descriptionRu: 'Повышенные частоты ядра, тихое охлаждение Axial-tech, уверенный FPS в 1080p/1440p с DLSS 3.',
      descriptionUz: 'Zavoddan overclock qilingan, sokin Axial-tech sovutgich, 1080p/1440p formatda barqaror yuqori FPS.'
    },
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта Gigabyte GeForce RTX 4070 SUPER WINDFORCE OC 12GB',
      nameUz: 'Gigabyte GeForce RTX 4070 SUPER WINDFORCE OC 12GB videokartasi',
      brand: 'Gigabyte',
      model: 'GeForce RTX 4070 Super 12GB',
      priceUzs: 8200000,
      image: '/images/products/rtx-4070super.png',
      gpuLength: 261,
      tdp: 220,
      gpuScore: 21500,
      capacityGb: 12,
      descriptionRu: '7168 ядер CUDA, 12 ГБ GDDR6X. Идеальная видеокарта для игр в 2K (1440p) на ультра-настройках с трассировкой лучей.',
      descriptionUz: '7168 ta CUDA yadrolari, 12GB GDDR6X. 2K (1440p) formatida barcha og\'ir o\'yinlarni ultra grafikada o\'ynash uchun ideal.'
    },
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB',
      nameUz: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB videokartasi',
      brand: 'ASUS',
      model: 'GeForce RTX 4070 Ti Super 16GB',
      priceUzs: 10900000,
      image: '/images/products/rtx-4070tisuper.png',
      gpuLength: 305,
      tdp: 285,
      gpuScore: 24800,
      capacityGb: 16,
      descriptionRu: '16 ГБ шина 256-бит, массивный металлический радиатор TUF. Готова к 4K геймингу и требовательным текстурам.',
      descriptionUz: '16GB 256-bit shina, baquvvat TUF alyuminiy radiatori. 4K o\'yinlar va yuqori grafika uchun tayyorlangan.'
    },
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта MSI GeForce RTX 4080 SUPER 16G GAMING X SLIM',
      nameUz: 'MSI GeForce RTX 4080 SUPER 16G GAMING X SLIM videokartasi',
      brand: 'MSI',
      model: 'GeForce RTX 4080 Super 16GB',
      priceUzs: 14500000,
      image: '/images/products/rtx-4080super.png',
      gpuLength: 322,
      tdp: 320,
      gpuScore: 29500,
      capacityGb: 16,
      descriptionRu: 'Второй по мощности графический ускоритель в мире. Бескомпромиссный гейминг в 4K Ultra с Path Tracing.',
      descriptionUz: 'Dunyodagi eng kuchli grafik tezlatgichlardan biri. 4K Ultra o\'yinlar va Path Tracing uchun maksimal quvvat.'
    },
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта ASUS ROG Strix GeForce RTX 4090 24GB OC Edition',
      nameUz: 'ASUS ROG Strix GeForce RTX 4090 24GB OC Edition videokartasi',
      brand: 'ASUS',
      model: 'GeForce RTX 4090 24GB',
      priceUzs: 25800000,
      image: '/images/products/rtx-4090.png',
      gpuLength: 357,
      tdp: 450,
      gpuScore: 38000,
      capacityGb: 24,
      descriptionRu: 'Король игровой индустрии: 24 ГБ VRAM, 16384 ядра CUDA, колоссальная производительность в 4K и AI.',
      descriptionUz: 'O\'yin olamining mutlaq qiroli: 24GB VRAM, 16384 CUDA yadrosi, 4K va sun\'iy intellekt hisoblashlarida tengsiz.'
    },
    {
      categoryId: 'gpu',
      nameRu: 'Видеокарта Sapphire PULSE AMD Radeon RX 7800 XT 16GB',
      nameUz: 'Sapphire PULSE AMD Radeon RX 7800 XT 16GB videokartasi',
      brand: 'Sapphire',
      model: 'Radeon RX 7800 XT 16GB',
      priceUzs: 7400000,
      image: '/images/products/rx-7800xt.png',
      gpuLength: 280,
      tdp: 263,
      gpuScore: 20200,
      capacityGb: 16,
      descriptionRu: '16 ГБ быстрой памяти, чиплетная архитектура RDNA 3, превосходное соотношение цены и FPS в 1440p.',
      descriptionUz: '16GB tezkor xotira, RDNA 3 arxitekturasi, 1440p formatda narx va unumdorlik bo\'yicha ajoyib mutanosiblik.'
    },

    // --- Coolers ---
    {
      categoryId: 'cooler',
      nameRu: 'Кулер для процессора DeepCool AG400 ARGB',
      nameUz: 'DeepCool AG400 ARGB protsessor sovutgichi',
      brand: 'DeepCool',
      model: 'AG400 ARGB',
      priceUzs: 290000,
      image: '/images/products/ag400.png',
      socket: 'LGA1700,AM4,AM5',
      coolerHeight: 150,
      coolerType: 'AIR',
      tdp: 220,
      descriptionRu: '4 тепловые трубки direct-touch, тихий 120мм вентилятор с ARGB подсветкой, рассеивает до 220 Вт.',
      descriptionUz: '4 ta mis issiqlik trubkasi, sokin 120mm ARGB ventilyator, 220W gacha quvvatni sovuta oladi.'
    },
    {
      categoryId: 'cooler',
      nameRu: 'Кулер для процессора DeepCool AK620 Digital',
      nameUz: 'DeepCool AK620 Digital protsessor sovutgichi',
      brand: 'DeepCool',
      model: 'AK620 Digital',
      priceUzs: 890000,
      image: '/images/products/ak620.png',
      socket: 'LGA1700,AM4,AM5',
      coolerHeight: 162,
      coolerType: 'AIR',
      tdp: 260,
      descriptionRu: 'Двухбашенный флагманский кулер со встроенным цифровым дисплеем температуры процессора и 6 трубками.',
      descriptionUz: 'Ikki qavatli flagman sovutgich, protsessor haroratini ko\'rsatuvchi raqamli displey va 6 ta trubka bilan.'
    },
    {
      categoryId: 'cooler',
      nameRu: 'Кулер для процессора Thermalright Peerless Assassin 120 SE',
      nameUz: 'Thermalright Peerless Assassin 120 SE protsessor sovutgichi',
      brand: 'Thermalright',
      model: 'Peerless Assassin 120 SE',
      priceUzs: 520000,
      image: '/images/products/peerless-assassin.png',
      socket: 'LGA1700,AM4,AM5',
      coolerHeight: 155,
      coolerType: 'AIR',
      tdp: 245,
      descriptionRu: 'Легендарный по эффективности двухсекционный кулер. 6 трубок, 2 тихих вентилятора TL-C12.',
      descriptionUz: 'O\'z toifasida eng samarali ikki qavatli sovutgich. 6 ta trubka va 2 ta sokin ventilyator.'
    },
    {
      categoryId: 'cooler',
      nameRu: 'Система водяного охлаждения DeepCool LS720 SE 360mm',
      nameUz: 'DeepCool LS720 SE 360mm suvli sovutish tizimi',
      brand: 'DeepCool',
      model: 'LS720 SE 360mm',
      priceUzs: 1450000,
      image: '/images/products/ls720.png',
      socket: 'LGA1700,AM4,AM5',
      coolerType: 'AIO_360',
      coolerHeight: 52,
      tdp: 300,
      descriptionRu: 'Трехсекционная СЖО 360мм с мощной помпой 4-го поколения и технологией защиты от протечек Anti-Leak.',
      descriptionUz: '360mm o\'lchamdagi 3 ta ventilyatorli suvli sovutish tizimi, 4-avlod kuchli pompa va Anti-Leak himoyasi.'
    },

    // --- Storage ---
    {
      categoryId: 'storage',
      nameRu: 'SSD M.2 NVMe Kingston NV2 1TB PCIe 4.0',
      nameUz: 'Kingston NV2 1TB PCIe 4.0 M.2 NVMe SSD',
      brand: 'Kingston',
      model: 'NV2 1TB',
      priceUzs: 780000,
      image: '/images/products/ssd-nv2-1tb.png',
      storageInterface: 'M.2 NVMe',
      capacityGb: 1000,
      descriptionRu: 'Быстрый NVMe накопитель со скоростью чтения до 3500 МБ/с. Прекрасный выбор под систему и игры.',
      descriptionUz: 'O\'qish tezligi 3500 MB/s gacha bo\'lgan tezkor NVMe xotira. Windows va o\'yinlar uchun a\'lo yechim.'
    },
    {
      categoryId: 'storage',
      nameRu: 'SSD M.2 NVMe Samsung 980 PRO 1TB PCIe 4.0',
      nameUz: 'Samsung 980 PRO 1TB PCIe 4.0 M.2 NVMe SSD',
      brand: 'Samsung',
      model: '980 PRO 1TB',
      priceUzs: 1300000,
      image: '/images/products/ssd-samsung-980pro.png',
      storageInterface: 'M.2 NVMe',
      capacityGb: 1000,
      descriptionRu: 'Скорость чтения до 7000 МБ/с, надежный контроллер Samsung Elpis и DRAM буфер для максимальной скорости.',
      descriptionUz: 'O\'qish tezligi 7000 MB/s gacha, o\'rnatilgan DRAM buferi bilan barqaror yuqori tezlik.'
    },
    {
      categoryId: 'storage',
      nameRu: 'SSD M.2 NVMe Samsung 990 PRO 2TB PCIe 4.0',
      nameUz: 'Samsung 990 PRO 2TB PCIe 4.0 M.2 NVMe SSD',
      brand: 'Samsung',
      model: '990 PRO 2TB',
      priceUzs: 2450000,
      image: '/images/products/ssd-samsung-990pro-2tb.png',
      storageInterface: 'M.2 NVMe',
      capacityGb: 2000,
      descriptionRu: 'Флагманский накопитель 2 ТБ: скорость до 7450 МБ/с, идеален для установки десятков современных игр.',
      descriptionUz: '2TB hajmli flagman SSD: 7450 MB/s tezlik, zamonaviy og\'ir o\'yinlar to\'plamini saqlash uchun mo\'ljallangan.'
    },

    // --- Power Supplies ---
    {
      categoryId: 'psu',
      nameRu: 'Блок питания DeepCool PK650D 650W 80+ Bronze',
      nameUz: 'DeepCool PK650D 650W 80+ Bronze quvvat bloki',
      brand: 'DeepCool',
      model: 'PK650D 650W',
      priceUzs: 650000,
      image: '/images/products/psu-pk650d.png',
      psuWattage: 650,
      psuCertification: '80+ Bronze',
      formFactor: 'ATX',
      descriptionRu: 'Сертификат 80 PLUS Bronze, тихий 120мм гидродинамический кулер, плоские черные кабели.',
      descriptionUz: '80 PLUS Bronze sertifikati, sokin 120mm gidrodinamik kuler, qulay qora simlar.'
    },
    {
      categoryId: 'psu',
      nameRu: 'Блок питания be quiet! Pure Power 12 M 850W 80+ Gold',
      nameUz: 'be quiet! Pure Power 12 M 850W 80+ Gold quvvat bloki',
      brand: 'be quiet!',
      model: 'Pure Power 12 M 850W',
      priceUzs: 1850000,
      image: '/images/products/psu-bequiet-850.png',
      psuWattage: 850,
      psuCertification: '80+ Gold',
      formFactor: 'ATX',
      descriptionRu: 'Стандарт ATX 3.0 с кабелем 12VHPWR (PCIe 5.0), модульные кабели, бесшумный вентилятор Silent Wings.',
      descriptionUz: 'ATX 3.0 va 12VHPWR kabeli (PCIe 5.0) mavjud, to\'liq modulli, butunlay sokin Silent Wings ventilyatori.'
    },
    {
      categoryId: 'psu',
      nameRu: 'Блок питания DeepCool PX1000G 1000W 80+ Gold ATX 3.0',
      nameUz: 'DeepCool PX1000G 1000W 80+ Gold ATX 3.0 quvvat bloki',
      brand: 'DeepCool',
      model: 'PX1000G 1000W',
      priceUzs: 2300000,
      image: '/images/products/psu-px1000g.png',
      psuWattage: 1000,
      psuCertification: '80+ Gold',
      formFactor: 'ATX',
      descriptionRu: '1000 Вт чистой мощности, японские конденсаторы 105°C, нативная поддержка RTX 4080/4090.',
      descriptionUz: '1000W toza quvvat, yapon 105°C kondensatorlari, RTX 4080/4090 kartalarini to\'g\'ridan-to\'g\'ri ulash.'
    },

    // --- Cases ---
    {
      categoryId: 'case',
      nameRu: 'Корпус 1STPLAYER TRILOBITE T3 Black (Micro-ATX)',
      nameUz: '1STPLAYER TRILOBITE T3 Black (Micro-ATX) korpusi',
      brand: '1STPLAYER',
      model: 'TRILOBITE T3',
      priceUzs: 420000,
      image: '/images/products/case-t3.png',
      formFactor: 'Micro-ATX',
      maxGpuLength: 320,
      maxCoolerHeight: 160,
      maxRadiatorSupport: '240mm',
      descriptionRu: 'Компактный стильный корпус с боковым закаленным стеклом и перфорированной сеткой на морде.',
      descriptionUz: 'Yoni shishali, ixcham va zamonaviy Micro-ATX korpus, yaxshi havo aylanishi bilan.'
    },
    {
      categoryId: 'case',
      nameRu: 'Корпус DeepCool CC560 V2 Black (ATX)',
      nameUz: 'DeepCool CC560 V2 Black (ATX) korpusi',
      brand: 'DeepCool',
      model: 'CC560 V2',
      priceUzs: 680000,
      image: '/images/products/case-cc560.png',
      formFactor: 'ATX',
      maxGpuLength: 370,
      maxCoolerHeight: 163,
      maxRadiatorSupport: '360mm',
      descriptionRu: 'Полноразмерный корпус с 4 предустановленными вентиляторами с подсветкой и отличной продуваемостью.',
      descriptionUz: '4 ta o\'rnatilgan yoritgichli ventilyatorga ega, havoni a\'lo darajada o\'tkazuvchi to\'liq hajmli ATX korpus.'
    },
    {
      categoryId: 'case',
      nameRu: 'Корпус Lian Li LANCOOL 216 RGB Black (ATX)',
      nameUz: 'Lian Li LANCOOL 216 RGB Black (ATX) korpusi',
      brand: 'Lian Li',
      model: 'LANCOOL 216 RGB',
      priceUzs: 1450000,
      image: '/images/products/case-lancool216.png',
      formFactor: 'ATX',
      maxGpuLength: 392,
      maxCoolerHeight: 180,
      maxRadiatorSupport: '360mm',
      descriptionRu: 'Премиум корпус с двумя гигантскими 160мм вентиляторами спереди. Эталонная продуваемость для топового железа.',
      descriptionUz: 'Old qismida 2 ta ulkan 160mm ventilyatorli premium korpus. Kuchli qismlar uchun eng yaxshi havo sovutishi.'
    },
    {
      categoryId: 'case',
      nameRu: 'Корпус NZXT H6 Flow RGB White (ATX, Панорамный)',
      nameUz: 'NZXT H6 Flow RGB White (ATX, Panoramik) korpusi',
      brand: 'NZXT',
      model: 'H6 Flow RGB White',
      priceUzs: 1850000,
      image: '/images/products/case-h6flow.png',
      formFactor: 'ATX',
      maxGpuLength: 365,
      maxCoolerHeight: 165,
      maxRadiatorSupport: '360mm',
      descriptionRu: 'Двухкамерный аквариумный корпус с панорамным закаленным стеклом и тремя диагональными RGB кулерами.',
      descriptionUz: 'Akvarium uslubidagi ikki xonali chiroyli oq korpus. Qismlaringizni har tomondan namoyish etadi.'
    }
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  // 3. 20 Heavy Games with benchmark parameters
  const games = [
    {
      title: 'Cyberpunk 2077: Phantom Liberty',
      genre: 'Action RPG / Sci-Fi',
      releaseYear: 2023,
      image: '/images/games/cyberpunk.jpg',
      gpuIntensity: 2.3,
      cpuIntensity: 1.6,
      baseFps1080pUltra: 58,
      ramMinGb: 16,
      descriptionRu: 'Самый технологичный бенчмарк игровой индустрии с трассировкой лучей и путей (Overdrive).',
      descriptionUz: 'Ray Tracing va Path Tracing texnologiyalariga ega eng og\'ir grafikali zamonaviy o\'yin.'
    },
    {
      title: 'Black Myth: Wukong',
      genre: 'Action RPG / Souls-like',
      releaseYear: 2024,
      image: '/images/games/wukong.jpg',
      gpuIntensity: 2.4,
      cpuIntensity: 1.5,
      baseFps1080pUltra: 55,
      ramMinGb: 16,
      descriptionRu: 'Хит на движке Unreal Engine 5 с технологией Nanite, Lumen и полнокадровой трассировкой.',
      descriptionUz: 'Unreal Engine 5 dvigatelida yaratilgan, Nanite va Lumen texnologiyalari bilan vizual durdona.'
    },
    {
      title: 'Alan Wake 2',
      genre: 'Survival Horror',
      releaseYear: 2023,
      image: '/images/games/alanwake2.jpg',
      gpuIntensity: 2.5,
      cpuIntensity: 1.4,
      baseFps1080pUltra: 52,
      ramMinGb: 16,
      descriptionRu: 'Фотореалистичная графика от Remedy с непревзойденной плотностью полигонов через Mesh Shaders.',
      descriptionUz: 'Mesh Shaders va to\'liq Path Tracing texnologiyasiga ega fotorealistik dahshat o\'yini.'
    },
    {
      title: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl',
      genre: 'Open World FPS',
      releaseYear: 2024,
      image: '/images/games/stalker2.jpg',
      gpuIntensity: 2.3,
      cpuIntensity: 1.7,
      baseFps1080pUltra: 56,
      ramMinGb: 16,
      descriptionRu: 'Огромный открытый мир Чернобыльской Зоны на движке Unreal Engine 5 с высокой нагрузкой на видеопамять.',
      descriptionUz: 'Unreal Engine 5 asosidagi keng ochiq dunyo va protsessor hamda videokartaga o\'ta yuqori talab.'
    },
    {
      title: 'Red Dead Redemption 2',
      genre: 'Action / Adventure',
      releaseYear: 2019,
      image: '/images/games/rdr2.jpg',
      gpuIntensity: 1.7,
      cpuIntensity: 1.4,
      baseFps1080pUltra: 78,
      ramMinGb: 16,
      descriptionRu: 'Живой детализированный мир Дикого Запада с невероятной симуляцией физики и погоды.',
      descriptionUz: 'Rokstar kompaniyasining tirik va mukammal detallashtirilgan yovvoyi g\'arb olami.'
    },
    {
      title: 'Hogwarts Legacy',
      genre: 'Action RPG / Fantasy',
      releaseYear: 2023,
      image: '/images/games/hogwarts.jpg',
      gpuIntensity: 1.8,
      cpuIntensity: 1.6,
      baseFps1080pUltra: 68,
      ramMinGb: 16,
      descriptionRu: 'Магический замок Хогвартс и окрестности с требовательными текстурами и эффектами заклинаний.',
      descriptionUz: 'Sehrgarlar dunyosi, sevimli Xogvarts qasri va katta hajmda operativ xotira talab qiluvchi ochiq dunyo.'
    },
    {
      title: 'Starfield',
      genre: 'Sci-Fi RPG',
      releaseYear: 2023,
      image: '/images/games/starfield.jpg',
      gpuIntensity: 2.0,
      cpuIntensity: 1.7,
      baseFps1080pUltra: 62,
      ramMinGb: 16,
      descriptionRu: 'Космическая сага от Bethesda с тысячами планет и высокой нагрузкой на процессор в городах.',
      descriptionUz: 'Bethesda kompaniyasining koinot sarguzashti, shahar hududlarida protsessorga kuchli nagruzka tushadi.'
    },
    {
      title: 'The Witcher 3: Wild Hunt (Next-Gen)',
      genre: 'Action RPG',
      releaseYear: 2022,
      image: '/images/games/witcher3.jpg',
      gpuIntensity: 1.9,
      cpuIntensity: 1.4,
      baseFps1080pUltra: 70,
      ramMinGb: 16,
      descriptionRu: 'Обновленная версия приключений Геральта с глобальным освещением Ray Tracing и ультра-текстурами.',
      descriptionUz: 'Geralt haqidagi afsonaviy o\'yinning yangilangan versiyasi: Ray Tracing va yangi teksturalar.'
    },
    {
      title: 'The Last of Us Part I',
      genre: 'Action / Adventure',
      releaseYear: 2023,
      image: '/images/games/tlou1.jpg',
      gpuIntensity: 2.1,
      cpuIntensity: 1.8,
      baseFps1080pUltra: 64,
      ramMinGb: 16,
      descriptionRu: 'Ремейк культовой постапокалиптической истории, крайне требовательный к объему VRAM и процессору.',
      descriptionUz: 'Post-apokalipsis janridagi mashhur durdona, video xotira va ko\'p yadroli CPU talab qiladi.'
    },
    {
      title: 'God of War Ragnarök',
      genre: 'Action / Adventure',
      releaseYear: 2024,
      image: '/images/games/gow_ragnarok.jpg',
      gpuIntensity: 1.8,
      cpuIntensity: 1.5,
      baseFps1080pUltra: 76,
      ramMinGb: 16,
      descriptionRu: 'Эпический финал скандинавской саги Кратоса и Атрея с потрясающей кинематографичной графикой.',
      descriptionUz: 'Kratos va Otreyning skandinaviya sarguzashtlari yakuni, ajoyib kino darajasidagi grafika.'
    },
    {
      title: 'Avatar: Frontiers of Pandora',
      genre: 'Action / Adventure',
      releaseYear: 2023,
      image: '/images/games/avatar.jpg',
      gpuIntensity: 2.2,
      cpuIntensity: 1.4,
      baseFps1080pUltra: 60,
      ramMinGb: 16,
      descriptionRu: 'Движок Snowdrop с аппаратной трассировкой лучей в пышных джунглях планеты Пандора.',
      descriptionUz: 'Pandora sayyorasining go\'zal o\'rmonlari, Snowdrop dvigateli va apparatli Ray Tracing yoritilishi.'
    },
    {
      title: 'Call of Duty: Warzone & MW3',
      genre: 'Battle Royale / FPS',
      releaseYear: 2023,
      image: '/images/games/warzone.jpg',
      gpuIntensity: 1.6,
      cpuIntensity: 1.8,
      baseFps1080pUltra: 95,
      ramMinGb: 16,
      descriptionRu: 'Динамичный соревновательный шутер с картой Урзыкстан, требующий высокой частоты кадров.',
      descriptionUz: 'Dinamik onlayn otishma o\'yini, yuqori gersli monitorlar uchun maksimal FPS talab qiladi.'
    },
    {
      title: 'Metro Exodus Enhanced Edition',
      genre: 'Post-Apocalyptic FPS',
      releaseYear: 2021,
      image: '/images/games/metro_exodus.jpg',
      gpuIntensity: 2.0,
      cpuIntensity: 1.3,
      baseFps1080pUltra: 72,
      ramMinGb: 16,
      descriptionRu: 'Первая игра, созданная исключительно под освещение на трассировке лучей без обычного света.',
      descriptionUz: 'Faqat Ray Tracing orqali yoritiladigan birinchi o\'yinlardan biri, ajoyib atmosferaga boy.'
    },
    {
      title: 'Forza Horizon 5',
      genre: 'Racing / Open World',
      releaseYear: 2021,
      image: '/images/games/forza5.jpg',
      gpuIntensity: 1.5,
      cpuIntensity: 1.3,
      baseFps1080pUltra: 92,
      ramMinGb: 16,
      descriptionRu: 'Красивейший автосимулятор в солнечной Мексике с идеальной оптимизацией и сменяемыми сезонами.',
      descriptionUz: 'Quyoshli Meksika bo\'ylab ajoyib poygalar, eng yuqori darajada optimallashtirilgan o\'yin.'
    },
    {
      title: 'Baldur\'s Gate 3',
      genre: 'CRPG / Fantasy',
      releaseYear: 2023,
      image: '/images/games/bg3.jpg',
      gpuIntensity: 1.6,
      cpuIntensity: 1.8,
      baseFps1080pUltra: 82,
      ramMinGb: 16,
      descriptionRu: 'Игра года: огромный мир с сотнями персонажей и высокой нагрузкой на процессор в 3-м акте (Врата Балдура).',
      descriptionUz: 'Yilning eng yaxshi o\'yini: o\'nlab qahramonlar va shaharlarda protsessorga yuqori nagruzka.'
    },
    {
      title: 'Dying Light 2: Stay Human',
      genre: 'Action / Zombie Parkour',
      releaseYear: 2022,
      image: '/images/games/dyinglight2.jpg',
      gpuIntensity: 1.9,
      cpuIntensity: 1.5,
      baseFps1080pUltra: 74,
      ramMinGb: 16,
      descriptionRu: 'Паркур в зараженном городе с динамической сменой дня и ночи и полным пакетом трассировки лучей.',
      descriptionUz: 'Zombi virusi tarqalgan shahar bo\'ylab parkur, kechasi xavfli hayvonlar va Ray Tracing akslari.'
    },
    {
      title: 'Ghost of Tsushima DIRECTOR\'S CUT',
      genre: 'Action / Adventure',
      releaseYear: 2024,
      image: '/images/games/got.jpg',
      gpuIntensity: 1.6,
      cpuIntensity: 1.3,
      baseFps1080pUltra: 88,
      ramMinGb: 16,
      descriptionRu: 'Живописная феодальная Япония, шелест ветра и филигранные битвы на катанах с отличной оптимизацией.',
      descriptionUz: 'Feodal Yaponiya manzaralari, shamol harakati va samuraylar jangi, kompyuterda ajoyib silliq ishlaydi.'
    },
    {
      title: 'Helldivers 2',
      genre: 'Co-op Third-Person Shooter',
      releaseYear: 2024,
      image: '/images/games/helldivers2.jpg',
      gpuIntensity: 1.9,
      cpuIntensity: 1.9,
      baseFps1080pUltra: 70,
      ramMinGb: 16,
      descriptionRu: 'Массовые сражения против жуков и роботов с десятками взрывов, сильно нагружающими CPU и GPU.',
      descriptionUz: 'Kooperativ jangovar otishma: yuzlab portlashlar va robotlar tufayli CPU hamda GPU ga jiddiy sinov.'
    },
    {
      title: 'Microsoft Flight Simulator 2024',
      genre: 'Flight Simulation',
      releaseYear: 2024,
      image: '/images/games/msfs.jpg',
      gpuIntensity: 2.2,
      cpuIntensity: 2.2,
      baseFps1080pUltra: 48,
      ramMinGb: 32,
      descriptionRu: 'Вся планета Земля в масштабе 1:1 со спутниковыми снимками. Экстремальная нагрузка на все узлы ПК.',
      descriptionUz: 'Butun Yer shari 1:1 masshtabda. Kompyuterning barcha qismlarini (CPU, GPU, RAM) to\'liq ishlatadi.'
    },
    {
      title: 'Assassin\'s Creed Mirage',
      genre: 'Action / Stealth',
      releaseYear: 2023,
      image: '/images/games/ac_mirage.jpg',
      gpuIntensity: 1.7,
      cpuIntensity: 1.4,
      baseFps1080pUltra: 85,
      ramMinGb: 16,
      descriptionRu: 'Детализированный Багдад IX века с оживленными улицами, паркуром и красивым восточным колоритом.',
      descriptionUz: 'IX asr Bag\'dod shahri ko\'chalari bo\'ylab yashirin harakatlar va ajoyib sharqona atmosfera.'
    }
  ];

  for (const game of games) {
    await prisma.game.create({ data: game });
  }

  console.log(`Database seeded successfully! Added ${categories.length} categories, ${products.length} products, ${games.length} games.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
