import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStorage } from './storage';

/** Único acceso al proveedor; nunca registrar valores guardados ni excepciones con datos. */
export const localStorage = createStorage(AsyncStorage, issue => {
  if (__DEV__) console.warn(`[storage] ${issue}: preferencias locales no disponibles o inválidas; se usan valores en memoria.`);
});
