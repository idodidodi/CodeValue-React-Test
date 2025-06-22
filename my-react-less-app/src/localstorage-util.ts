import type { ProductData } from "./models";

export const saveToLocalStorage = (key: string, items: any[]): void => {
    localStorage.setItem(key, JSON.stringify(items));
}
export const geProductsFromToLocalStorage = (key: string): ProductData[] => {
    const items = localStorage.getItem(key);
    if (items) {
        return JSON.parse(items);
    }

    return [];
}

export const deleteItemFromStorage = (key: string, id: number): void => {
    const localStorageItems = geProductsFromToLocalStorage(key);
    const idx = localStorageItems.findIndex(lsItem => lsItem.id === id);
    if (idx > -1) {
        localStorageItems[idx].state = "deleted";
    }
    saveToLocalStorage(key, localStorageItems);
}

export const syncToLocalStorage = (key: string, items: ProductData[]): void => {
    const localStorageItems = geProductsFromToLocalStorage(key);
    items.forEach(item => {
        const idx = localStorageItems.findIndex(lsItem => lsItem.id === item.id);
        if (idx === -1) {
            localStorageItems.push(item);
        } else {
            localStorageItems[idx] = item;
        }
    })

    saveToLocalStorage(key, localStorageItems);
}

export const saveItemToLocalStorage = (key: string, itemToSaveOrAdd: ProductData, isNewItem: boolean): void => {
    const localStorageItems = geProductsFromToLocalStorage(key);
    if (isNewItem) {
        localStorageItems.push(itemToSaveOrAdd);
    } else {
        const idx = localStorageItems.findIndex(item => item.id === itemToSaveOrAdd.id);
        if (idx > -1) {
            localStorageItems[idx].description = itemToSaveOrAdd.description;
            localStorageItems[idx].price = itemToSaveOrAdd.price;
            localStorageItems[idx].name = itemToSaveOrAdd.name;
        }
    }

    saveToLocalStorage(key, localStorageItems);
}

