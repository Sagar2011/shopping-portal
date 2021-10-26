export interface ItemModel {
    ID: number | 0,
    Name: string | '',
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: string
}

export interface OrderModel {
    ID: number | 0,
    Cart_id: any,
    User_id: any,
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: string
}