import React, { useEffect } from "react";
import { create } from "zustand";
import type {
  GlobalSetting,
  StoreSetting,
  StoreCustomizationSetting,
} from "@appTypes/index";

interface SettingState {
  globalSetting: GlobalSetting | null;
  storeSetting: StoreSetting | null;
  storeCustomization: StoreCustomizationSetting | null;
  setGlobalSetting: (setting: GlobalSetting | null) => void;
  setStoreSetting: (setting: StoreSetting | null) => void;
  setStoreCustomization: (setting: StoreCustomizationSetting | null) => void;
}

export const useSettingStore = create<SettingState>((set) => ({
  globalSetting: null,
  storeSetting: null,
  storeCustomization: null,
  setGlobalSetting: (globalSetting) => set({ globalSetting }),
  setStoreSetting: (storeSetting) => set({ storeSetting }),
  setStoreCustomization: (storeCustomization) => set({ storeCustomization }),
}));

export const useSetting = useSettingStore;

interface SettingProviderProps {
  initialStoreSetting: StoreSetting | null;
  initialGlobalSetting: GlobalSetting | null;
  initialCustomizationSetting: StoreCustomizationSetting | null;
  children: React.ReactNode;
}

export function SettingProvider({
  initialGlobalSetting,
  initialStoreSetting,
  initialCustomizationSetting,
  children,
}: SettingProviderProps): React.ReactElement {
  const { setGlobalSetting, setStoreSetting, setStoreCustomization } =
    useSettingStore();

  useEffect(() => {
    setGlobalSetting(initialGlobalSetting ?? null);
    setStoreSetting(initialStoreSetting ?? null);
    setStoreCustomization(initialCustomizationSetting ?? null);
  }, [
    initialGlobalSetting,
    initialStoreSetting,
    initialCustomizationSetting,
    setGlobalSetting,
    setStoreSetting,
    setStoreCustomization,
  ]);

  return React.createElement(React.Fragment, null, children);
}
