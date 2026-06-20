import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import ModelsNBService from "../pages/_services/models-nb";

const baseUrl = atom("");

export const getBaseUrl = () => {
  return baseUrl.get();
};

export const useModelsNBStore = () => {
  const baseUrlValue = useStore(baseUrl);
  function setBaseUrl(value: string) {
    baseUrl.set(value);
    ModelsNBService.healthCheck();
  }
  return { baseUrlValue, setBaseUrl };
};
