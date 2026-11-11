export type Language = 'ru' | 'uz';

export interface Translations {
  common: {
    siteName: string;
    siteTagline: string;
    catalog: string;
    builder: string;
    fpsCalculator: string;
    cart: string;
    total: string;
    currency: string;
    addToCart: string;
    removeFromCart: string;
    select: string;
    selected: string;
    change: string;
    clear: string;
    close: string;
    inStock: string;
    outOfStock: string;
    price: string;
    search: string;
    loading: string;
    viewDetails: string;
    emptyCart: string;
    checkout: string;
    orderSuccess: string;
    contactPhone: string;
    address: string;
    workingHours: string;
    allRightsReserved: string;
  };
  catalog: {
    allCategories: string;
    filterByPrice: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortName: string;
    productsFound: string;
    addToBuilder: string;
    alreadyInBuilder: string;
    specs: string;
  };
  builder: {
    title: string;
    subtitle: string;
    stepTitle: string;
    compatibilityTitle: string;
    allCompatible: string;
    incompatibleDetected: string;
    estimatedWattage: string;
    recommendedPsu: string;
    totalPrice: string;
    resetBuild: string;
    orderBuild: string;
    visualPreview: string;
    componentSlots: string;
    fpsInGames: string;
    onlyCompatible: string;
    choosePart: string;
    removePart: string;
    slots: {
      cpu: string;
      motherboard: string;
      ram: string;
      gpu: string;
      cooler: string;
      storage: string;
      psu: string;
      case: string;
    };
    alerts: {
      socketMismatch: string;
      ramMismatch: string;
      caseMotherboardMismatch: string;
      gpuTooLong: string;
      coolerTooTall: string;
      psuInsufficient: string;
      noGpuWithFcpu: string;
    };
  };
  fps: {
    title: string;
    subtitle: string;
    selectGame: string;
    resolution: string;
    preset: string;
    low: string;
    medium: string;
    high: string;
    ultra: string;
    bottleneckAnalysis: string;
    gpuBottleneck: string;
    cpuBottleneck: string;
    balanced: string;
    playability: {
      poor: string;
      playable: string;
      smooth: string;
      ultraSmooth: string;
    };
    buildRequired: string;
    pickPresetBuild: string;
    customBuild: string;
    budgetBuild: string;
    midBuild: string;
    highEndBuild: string;
    gamesList: string;
  };
  cartPage: {
    title: string;
    itemsCount: string;
    clearCart: string;
    orderSummary: string;
    customerName: string;
    phoneNumber: string;
    telegramUsername: string;
    deliveryAddress: string;
    submitOrder: string;
    successMessage: string;
  };
}

export const dictionaries: Record<Language, Translations> = {
  ru: {
    common: {
      siteName: 'CYBER-MARKET.UZ',
      siteTagline: 'Премиальный гипермаркет ПК-комплектующих и сборок в Ташкенте',
      catalog: 'Каталог',
      builder: 'Конструктор ПК',
      fpsCalculator: 'Калькулятор FPS',
      cart: 'Корзина',
      total: 'Итого',
      currency: 'сум',
      addToCart: 'В корзину',
      removeFromCart: 'Удалить',
      select: 'Выбрать',
      selected: 'Выбрано',
      change: 'Заменить',
      clear: 'Очистить',
      close: 'Закрыть',
      inStock: 'В наличии',
      outOfStock: 'Под заказ',
      price: 'Цена',
      search: 'Поиск товаров...',
      loading: 'Загрузка...',
      viewDetails: 'Характеристики',
      emptyCart: 'Ваша корзина пуста',
      checkout: 'Оформить заказ',
      orderSuccess: 'Заказ успешно оформлен!',
      contactPhone: '+998 (71) 200-50-50',
      address: 'г. Ташкент, ул. Навои, 42 (IT-Парк)',
      workingHours: 'Ежедневно: 09:00 - 21:00',
      allRightsReserved: 'Все права защищены.',
    },
    catalog: {
      allCategories: 'Все категории',
      filterByPrice: 'Фильтр по цене (UZS)',
      minPrice: 'От',
      maxPrice: 'До',
      sortBy: 'Сортировка',
      sortPriceAsc: 'Сначала дешевые',
      sortPriceDesc: 'Сначала дорогие',
      sortName: 'По названию',
      productsFound: 'Найдено товаров',
      addToBuilder: 'В конфигуратор',
      alreadyInBuilder: 'В конфигураторе',
      specs: 'Технические характеристики',
    },
    builder: {
      title: 'Конфигуратор ПК',
      subtitle: 'Соберите компьютер мечты с автоматической проверкой совместимости каждого узла',
      stepTitle: 'Выберите компонент',
      compatibilityTitle: 'Проверка совместимости',
      allCompatible: 'Все компоненты 100% совместимы!',
      incompatibleDetected: 'Обнаружены конфликты совместимости!',
      estimatedWattage: 'Расчетная мощность системы',
      recommendedPsu: 'Рекомендуемый БП (с запасом 25%)',
      totalPrice: 'Стоимость сборки',
      resetBuild: 'Сбросить сборку',
      orderBuild: 'Заказать данную сборку',
      visualPreview: 'Интерактивная схема корпуса',
      componentSlots: 'Комплектующие сборки',
      fpsInGames: 'Производительность в 20 играх',
      onlyCompatible: 'Только совместимые',
      choosePart: 'Выбрать деталь',
      removePart: 'Убрать',
      slots: {
        cpu: 'Процессор (CPU)',
        motherboard: 'Материнская плата',
        ram: 'Оперативная память (RAM)',
        gpu: 'Видеокарта (GPU)',
        cooler: 'Кулер процессора',
        storage: 'Накопитель (SSD M.2)',
        psu: 'Блок питания (PSU)',
        case: 'Корпус (Case)',
      },
      alerts: {
        socketMismatch: 'Несовместимость сокета: процессор и материнская плата имеют разные разъемы.',
        ramMismatch: 'Несовместимость памяти: материнская плата и память имеют разные типы (DDR4 / DDR5).',
        caseMotherboardMismatch: 'Размер платы не поддерживается корпусом.',
        gpuTooLong: 'Длина видеокарты превышает максимальную вместимость корпуса.',
        coolerTooTall: 'Высота процессорного кулера превышает ширину корпуса.',
        psuInsufficient: 'Мощность блока питания недостаточна для данной конфигурации.',
        noGpuWithFcpu: 'Процессору без встроенного видеоядра (серии F) требуется дискретная видеокарта.',
      },
    },
    fps: {
      title: 'Калькулятор FPS в играх',
      subtitle: 'Точный математический расчёт частоты кадров по базе из 20 самых тяжелых игр современности',
      selectGame: 'Выберите игру для детального анализа',
      resolution: 'Разрешение экрана',
      preset: 'Настройки графики',
      low: 'Низкие',
      medium: 'Средние',
      high: 'Высокие',
      ultra: 'Ультра / RT',
      bottleneckAnalysis: 'Анализ баланса (Bottleneck)',
      gpuBottleneck: 'Ограничение по видеокарте (GPU упор - идеальный баланс для игр)',
      cpuBottleneck: 'Процессор ограничивает видеокарту (рекомендуется более мощный CPU)',
      balanced: 'Идеальный баланс процессора и видеокарты',
      playability: {
        poor: 'Низкий FPS (<30 кадров) — некомфортно',
        playable: 'Играбельно (30-59 кадров) — базовый уровень',
        smooth: 'Плавно (60-119 кадров) — комфортный гейминг',
        ultraSmooth: 'Киберспорт (120+ кадров) — ультра-плавно',
      },
      buildRequired: 'Выберите процессор и видеокарту в конфигураторе или используйте готовую сборку ниже.',
      pickPresetBuild: 'Быстрый тест готовой сборки',
      customBuild: 'Текущая сборка из конструктора',
      budgetBuild: 'Бюджетный гейминг (i5-12400F + RTX 4060)',
      midBuild: 'Оптимальный гейминг (Ryzen 5 7500F + RTX 4070 Super)',
      highEndBuild: 'Топовый хай-энд (Ryzen 7 7800X3D + RTX 4080 Super)',
      gamesList: 'База 20 самых тяжелых игр',
    },
    cartPage: {
      title: 'Корзина покупок',
      itemsCount: 'Товаров в заказе',
      clearCart: 'Очистить корзину',
      orderSummary: 'Сводка заказа',
      customerName: 'Ваше имя',
      phoneNumber: 'Номер телефона (+998 ...)',
      telegramUsername: 'Telegram (@username или номер для чека)',
      deliveryAddress: 'Адрес доставки (г. Ташкент / регионы)',
      submitOrder: 'Подтвердить и получить чек в Telegram',
      successMessage: 'Спасибо! Ваш заказ принят. Чек формируется для отправки в Telegram.',
    },
  },
  uz: {
    common: {
      siteName: 'CYBER-MARKET.UZ',
      siteTagline: 'Toshkentdagi kompyuter qismlari va tayyor tizimlar gipermarketi',
      catalog: 'Katalog',
      builder: 'PC Konstruktor',
      fpsCalculator: 'FPS Hisoblagich',
      cart: 'Savat',
      total: 'Jami',
      currency: "so'm",
      addToCart: 'Savatga',
      removeFromCart: "O'chirish",
      select: 'Tanlash',
      selected: 'Tanlandi',
      change: "O'zgartirish",
      clear: 'Tozalash',
      close: 'Yopish',
      inStock: 'Mavjud',
      outOfStock: 'Buyurtma asosida',
      price: 'Narxi',
      search: 'Mahsulotlarni qidirish...',
      loading: 'Yuklanmoqda...',
      viewDetails: 'Xususiyatlari',
      emptyCart: 'Savatingiz hozircha bo\'sh',
      checkout: 'Buyurtma berish',
      orderSuccess: 'Buyurtma muvaffaqiyatli qabul qilindi!',
      contactPhone: '+998 (71) 200-50-50',
      address: 'Toshkent sh., Navoiy ko\'chasi, 42 (IT-Park)',
      workingHours: 'Har kuni: 09:00 - 21:00',
      allRightsReserved: 'Barcha huquqlar himoyalangan.',
    },
    catalog: {
      allCategories: 'Barcha toifalar',
      filterByPrice: 'Narx bo\'yicha saralash (UZS)',
      minPrice: 'Dan',
      maxPrice: 'Gacha',
      sortBy: 'Saralash',
      sortPriceAsc: 'Avval arzonlari',
      sortPriceDesc: 'Avval qimmatlari',
      sortName: 'Nomi bo\'yicha',
      productsFound: 'Topilgan tovarlar soni',
      addToBuilder: 'Konstruktorga',
      alreadyInBuilder: 'Konstruktorda bor',
      specs: 'Texnik xususiyatlari',
    },
    builder: {
      title: 'PC Konstruktori',
      subtitle: 'Har bir qismning mosligini avtomatik tekshirgan holda orzuingizdagi kompyuterni yig\'ing',
      stepTitle: 'Komponentni tanlang',
      compatibilityTitle: 'Moslik tekshiruvi',
      allCompatible: 'Barcha qismlar 100% mos keladi!',
      incompatibleDetected: 'Mos kelmaslik holatlari aniqlandi!',
      estimatedWattage: 'Tizimning taxminiy quvvat sarfi',
      recommendedPsu: 'Tavsiya etilgan quvvat bloki (25% zaxira bilan)',
      totalPrice: 'Yig\'ma narxi',
      resetBuild: 'Yig\'mani tozalash',
      orderBuild: 'Ushbu yig\'maga buyurtma berish',
      visualPreview: 'Korpusning interaktiv chizmasi',
      componentSlots: 'Yig\'ma qismlari',
      fpsInGames: '20 ta o\'yindagi tezlik ko\'rsatkichlari',
      onlyCompatible: 'Faqat mos keladiganlar',
      choosePart: 'Qismni tanlash',
      removePart: 'Olib tashlash',
      slots: {
        cpu: 'Protsessor (CPU)',
        motherboard: 'Ona plata (Motherboard)',
        ram: 'Tezkor xotira (RAM)',
        gpu: 'Videokarta (GPU)',
        cooler: 'Protsessor sovutgichi',
        storage: 'Xotira diski (SSD M.2)',
        psu: 'Quvvat bloki (PSU)',
        case: 'Korpus (Case)',
      },
      alerts: {
        socketMismatch: 'Soket mos kelmaydi: protsessor va ona plata raz\'yomi bir-biriga to\'g\'ri kelmaydi.',
        ramMismatch: 'Xotira turi mos kelmaydi: ona plata va RAM har xil turda (DDR4 / DDR5).',
        caseMotherboardMismatch: 'Ona plata o\'lchami ushbu korpusga sig\'maydi.',
        gpuTooLong: 'Videokarta uzunligi korpusning maksimal o\'lchamidan katta.',
        coolerTooTall: 'Protsessor sovutgichining balandligi korpus kengligiga sig\'maydi.',
        psuInsufficient: 'Quvvat bloki ushbu yig\'ma uchun yetarli emas.',
        noGpuWithFcpu: 'Ichki videoyadroga ega bo\'lmagan (F-seriyali) protsessor uchun videokarta majburiy.',
      },
    },
    fps: {
      title: 'O\'yinlarda FPS hisoblagich',
      subtitle: '20 ta eng og\'ir zamonaviy o\'yinlar bazasi asosida aniq kadrlar tezligini hisoblash',
      selectGame: 'Tahlil uchun o\'yinni tanlang',
      resolution: 'Ekran o\'lchami (Rezolyutsiya)',
      preset: 'Grafika sozlamalari',
      low: 'Past (Low)',
      medium: 'O\'rta (Medium)',
      high: 'Yuqori (High)',
      ultra: 'Maksimal (Ultra / RT)',
      bottleneckAnalysis: 'Balans tahlili (Bottleneck)',
      gpuBottleneck: 'Videokarta to\'liq yuklangan (o\'yinlar uchun ideal holat)',
      cpuBottleneck: 'Protsessor videokartani ushlab turibdi (kuchliroq CPU tavsiya etiladi)',
      balanced: 'Protsessor va videokarta o\'rtasida a\'lo muvozanat',
      playability: {
        poor: 'Past FPS (<30 kadr) — qotishlar kuzatiladi',
        playable: 'O\'ynasa bo\'ladi (30-59 kadr) — minimal qulaylik',
        smooth: 'Silliq (60-119 kadr) — ajoyib va qulay o\'yin',
        ultraSmooth: 'Kibersport (120+ kadr) — maksimal silliqlik',
      },
      buildRequired: 'Konstruktorda CPU va GPU tanlang yoki quyidagi tayyor variantlardan birini sinab ko\'ring.',
      pickPresetBuild: 'Tayyor yig\'mani tezda sinash',
      customBuild: 'Konstruktordagi joriy yig\'ma',
      budgetBuild: 'Hamyonbop o\'yin tizimi (i5-12400F + RTX 4060)',
      midBuild: 'Optimal o\'yin tizimi (Ryzen 5 7500F + RTX 4070 Super)',
      highEndBuild: 'Yuqori toifali yig\'ma (Ryzen 7 7800X3D + RTX 4080 Super)',
      gamesList: '20 ta eng og\'ir o\'yinlar bazasi',
    },
    cartPage: {
      title: 'Haridlar savati',
      itemsCount: 'Buyurtmadagi mahsulotlar soni',
      clearCart: 'Savatni tozalash',
      orderSummary: 'Buyurtma hisoboti',
      customerName: 'Ismingiz',
      phoneNumber: 'Telefon raqamingiz (+998 ...)',
      telegramUsername: 'Telegram (@username yoki raqam chek uchun)',
      deliveryAddress: 'Yetkazib berish manzili (Toshkent / viloyat)',
      submitOrder: 'Tasdiqlash va Telegramga chek olish',
      successMessage: 'Rahmat! Buyurtmangiz qabul qilindi. Chek Telegramga yuborilmoqda.',
    },
  },
};
