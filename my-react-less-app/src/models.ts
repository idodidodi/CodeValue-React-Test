type ProductState = 'approved' | 'pending' | 'deleted'; 

export type SortBy = "recent" | "name"

export interface ProductData {
    id: number;
    name: string;
    price: number;
    creationDate: Date;
    state: ProductState;
    description?: string;
}

export interface SortByOption {
    name: string;
    sortType: SortBy;
}