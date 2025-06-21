import type { ProductData } from "./models";

export const saveToLocalStorage = (key: string, items: any[]):void=>{
    localStorage.setItem(key, JSON.stringify(items));
}
export const geProductsFromToLocalStorage = (key: string):ProductData[]=>{
    const items = localStorage.getItem(key);
    if (items) {
        console.log(JSON.parse(items));
        return JSON.parse(items);
    }

    return [];
}