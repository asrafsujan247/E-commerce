import dayjs from "dayjs";
import { useSetting } from "@stores/useSettingStore";
import {
  formatPrice as formatPriceFn,
  formatNumber as formatNumberFn,
} from "@utils/currencyFormat";

interface UseUtilsFunctionReturn {
  currency: string;
  getNumber: (value?: number) => number;
  getNumberTwo: (value?: number) => string;
  formatPrice: (value: number, customCurrency?: string) => string;
  formatNumber: (value: number) => string;
  showTimeFormat: (data: string | Date, timeFormat: string) => string;
  showDateFormat: (data: string | Date) => string;
  showDateTimeFormat: (data: string | Date, date: string, time: string) => string;
  showingImage: (data: string | undefined) => string | undefined | false;
  showingUrl: (data: string | undefined) => string;
}

const useUtilsFunction = (): UseUtilsFunctionReturn => {
  const settingCtx = useSetting();
  const globalSetting = settingCtx?.globalSetting;
  const currency = globalSetting?.default_currency ?? "$";
  const lang = "en";

  const showTimeFormat = (data: string | Date, timeFormat: string): string =>
    dayjs(data).format(timeFormat);

  const showDateFormat = (data: string | Date): string =>
    dayjs(data).format("DD MMM, YYYY, h:aa A");

  const showDateTimeFormat = (
    data: string | Date,
    date: string,
    time: string
  ): string => dayjs(data).format(`${date} ${time}`);

  const getNumber = (value = 0): number =>
    Number(parseFloat(String(value || 0)).toFixed(2));

  const getNumberTwo = (value = 0): string =>
    parseFloat(String(value || 0)).toFixed(2);

  const formatPrice = (value: number, customCurrency?: string): string =>
    formatPriceFn(value, customCurrency ?? currency, lang);

  const formatNumber = (value: number): string => formatNumberFn(value, lang);

  const showingImage = (
    data: string | undefined
  ): string | undefined | false => data !== undefined && data;

  const showingUrl = (data: string | undefined): string =>
    data !== undefined ? data : "!#";

  return {
    currency,
    getNumber,
    getNumberTwo,
    formatPrice,
    formatNumber,
    showTimeFormat,
    showDateFormat,
    showingImage,
    showingUrl,
    showDateTimeFormat,
  };
};

export default useUtilsFunction;
