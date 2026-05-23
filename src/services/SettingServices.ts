import type {
  GlobalSetting,
  Language,
  StoreSetting,
  StoreCustomizationSetting,
} from "@appTypes/index";
import globalSettingData from "@localdata/settings-global.json";
import customizationData from "@localdata/settings-customization.json";

const defaultStoreSettings: StoreSetting = {
  cod_status: false,
  stripe_status: false,
  razorpay_status: false,
};

interface StoreCustomizationResult {
  storeCustomizationSetting?: StoreCustomizationSetting;
  error?: string;
}

interface GlobalSettingResult {
  globalSetting?: GlobalSetting;
  error?: string;
}

interface LanguagesResult {
  languages?: Language[];
  error?: string;
}

interface StoreSettingResult {
  storeSetting?: StoreSetting;
  error?: string;
}

interface SeoSettingResult {
  seoSetting?: unknown;
  error?: string;
}

const getStoreCustomizationSetting = async (): Promise<StoreCustomizationResult> => {
  return { storeCustomizationSetting: customizationData as unknown as StoreCustomizationSetting };
};

const getGlobalSetting = async (): Promise<GlobalSettingResult> => {
  return { globalSetting: globalSettingData as unknown as GlobalSetting };
};

const getShowingLanguage = async (): Promise<LanguagesResult> => {
  return { languages: [] };
};

const getStoreSetting = async (): Promise<StoreSettingResult> => {
  return { storeSetting: defaultStoreSettings as unknown as StoreSetting };
};

const getStoreSecretKeys = async (): Promise<StoreSettingResult> => {
  return { storeSetting: defaultStoreSettings as unknown as StoreSetting };
};

const getStoreSeoSetting = async (): Promise<SeoSettingResult> => {
  return { seoSetting: {} };
};

export {
  getGlobalSetting,
  getShowingLanguage,
  getStoreSetting,
  getStoreSeoSetting,
  getStoreSecretKeys,
  getStoreCustomizationSetting,
};
