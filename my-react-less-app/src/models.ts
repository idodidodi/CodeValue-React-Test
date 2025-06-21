type ProductState = 'approved' | 'pending' | 'deleted'; 
export interface ProductData {
    id: number;
    name: string;
    price: number;
    creationDate: Date;
    state: ProductState;
    description?: string;
}