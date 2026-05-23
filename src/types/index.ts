// ===================== User & Auth Types =====================

export interface UserInfo {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: string;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface ShippingAddress {
  name?: string;
  address?: string;
  contact?: string;
  email?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  area?: string;
  _id?: string;
}

export interface CouponInfo {
  _id?: string;
  couponCode?: string;
  discountType?: {
    type: "fixed" | "percentage";
    value: number;
  };
  minimumAmount?: number;
  endTime?: string;
  title?: string | Record<string, string>;
}

// ===================== Product Types =====================

export interface ProductVariant {
  _id?: string;
  color?: string;
  size?: string;
  quantity?: number;
  price?: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  sku?: string;
  [key: string]: unknown;
}

export interface Product {
  _id: string;
  title: string | Record<string, string>;
  slug: string;
  description?: string | Record<string, string>;
  price: number;
  originalPrice?: number;
  discount?: number;
  prices?: { price: number; originalPrice?: number; discount?: number };
  image?: string | string[];
  images?: string[];
  category?: Category | string;
  stock?: number;
  sku?: string;
  rating?: number;
  average_rating?: number;
  total_reviews?: number;
  reviews?: number;
  tag?: string[];
  unit?: string;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  status?: string;
  isFeatured?: boolean;
  [key: string]: unknown;
}

export interface CartItem extends Product {
  quantity: number;
  itemTotal: number;
  selectedVariant?: ProductVariant;
  color?: string;
  size?: string;
}

// ===================== Category Types =====================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  description?: string;
  parent?: string;
  children?: Category[];
  productCount?: number;
  [key: string]: unknown;
}

// ===================== Order Types =====================

export interface OrderUserInfo {
  name: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  invoice?: string;
  user_info: OrderUserInfo;
  cart: CartItem[];
  paymentMethod: string;
  shippingOption: string;
  status: string;
  subTotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  trackingId?: string;
  createdAt?: string;
  updatedAt?: string;
  trackingStatus?: string;
  deliveryBoyName?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  [key: string]: unknown;
}

// ===================== Review Types =====================

export interface Review {
  _id: string;
  product?: string;
  user?: UserInfo;
  rating: number;
  comment: string;
  createdAt?: string;
  [key: string]: unknown;
}

// ===================== Settings Types =====================

export type TranslationMap = { [lang: string]: string };

export interface SeoSettings {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_url?: string;
  meta_img?: string;
  og_img?: string;
  favicon?: string;
  robots?: string;
  google_verification?: string;
  twitter_handle?: string;
}

export interface FooterBlock {
  [key: string]: unknown;
  block1_status?: boolean;
  block1_title?: TranslationMap;
  block1_sub_title1?: TranslationMap;
  block1_sub_link1?: string;
  block1_sub_title2?: TranslationMap;
  block1_sub_link2?: string;
  block1_sub_title3?: TranslationMap;
  block1_sub_link3?: string;
  block1_sub_title4?: TranslationMap;
  block1_sub_link4?: string;
  block2_status?: boolean;
  block2_title?: TranslationMap;
  block2_sub_title1?: TranslationMap;
  block2_sub_link1?: string;
  block2_sub_title2?: TranslationMap;
  block2_sub_link2?: string;
  block2_sub_title3?: TranslationMap;
  block2_sub_link3?: string;
  block2_sub_title4?: TranslationMap;
  block2_sub_link4?: string;
  block3_status?: boolean;
  block3_title?: TranslationMap;
  block3_sub_title1?: TranslationMap;
  block3_sub_link1?: string;
  block3_sub_title2?: TranslationMap;
  block3_sub_link2?: string;
  block3_sub_title3?: TranslationMap;
  block3_sub_link3?: string;
  block3_sub_title4?: TranslationMap;
  block3_sub_link4?: string;
  block4_status?: boolean;
  block4_logo?: string;
  block4_address?: TranslationMap;
  block4_phone?: string;
  block4_email?: string;
  social_links_status?: boolean;
  social_facebook?: string;
  social_twitter?: string;
  social_pinterest?: string;
  social_linkedin?: string;
  social_whatsapp?: string;
  bottom_contact_status?: boolean;
  bottom_contact?: string;
  payment_method_status?: boolean;
  payment_method_img?: string;
}

export interface NavbarCustomization {
  logo?: string;
  logo_dark?: string;
  categories_menu_status?: boolean;
  about_menu_status?: boolean;
  contact_menu_status?: boolean;
  offers_menu_status?: boolean;
  faq_status?: boolean;
  privacy_policy_status?: boolean;
  term_and_condition_status?: boolean;
  about_us?: TranslationMap;
  contact_us?: TranslationMap;
  pages?: TranslationMap;
  offers?: TranslationMap;
  checkout?: TranslationMap;
  faq?: TranslationMap;
  privacy_policy?: TranslationMap;
  term_and_condition?: TranslationMap;
  [key: string]: unknown;
}

export interface CheckoutCustomization {
  shipping_name_one?: TranslationMap;
  shipping_name_two?: TranslationMap;
  shipping_cost_one?: number;
  shipping_cost_two?: number;
  [key: string]: unknown;
}

export interface BannerItem {
  img?: string;
  title?: TranslationMap;
  description?: TranslationMap;
  button_name?: TranslationMap;
  button_link?: string;
  [key: string]: unknown;
}

export interface AboutUsCustomization {
  header_bg?: string;
  title?: TranslationMap | string;
  top_title?: TranslationMap | string;
  top_description?: TranslationMap | string;
  feature_left_icon_one?: string;
  feature_left_icon_two?: string;
  feature_left_icon_three?: string;
  feature_left_title_one?: TranslationMap | string;
  feature_left_title_two?: TranslationMap | string;
  feature_left_title_three?: TranslationMap | string;
  feature_left_des_one?: TranslationMap | string;
  feature_left_des_two?: TranslationMap | string;
  feature_left_des_three?: TranslationMap | string;
  overview_img?: string;
  overview_description?: TranslationMap | string;
  first_two_col_left_title?: TranslationMap | string;
  first_two_col_left_des?: TranslationMap | string;
  first_two_col_right_img?: string;
  second_two_col_left_img?: string;
  second_two_col_right_title?: TranslationMap | string;
  second_two_col_right_des?: TranslationMap | string;
  card_two_title?: TranslationMap | string;
  card_two_sub?: TranslationMap | string;
  card_two_description?: TranslationMap | string;
  card_one_title?: TranslationMap | string;
  card_one_sub?: TranslationMap | string;
  card_one_description?: TranslationMap | string;
  content_right_img?: string;
  middle_description_one?: TranslationMap | string;
  middle_description_two?: TranslationMap | string;
  content_middle_Img?: string;
  founder_title?: TranslationMap | string;
  founder_description?: TranslationMap | string;
  founder_one_img?: string;
  founder_one_name?: TranslationMap | string;
  founder_one_sub?: TranslationMap | string;
  founder_two_img?: string;
  founder_two_name?: TranslationMap | string;
  founder_two_sub?: TranslationMap | string;
  founder_three_img?: string;
  founder_three_name?: TranslationMap | string;
  founder_three_sub?: TranslationMap | string;
  founder_four_img?: string;
  founder_four_name?: TranslationMap | string;
  founder_four_sub?: TranslationMap | string;
  founder_five_img?: string;
  founder_five_name?: TranslationMap | string;
  founder_five_sub?: TranslationMap | string;
  founder_six_img?: string;
  founder_six_name?: TranslationMap | string;
  founder_six_sub?: TranslationMap | string;
  [key: string]: unknown;
}

export interface ContactUsCustomization {
  header_bg?: string;
  title?: TranslationMap | string;
  primary_number?: string;
  secondary_number?: string;
  email?: string;
  address?: TranslationMap | string;
  opening_time?: TranslationMap | string;
  our_location?: TranslationMap | string;
  country?: string;
  city?: string;
  phone?: string;
  location_map?: string;
  form_title?: TranslationMap | string;
  form_description?: TranslationMap | string;
  email_box_title?: TranslationMap | string;
  email_box_email?: TranslationMap | string;
  email_box_text?: TranslationMap | string;
  call_box_title?: TranslationMap | string;
  call_box_phone?: TranslationMap | string;
  call_box_text?: TranslationMap | string;
  address_box_title?: TranslationMap | string;
  address_box_address_one?: TranslationMap | string;
  address_box_address_two?: TranslationMap | string;
  midLeft_col_img?: string;
  [key: string]: unknown;
}

export interface StoreCustomizationSetting {
  seo?: SeoSettings;
  footer?: FooterBlock;
  navbar?: NavbarCustomization;
  checkout?: CheckoutCustomization;
  banner?: BannerItem[];
  home?: HomeCustomization;
  hero?: Record<string, unknown>;
  feature?: {
    status?: boolean;
    [key: string]: unknown;
  };
  slider?: Record<string, unknown>;
  about_us?: AboutUsCustomization;
  contact_us?: ContactUsCustomization;
  offers?: Record<string, unknown>;
  privacy_policy?: Record<string, unknown>;
  term_and_condition?: Record<string, unknown>;
  faq?: Record<string, unknown>;
  dashboard?: Record<string, unknown>;
  slug?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GlobalSetting {
  shop_name?: string;
  site_description?: string;
  default_currency?: string;
  default_language?: string;
  store_layout?: string;
  copyright_text?: string;
  vat_number?: string;
  company_name?: string;
  address?: string;
  contact?: string;
  email?: string;
  from_email?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  email_to_customer?: boolean;
  favicon?: string;
  logo?: string;
  logo_dark?: string;
  [key: string]: unknown;
}

export interface StoreSetting {
  stripe_key?: string;
  razorpay_id?: string;
  razorpay_secret?: string;
  google_id?: string;
  google_secret?: string;
  github_id?: string;
  github_secret?: string;
  facebook_id?: string;
  facebook_secret?: string;
  fb_pixel_key?: string;
  fb_pixel_status?: boolean;
  [key: string]: unknown;
}

// ===================== Attribute Types =====================

export interface AttributeValue {
  _id?: string;
  name: string;
  value?: string;
}

export interface ProductAttribute {
  _id: string;
  name: string;
  type?: "color" | "size" | "text" | string;
  values: AttributeValue[];
  [key: string]: unknown;
}

export type Attribute = ProductAttribute;

// ===================== Notification Types =====================

export interface Notification {
  _id: string;
  message: string;
  image?: string;
  orderId?: string;
  read?: boolean;
  createdAt?: string;
}

// ===================== Campaign Types =====================

export interface HomeCustomization {
  coupon_status?: boolean;
  featured_status?: boolean;
  daily_needs_status?: boolean;
  slider_width_status?: boolean;
  promotion_banner_status?: boolean;
  delivery_status?: boolean;
  popular_products_status?: boolean;
  used_product_status?: boolean;
  feature_promo_status?: boolean;
  discount_coupon_code?: string[];
  feature_title?: TranslationMap;
  feature_description?: TranslationMap;
  feature_product_limit?: number;
  popular_title?: TranslationMap;
  popular_description?: TranslationMap;
  popular_product_limit?: number;
  used_product_title?: string;
  used_product_description?: string;
  used_product_limit?: number;
  header_bg?: string;
  [key: string]: unknown;
}

export interface Campaign {
  _id: string;
  title?: TranslationMap | string;
  description?: TranslationMap | string;
  image?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  products?: Product[];
  [key: string]: unknown;
}

// ===================== Theme Types =====================

export interface Theme {
  _id: string;
  name?: string;
  slug?: string;
  isDefault?: boolean;
  colors?: Record<string, unknown>;
  darkColors?: Record<string, unknown>;
  sidebar?: Record<string, unknown>;
  sizing?: Record<string, unknown>;
  typography?: Record<string, unknown>;
  borders?: Record<string, unknown>;
  [key: string]: unknown;
}

// ===================== Language Types =====================

export interface Language {
  _id: string;
  name: string;
  iso_code: string;
  flag?: string;
  [key: string]: unknown;
}

// ===================== API Response Types =====================

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// ===================== Filter Types =====================

export interface ProductFilter {
  category?: string;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  attribute?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ===================== Form Types =====================

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  paymentMethod: "Cash" | "Card";
  shippingOption: string;
  password?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  image?: string;
}

export interface ChangePasswordFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface ShippingAddressFormData {
  name: string;
  address: string;
  contact: string;
  country: string;
  city: string;
  area: string;
}

// ===================== Component Prop Types =====================

export interface LayoutProps {
  popularProducts?: Product[];
  usedProducts?: Product[];
  attributes?: ProductAttribute[];
  storeCustomizationSetting?: StoreCustomizationSetting | null;
  storeCustomizationError?: string | null;
  globalSetting?: GlobalSetting | null;
  categories?: Category[];
  featuredCampaign?: Campaign | null;
}

export interface NavbarProps {
  globalSetting?: GlobalSetting | null;
  storeCustomization?: StoreCustomizationSetting | null;
  storeLayout?: string;
}

export interface FooterProps {
  error?: string | null;
  storeCustomizationSetting?: StoreCustomizationSetting | null;
  globalSetting?: GlobalSetting | null;
}

export type StoreLayout = "default" | "modern" | "minimal" | "clothing" | "electronic";
