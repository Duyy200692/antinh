import { DayOfWeek, DishCategory, DishItem, ShopInfo, Language } from '../types';

export type { Language };

export const LANGUAGE_STORAGE_KEY = 'tam_chay_language_v1';

export interface Translations {
  // Top Banner & Admin
  adminModeNotice: string;
  adminModeBadge: string;
  editShopQuick: string;
  kitchenFocus: string;
  logout: string;
  loginAdmin: string;
  loginAdminShort: string;
  contact: string;
  contactPersonPrefix: string;
  phonePrefix: string;
  
  // Header
  menuSubtitle: string;
  menuBadge: string;
  searchPlaceholder: string;
  clearSearch: string;
  weekScheduleBtn: string;
  addDishBtn: string;
  kitchenBoardBtn: string;
  adminKitchenBtn: string;
  
  // Dual Tabs
  tabToday: string;
  tabFixed: string;
  tabAll: string;
  showingCount: string;
  dishesUnit: string;
  guestViewBadge: string;
  
  // Day Selector
  filterByDay: string;
  todayOption: string;
  
  // Category Bar & Filters
  inStockOnly: string;
  
  // Sections
  section1Title: string;
  section1Badge: string;
  section2Title: string;
  section2Badge: string;
  emptySection1Title: string;
  emptySection1Desc: string;
  emptySection2Title: string;
  emptySection2Desc: string;
  emptySearchTitle: string;
  emptySearchWithQuery: (q: string) => string;
  emptySearchGeneral: string;
  viewAllDishesBtn: string;
  
  // Dish Card & Status
  availableEveryDay: string;
  soldOutToday: string;
  soldOutEarly: string;
  inStockBadge: string;
  soldOutBadge: string;
  prepTimePrefix: string;
  featuredBadge: string;
  tapToInspect: string;
  
  // Dish Detail Modal
  dishDetailTitle: string;
  currentlyAvailable: string;
  currentlySoldOut: string;
  prepTimeLabel: string;
  dishDescriptionLabel: string;
  ingredientsLabel: string;
  orderNoticeTitle: string;
  orderNoticeDesc: string;
  callToOrderBtn: string;
  copyPhoneBtn: string;
  copiedPhoneNotice: string;
  toggleStockQuickBtn: (isAvail: boolean) => string;
  editDishBtn: string;
  closeBtn: string;
  
  // Mobile Nav
  navToday: string;
  navFixed: string;
  navSearch: string;
  navShop: string;
  navAdmin: string;
  navAdminLoggedIn: string;
  
  // Weekly Overview Modal
  weeklyTitle: string;
  weeklySubtitle: string;
  fixedWeeklyDishesTitle: (count: number) => string;
  scheduleByDayTitle: string;
  clickDayToView: string;
  
  // Shop Info Modal
  shopInfoTitle: string;
  shopInfoSubtitle: string;
  shopAddressLabel: string;
  shopPhoneLabel: string;
  shopHoursLabel: string;
  shopContactLabel: string;
  shopHighlightsLabel: string;
  editShopInfoBtn: string;
  saveShopInfoBtn: string;
  cancelBtn: string;
  
  // Admin Auth Modal
  adminAuthTitle: string;
  adminAuthDesc: string;
  pinPlaceholder: string;
  pinHelperText: string;
  loginBtn: string;
  invalidPinError: string;
  
  // Language Switcher
  switchLanguage: string;
  vietnamese: string;
  english: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  vi: {
    adminModeNotice: '🔑 Chế độ Admin Bếp (Sửa món/báo hết) — Bấm để mở bảng quản trị',
    adminModeBadge: 'Admin Bếp',
    editShopQuick: 'Sửa TT Quán',
    kitchenFocus: 'Trọng tâm Bếp',
    logout: 'Thoát',
    loginAdmin: 'Đăng nhập Admin Bếp',
    loginAdminShort: 'Admin',
    contact: 'Liên hệ',
    contactPersonPrefix: 'LH',
    phonePrefix: 'ĐT',
    
    menuSubtitle: 'Món Ăn Hôm Nay & Món Cố Định Cả Tuần',
    menuBadge: 'Thực Đơn',
    searchPlaceholder: 'Tìm món chay, xôi, bánh mì...',
    clearSearch: 'Xoá',
    weekScheduleBtn: 'Lịch tuần',
    addDishBtn: 'Thêm món',
    kitchenBoardBtn: 'Bảng Bếp',
    adminKitchenBtn: 'Quản Trị Bếp',
    
    tabToday: '1. Món Hôm Nay',
    tabFixed: '2. Món Cố Định',
    tabAll: 'Tất Cả',
    showingCount: 'Hiển thị',
    dishesUnit: 'món',
    guestViewBadge: 'Khách xem',
    
    filterByDay: 'Lọc theo ngày trong tuần:',
    todayOption: 'Hôm nay',
    
    inStockOnly: 'Chỉ hiện món đang có sẵn',
    
    section1Title: 'Mục 1: Món Ăn Hôm Nay',
    section1Badge: 'Thực Đơn Luân Phiên Thay Đổi',
    section2Title: 'Mục 2: Món Cố Định (Bán Tất Cả Các Ngày)',
    section2Badge: 'Món Phục Vụ Hằng Ngày • Xôi - Bánh Mì - Đồ Hũ Làm Sẵn',
    emptySection1Title: 'Không có món đặc biệt luân phiên nào cho mục này.',
    emptySection1Desc: 'Hãy xem các món ngon trong danh mục Món Cố Định bên dưới.',
    emptySection2Title: 'Không có món cố định nào khớp với từ khoá tìm kiếm.',
    emptySection2Desc: 'Vui lòng thử tìm với từ khoá khác.',
    emptySearchTitle: 'Không tìm thấy món ăn nào',
    emptySearchWithQuery: (q: string) => `Không có món chay nào khớp với từ khoá "${q}".`,
    emptySearchGeneral: 'Thực đơn trong danh mục hoặc ngày được chọn hiện đang trống.',
    viewAllDishesBtn: 'Xem tất cả món',
    
    availableEveryDay: 'Cố định cả tuần',
    soldOutToday: 'Tạm hết hôm nay',
    soldOutEarly: 'Hết sớm trong ngày',
    inStockBadge: 'Đang có sẵn',
    soldOutBadge: 'Tạm hết',
    prepTimePrefix: 'Thời gian:',
    featuredBadge: 'Đặc sắc',
    tapToInspect: 'Xem chi tiết',
    
    dishDetailTitle: 'Chi tiết món ăn',
    currentlyAvailable: 'Đang Có Sẵn Trong Quán',
    currentlySoldOut: 'Tạm Hết Món Hôm Nay',
    prepTimeLabel: 'Thời gian chuẩn bị:',
    dishDescriptionLabel: 'Giới thiệu món:',
    ingredientsLabel: 'Đặc điểm & nguyên liệu thuần chay:',
    orderNoticeTitle: 'Đặt món & Giao hàng tận nơi',
    orderNoticeDesc: 'Quán nhận giao hàng trong nội thành TP.HCM & nhận đặt làm số lượng lớn cho sự kiện, đám tiệc chay.',
    callToOrderBtn: 'Gọi Đặt Món',
    copyPhoneBtn: 'Sao chép SĐT',
    copiedPhoneNotice: 'Đã sao chép số điện thoại!',
    toggleStockQuickBtn: (isAvail: boolean) => isAvail ? 'Báo Tạm Hết Món Này' : 'Bật Có Sẵn Trở Lại',
    editDishBtn: 'Chỉnh Sửa Món Này',
    closeBtn: 'Đóng',
    
    navToday: 'Hôm Nay',
    navFixed: 'Cố Định',
    navSearch: 'Tìm Kiếm',
    navShop: 'Quán',
    navAdmin: 'Đăng Nhập',
    navAdminLoggedIn: 'Bếp Admin',
    
    weeklyTitle: 'Lịch Món Tuần - An Tịnh Chay',
    weeklySubtitle: 'Thực Đơn Món Chính Luân Phiên & Món Cố Định',
    fixedWeeklyDishesTitle: (count: number) => `Món Phục Vụ Cố Định Tất Cả Các Ngày (${count} món)`,
    scheduleByDayTitle: 'Lịch Món Chính Luân Phiên Theo Ngày',
    clickDayToView: 'Bấm vào ngày để xem chi tiết',
    
    shopInfoTitle: 'Thông Tin Quán An Tịnh',
    shopInfoSubtitle: 'Thực Đơn Chay & Món Ngon Thanh Tịnh Chuẩn Vị',
    shopAddressLabel: 'Địa chỉ quán:',
    shopPhoneLabel: 'Hotline / Zalo:',
    shopHoursLabel: 'Giờ mở cửa phục vụ:',
    shopContactLabel: 'Phụ trách quán:',
    shopHighlightsLabel: 'Đặc điểm quán chay:',
    editShopInfoBtn: 'Chỉnh sửa thông tin',
    saveShopInfoBtn: 'Lưu thay đổi',
    cancelBtn: 'Hủy',
    
    adminAuthTitle: 'Xác Thực Quản Trị Bếp',
    adminAuthDesc: 'Nhập mã PIN để truy cập bảng điều khiển quản trị bếp.',
    pinPlaceholder: 'Nhập mã PIN quản trị',
    pinHelperText: 'Mã PIN bảo mật nội bộ dành cho người quản trị bếp.',
    loginBtn: 'Đăng Nhập',
    invalidPinError: 'Mã PIN không chính xác! Vui lòng kiểm tra lại.',
    
    switchLanguage: 'Ngôn ngữ',
    vietnamese: 'Tiếng Việt',
    english: 'English',
  },
  en: {
    adminModeNotice: '🔑 Kitchen Admin Mode (Edit dish / Out of stock) — Tap to open controls',
    adminModeBadge: 'Admin Kitchen',
    editShopQuick: 'Edit Shop Info',
    kitchenFocus: 'Kitchen Focus',
    logout: 'Logout',
    loginAdmin: 'Kitchen Admin Login',
    loginAdminShort: 'Admin',
    contact: 'Contact',
    contactPersonPrefix: 'Contact',
    phonePrefix: 'Tel',
    
    menuSubtitle: 'Today\'s Specials & Fixed Daily Menu',
    menuBadge: 'Menu',
    searchPlaceholder: 'Search vegetarian dishes, sticky rice, banh mi...',
    clearSearch: 'Clear',
    weekScheduleBtn: 'Weekly Schedule',
    addDishBtn: 'Add Dish',
    kitchenBoardBtn: 'Kitchen Board',
    adminKitchenBtn: 'Kitchen Admin',
    
    tabToday: '1. Today\'s Menu',
    tabFixed: '2. Fixed Menu',
    tabAll: 'All Items',
    showingCount: 'Showing',
    dishesUnit: 'dishes',
    guestViewBadge: 'Guest View',
    
    filterByDay: 'Filter by day of week:',
    todayOption: 'Today',
    
    inStockOnly: 'In-stock dishes only',
    
    section1Title: 'Section 1: Today\'s Specials',
    section1Badge: 'Rotating Daily Specials',
    section2Title: 'Section 2: Fixed Menu (Served All Week)',
    section2Badge: 'Daily Favorites • Sticky Rice - Banh Mi - Ready-made Jars',
    emptySection1Title: 'No daily special dishes available for this section.',
    emptySection1Desc: 'Please explore our delicious fixed menu dishes below.',
    emptySection2Title: 'No fixed dishes match your search keywords.',
    emptySection2Desc: 'Please try searching with different words.',
    emptySearchTitle: 'No dishes found',
    emptySearchWithQuery: (q: string) => `No vegetarian items matched "${q}".`,
    emptySearchGeneral: 'The menu for this category or day is currently empty.',
    viewAllDishesBtn: 'View All Dishes',
    
    availableEveryDay: 'Served All Week',
    soldOutToday: 'Sold Out Today',
    soldOutEarly: 'Sold out early',
    inStockBadge: 'In Stock',
    soldOutBadge: 'Sold Out',
    prepTimePrefix: 'Prep time:',
    featuredBadge: 'Featured',
    tapToInspect: 'View details',
    
    dishDetailTitle: 'Dish Details',
    currentlyAvailable: 'Available In Stock',
    currentlySoldOut: 'Sold Out For Today',
    prepTimeLabel: 'Preparation Time:',
    dishDescriptionLabel: 'About This Dish:',
    ingredientsLabel: 'Pure Vegan Ingredients & Highlights:',
    orderNoticeTitle: 'Order & Doorstep Delivery',
    orderNoticeDesc: 'We provide citywide delivery in HCMC & accept pre-orders for large events, meetings and ceremonial gatherings.',
    callToOrderBtn: 'Call to Order',
    copyPhoneBtn: 'Copy Phone',
    copiedPhoneNotice: 'Phone number copied to clipboard!',
    toggleStockQuickBtn: (isAvail: boolean) => isAvail ? 'Mark as Out of Stock' : 'Mark as In Stock',
    editDishBtn: 'Edit This Dish',
    closeBtn: 'Close',
    
    navToday: 'Today',
    navFixed: 'Fixed Menu',
    navSearch: 'Search',
    navShop: 'Shop',
    navAdmin: 'Login',
    navAdminLoggedIn: 'Admin Kitchen',
    
    weeklyTitle: 'Weekly Menu - An Tinh Vegetarian',
    weeklySubtitle: 'Rotating Main Courses & Fixed Daily Offerings',
    fixedWeeklyDishesTitle: (count: number) => `Dishes Served Daily All Week (${count} items)`,
    scheduleByDayTitle: 'Rotating Daily Specials Schedule',
    clickDayToView: 'Click day to inspect dishes',
    
    shopInfoTitle: 'About An Tinh Vegetarian',
    shopInfoSubtitle: 'Wholesome & Pure Plant-Based Vietnamese Cuisine',
    shopAddressLabel: 'Address:',
    shopPhoneLabel: 'Hotline / Zalo:',
    shopHoursLabel: 'Opening Hours:',
    shopContactLabel: 'Contact Person:',
    shopHighlightsLabel: 'Specialty Highlights:',
    editShopInfoBtn: 'Edit Shop Info',
    saveShopInfoBtn: 'Save Changes',
    cancelBtn: 'Cancel',
    
    adminAuthTitle: 'Kitchen Admin Authentication',
    adminAuthDesc: 'Enter your administrative PIN to access kitchen management.',
    pinPlaceholder: 'Enter Admin PIN',
    pinHelperText: 'Internal secure PIN code for kitchen management.',
    loginBtn: 'Login',
    invalidPinError: 'Incorrect PIN! Please try again.',
    
    switchLanguage: 'Language',
    vietnamese: 'Tiếng Việt',
    english: 'English',
  },
};

// Days of week translations
export const DAY_TRANSLATIONS: Record<DayOfWeek, { label: { vi: string; en: string }; short: { vi: string; en: string }; desc: { vi: string; en: string } }> = {
  all: {
    label: { vi: 'Cố định cả tuần', en: 'Fixed All Week' },
    short: { vi: 'Cả tuần', en: 'All Week' },
    desc: { vi: 'Các món chay làm sẵn & xôi bánh bán mỗi ngày', en: 'Ready-made vegan jars & sticky rice served daily' },
  },
  t2: {
    label: { vi: 'Thứ Hai', en: 'Monday' },
    short: { vi: 'Thứ 2', en: 'Mon' },
    desc: { vi: 'Thực đơn món chính Thứ Hai', en: 'Monday main specials' },
  },
  t3: {
    label: { vi: 'Thứ Ba', en: 'Tuesday' },
    short: { vi: 'Thứ 3', en: 'Tue' },
    desc: { vi: 'Thực đơn món chính Thứ Ba', en: 'Tuesday main specials' },
  },
  t4: {
    label: { vi: 'Thứ Tư', en: 'Wednesday' },
    short: { vi: 'Thứ 4', en: 'Wed' },
    desc: { vi: 'Thực đơn món chính Thứ Tư', en: 'Wednesday main specials' },
  },
  t5: {
    label: { vi: 'Thứ Năm', en: 'Thursday' },
    short: { vi: 'Thứ 5', en: 'Thu' },
    desc: { vi: 'Thực đơn món chính Thứ Năm', en: 'Thursday main specials' },
  },
  t6: {
    label: { vi: 'Thứ Sáu', en: 'Friday' },
    short: { vi: 'Thứ 6', en: 'Fri' },
    desc: { vi: 'Thực đơn món chính Thứ Sáu', en: 'Friday main specials' },
  },
  t7: {
    label: { vi: 'Thứ Bảy', en: 'Saturday' },
    short: { vi: 'Thứ 7', en: 'Sat' },
    desc: { vi: 'Thực đơn món chính Thứ Bảy', en: 'Saturday main specials' },
  },
  cn: {
    label: { vi: 'Chủ Nhật', en: 'Sunday' },
    short: { vi: 'CN', en: 'Sun' },
    desc: { vi: 'Thực đơn món chính Chủ Nhật', en: 'Sunday main specials' },
  },
};

// Categories translations
export const CATEGORY_TRANSLATIONS: Record<DishCategory | 'all_categories', { vi: string; en: string }> = {
  all_categories: { vi: 'Tất cả danh mục', en: 'All Categories' },
  daily_main: { vi: 'Món chính theo ngày', en: 'Daily Specials' },
  ready_made: { vi: 'Món chay làm sẵn', en: 'Ready-to-eat Delicacies' },
  sticky_rice_bread: { vi: 'Xôi & Bánh mì chay', en: 'Sticky Rice & Banh Mi' },
  cereal_cake: { vi: 'Bánh hạt ngũ cốc', en: 'Nut & Cereal Pastries' },
};

// Dish Translations Dictionary
export interface DishTranslation {
  name: string;
  description: string;
  unit?: string;
  prepTime?: string;
  tags?: string[];
}

export const DISH_TRANSLATIONS_EN: Record<string, DishTranslation> = {
  'antinh-01': {
    name: 'Wild Forest Mushroom Stem Floss (Northwest)',
    description: 'Artisanal vegetarian shredded floss handcrafted from 100% natural Northwest wild shiitake mushroom stems. Sweet, savory, aromatic and rich in plant protein.',
    unit: '200g Jar',
    prepTime: 'Instant ready',
    tags: ['Northwest Specialty', 'Best Seller', 'Ready-to-eat'],
  },
  'antinh-02': {
    name: 'Barley Vegetarian Rib Floss',
    description: 'Fluffy barley vegetarian rib floss seasoned with pure vegan herbs, nutty and fragrant, perfect with steamed rice, sticky rice or congee.',
    unit: '200g Jar',
    prepTime: 'Instant ready',
    tags: ['Barley Ribs', 'Ready-to-eat'],
  },
  'antinh-03': {
    name: 'Soy Sauce Glazed Crispy Barley Ribs',
    description: 'Crispy vegan barley ribs glazed with traditional rich savory soy sauce, crunchy and delicious, conveniently packed in a jar.',
    unit: '250g Jar',
    prepTime: 'Instant ready',
    tags: ['Barley Ribs', 'Rich Flavor', 'Best Seller'],
  },
  'antinh-04': {
    name: 'Caramelized Bitter Melon with Roasted Sesame',
    description: 'Thinly sliced bitter melon slow-simmered with vegan seasoning and toasted aromatic sesame. Pleasant mild bitterness with deep sweet finish.',
    unit: '200g Jar',
    prepTime: 'Instant ready',
    tags: ['Cooling & Healthy', 'Low Fat', 'Specialty'],
  },
  'antinh-05': {
    name: 'Braised Baby Bitter Melon Pot',
    description: 'Tender baby bitter melon slow-cooked in a rich caramelized soy-chili sauce, thick and savory, perfect with hot steamed rice on rainy days.',
    unit: '250g Jar',
    prepTime: 'Instant ready',
    tags: ['Braised Vegan', 'Savory'],
  },
  'antinh-06': {
    name: 'Dried Oyster Mushroom with Lemongrass & Chili',
    description: 'Hand-shredded fresh oyster mushrooms dehydrated with fragrant minced lemongrass and bird’s eye chili, great as a snack or side dish.',
    unit: '150g Jar',
    prepTime: 'Instant ready',
    tags: ['Oyster Mushroom', 'Mild Lemongrass Chili'],
  },
  'antinh-07': {
    name: 'Five-Spice Spiced King Oyster Mushroom Jerky',
    description: 'Chewy king oyster mushroom marinated in five-spice vegan master broth and gently dehydrated to preserve natural mushroom sweetness.',
    unit: '200g Jar',
    prepTime: 'Instant ready',
    tags: ['King Oyster Mushroom', 'Vegan Master Broth', 'Best Seller'],
  },
  'antinh-08': {
    name: 'Artisanal Barley Vegan Meat Cuts',
    description: 'Handcrafted tender barley vegetarian meat slices, tender and juicy, seasoned with traditional spices for family dining.',
    unit: '250g Jar',
    prepTime: 'Instant ready',
    tags: ['Barley Vegan Meat', 'Everyday Dish'],
  },
  'antinh-09': {
    name: 'Pure Sea Salt Roasted Peanuts',
    description: 'Crispy select peanuts dry-roasted with pure sea salt, naturally nutty, rich and crunchy, stays crisp for a long time.',
    unit: '250g Jar',
    prepTime: 'Instant ready',
    tags: ['Roasted Peanuts', 'Savory Snack'],
  },
  'xoi-01': {
    name: 'Golden Flower Corn Sticky Rice',
    description: 'Tender sweet corn steamed with premium Northern Golden Flower sticky rice, topped with crispy vegan shallots and mashed mung bean.',
    unit: 'Portion',
    prepTime: '5 mins (Pre-order welcome)',
    tags: ['Golden Flower Rice', 'Corn Sticky Rice', 'Best Seller'],
  },
  'xoi-02': {
    name: 'Crumbed Mung Bean Sticky Rice (Xoi Vo)',
    description: 'Individual golden sticky rice grains coated with velvety crushed mung beans, subtly rich and aromatic without being greasy.',
    unit: 'Portion',
    prepTime: '5 mins (Pre-order welcome)',
    tags: ['Xoi Vo', 'Golden Flower Rice'],
  },
  'xoi-03': {
    name: 'Herbal Khuc Rice Cake with Mung Bean & Mushrooms',
    description: 'Chewy glutinous rice dumplings infused with wild cudweed leaves, stuffed with savory mung beans, wood ear mushrooms and crushed black pepper.',
    unit: '2 Pieces',
    prepTime: '5 mins (Pre-order welcome)',
    tags: ['Herbal Khuc Cake', 'Northern Specialty'],
  },
  'xoi-04': {
    name: 'Red Gac Fruit Sticky Rice of Good Fortune',
    description: 'Steamed fragrant sticky rice naturally dyed with fresh bright red gac fruit, gently sweet and rich in Vitamin A, symbolizing prosperity.',
    unit: 'Portion',
    prepTime: '5 mins (Pre-order welcome)',
    tags: ['Red Gac Sticky Rice', 'Good Fortune'],
  },
  'bm-01': {
    name: 'An Tinh Signature Sticky Rice Banh Mi',
    description: 'Crispy hot Vietnamese baguette loaded with aromatic sweet corn sticky rice, wild mushroom floss and homemade vegan pate.',
    unit: 'Loaf',
    prepTime: '3 mins',
    tags: ['Sticky Rice Banh Mi', 'Unique Flavor', 'Best Seller'],
  },
  'bm-02': {
    name: 'Crispy Shredded Skin & Lemongrass Rib Banh Mi',
    description: 'Crunchy baguette stuffed with roasted rice powder shreds, glazed barley ribs, spicy lemongrass king oyster mushrooms and signature dressing.',
    unit: 'Loaf',
    prepTime: '3 mins',
    tags: ['Vegan Banh Mi', 'Hot & Crispy'],
  },
  'cake-01': {
    name: 'Mixed Nutritional Nut Boat Pastry',
    description: 'Crispy pastry boats loaded with almonds, cashews, pumpkin seeds and dried cranberries, glazed with longan blossom honey.',
    unit: '250g Box',
    prepTime: 'Instant ready',
    tags: ['Healthy Nuts', 'Low Sugar', 'Guilt-Free'],
  },
  'cake-02': {
    name: 'Nutty Vegan Nougat Candy',
    description: 'Soft and chewy vegan milk nougat with whole almonds, pistachios and sweet-tart cranberries. Gentle, non-sticky sweetness.',
    unit: '250g Box',
    prepTime: 'Instant ready',
    tags: ['Vegan Nougat', 'Gift Box', 'Pure Plant-Based'],
  },
  'cake-03': {
    name: 'Almond Snowflake Crisp Pastries',
    description: 'Fluffy crisp snowflake pastry infused with malt barley cream and premium roasted nuts. Ideal with warm tea or as a refined gift.',
    unit: '250g Box',
    prepTime: 'Instant ready',
    tags: ['Snowflake Crisp', 'Specialty Pastry'],
  },
  'main-t2-01': {
    name: 'Vegan Broken Rice with Barley Ribs, Shreds & Steamed Egg',
    description: 'Fragrant broken rice with grilled barley ribs in scallion oil, golden rice-powder shreds, and steamed mushroom egg cake with sweet-sour dip.',
    unit: 'Portion',
    prepTime: '5 - 10 mins',
    tags: ['Monday', 'Vegan Broken Rice', 'Main Special'],
  },
  'main-t2-02': {
    name: 'Vegan Hue Spicy Noodle Soup (Bun Bo Hue)',
    description: 'Spicy lemongrass broth slow-simmered from 100% root vegetables and wild mushrooms, with crispy tofu and vegan cinnamon ham.',
    unit: 'Bowl',
    prepTime: '5 - 10 mins',
    tags: ['Monday', 'Bun Bo Hue', 'Vegetable Broth'],
  },
  'main-t3-01': {
    name: 'Monkey Head Mushroom & Sweet Potato Curry',
    description: 'Creamy coconut curry stewed with tender Lion\'s mane (monkey head) mushrooms, purple sweet potato and taro, served with rice or bread.',
    unit: 'Portion',
    prepTime: '5 - 10 mins',
    tags: ['Tuesday', 'Vegan Curry', 'Monkey Head Mushroom'],
  },
  'main-t3-02': {
    name: 'Hanoi Vegan Shiitake Mushroom Pho',
    description: 'Fragrant cinnamon and star anise herbal broth, soft pho noodles, seared shiitake mushrooms and crispy crullers.',
    unit: 'Bowl',
    prepTime: '5 - 10 mins',
    tags: ['Tuesday', 'Vegan Pho', 'Pure Herbs'],
  },
  'main-t4-01': {
    name: 'Crispy Fried Rice with Lemon Basil & King Oyster Mushroom',
    description: 'Wok-tossed crispy rice infused with fresh wild lemon basil aroma, paired with hand-shredded king oyster mushrooms in green pepper.',
    unit: 'Portion',
    prepTime: '5 - 10 mins',
    tags: ['Wednesday', 'Lemon Basil Fried Rice', 'Chef Special'],
  },
  'main-t4-02': {
    name: 'Vegan Crab Paste Noodle Soup (Bun Rieu)',
    description: 'Tangy tomato and annatto broth, savory soybean mock crab patties, fresh straw mushrooms and fried golden tofu.',
    unit: 'Bowl',
    prepTime: '5 - 10 mins',
    tags: ['Wednesday', 'Bun Rieu Chay'],
  },
  'main-t5-01': {
    name: 'Claypot Steamed Rice with Braised Vegan Fish in Peppercorn',
    description: 'Sizzling hot claypot rice with crispy bottom crust, served with nori vegan fish simmered in sweet spicy green pepper sauce.',
    unit: 'Portion',
    prepTime: '10 mins',
    tags: ['Thursday', 'Claypot Rice', 'Braised Fish Pot'],
  },
  'main-t5-02': {
    name: 'Phnom Penh Vegan Noodle Soup (Hu Tieu Nam Vang)',
    description: 'Clear savory turnip-mushroom broth, bouncy noodles, toasted garlic oil and tender sliced king oyster mushrooms.',
    unit: 'Bowl',
    prepTime: '5 - 10 mins',
    tags: ['Thursday', 'Hu Tieu Chay', 'Light & Fresh'],
  },
  'main-t6-01': {
    name: 'Caramelized Vegan Dip with Five-color Steamed Vegetables',
    description: 'Deep savory caramelized pepper reduction dip paired with crisp fresh steamed vegetables (okra, broccoli, carrots, greens) and hot rice.',
    unit: 'Portion',
    prepTime: '5 - 10 mins',
    tags: ['Friday', 'Vegan Kho Quet', 'Steamed Veggies'],
  },
  'main-t6-02': {
    name: 'Herbal Bamboo Shoot & Shiitake Noodle Soup',
    description: 'Hearty simmered dry bamboo shoots in warming ginger herbal broth, tender shiitake mushrooms and spicy ginger vegan dipping sauce.',
    unit: 'Bowl',
    prepTime: '5 - 10 mins',
    tags: ['Friday', 'Bamboo Shoot Noodle'],
  },
  'main-t7-01': {
    name: 'Imperial Golden Fried Rice with Lotus Seeds & Diced Mushrooms',
    description: 'Golden rice grains tossed with creamy Hue fresh lotus seeds, diced aromatic mushrooms, sweet green beans and roasted cashews.',
    unit: 'Portion',
    prepTime: '10 mins',
    tags: ['Saturday', 'Golden Fried Rice', 'Lotus Seeds'],
  },
  'main-t7-02': {
    name: 'Tom Yum Spicy & Sour Mushroom Hotpot (Single Serving)',
    description: 'Personal mini hotpot bursting with lemongrass, kaffir lime, enoki, king oyster and straw mushrooms, served with fresh noodles.',
    unit: 'Personal Pot',
    prepTime: '10 - 15 mins',
    tags: ['Saturday', 'Vegan Tom Yum', 'Spicy & Sour'],
  },
  'main-cn-01': {
    name: 'Golden Crispy King Oyster Mushroom Chicken Rice',
    description: 'Fragrant scallion fried rice accompanied by king oyster mushroom "chicken" drumstick coated in crispy golden crust, tender inside.',
    unit: 'Portion',
    prepTime: '10 mins',
    tags: ['Sunday', 'Vegan Chicken Rice', 'Chef Special'],
  },
  'main-cn-02': {
    name: 'Spring Roll Rice Noodle Bowl (Bun Cha Gio)',
    description: 'Fresh rice vermicelli and herbs topped with ultra-crispy netted taro and mung bean spring rolls, drizzled with sweet-sour dressing.',
    unit: 'Bowl',
    prepTime: '5 - 10 mins',
    tags: ['Sunday', 'Bun Cha Gio Chay', 'Crispy Rolls'],
  },
};

// Helper to get localized dish info
export function getLocalizedDish(dish: DishItem, lang: Language): DishItem {
  if (lang === 'vi') return dish;

  const translation = DISH_TRANSLATIONS_EN[dish.id];
  if (!translation) return dish;

  return {
    ...dish,
    name: translation.name || dish.name,
    description: translation.description || dish.description,
    unit: translation.unit || dish.unit,
    prepTime: translation.prepTime || dish.prepTime,
    tags: translation.tags || dish.tags,
  };
}

// Helper to get localized shop info
export function getLocalizedShopInfo(info: ShopInfo, lang: Language): ShopInfo {
  if (lang === 'vi') return info;

  return {
    ...info,
    name: info.name === 'AN TỊNH - MENU CHAY NỘI BỘ & ĐẶC SẢN CHAY' 
      ? 'AN TINH - VEGETARIAN DELICACIES & SPECIALTIES' 
      : info.name,
    slogan: info.slogan.includes('sức khoẻ')
      ? 'Wishing you peaceful wellness. Pure ready-to-eat vegetarian delicacies & authentic northern sticky rice.'
      : info.slogan,
    features: [
      'Ready-to-eat vegetarian delicacies crafted from Northwest wild mushrooms & barley ribs',
      'Authentic Northern Golden Flower sticky rice prepared with traditional mastery',
      'Nutritious healthy nut & whole cereal gourmet pastries',
      'Bulk catering orders available for banh mi & sticky rice for celebrations and events',
    ],
    footerNote: '© 2026 AN TINH • Pure & Peaceful Vegetarian Menu',
  };
}

// Helper to get localized day labels
export function getLocalizedDayLabel(dayId: DayOfWeek, lang: Language): string {
  const conf = DAY_TRANSLATIONS[dayId];
  return conf ? conf.label[lang] : dayId;
}

export function getLocalizedDayShortLabel(dayId: DayOfWeek, lang: Language): string {
  const conf = DAY_TRANSLATIONS[dayId];
  return conf ? conf.short[lang] : dayId;
}

export function getLocalizedDayDesc(dayId: DayOfWeek, lang: Language): string {
  const conf = DAY_TRANSLATIONS[dayId];
  return conf ? conf.desc[lang] : '';
}

// Helper to get localized category labels
export function getLocalizedCategoryLabel(categoryId: DishCategory | 'all_categories', lang: Language): string {
  const conf = CATEGORY_TRANSLATIONS[categoryId];
  return conf ? conf[lang] : categoryId;
}
