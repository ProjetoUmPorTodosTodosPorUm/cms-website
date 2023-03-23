import { BaseStore } from '$lib/store/base';
import { saveToLocalStorage, getFromLocalStorage, delay } from '$lib/utils/functions';
import type { SettingsStore as SettingsStoreType } from '$lib/types'
import { browser } from '$app/environment';
import type { Locales } from '$src/i18n/i18n-types';

export class SettingsStore extends BaseStore<SettingsStoreType> {
    static storeDefault = {
        language: 'en',
        isReady: false
    } as SettingsStoreType;

    constructor() {
        super(SettingsStore.storeDefault);
        this.init();
    }

    async init() {
        const language = getFromLocalStorage('settings.language') || 'en';
        this.updateLanguage(language);

        this.store.update(data => ({
            ...data,
            isReady: true
        }));
    }

    updateLanguage(language: Locales) {
        this.store.update(data => ({
            ...data,
            language: language ?? 'pt-BR'
        }));
        saveToLocalStorage('settings.language', language ?? 'pt-BR');
    }
}