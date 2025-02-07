import IProduct from "./IProduct";

interface IProductSold extends IProduct {
    quantity: number,
    total: number
};

export default IProductSold;