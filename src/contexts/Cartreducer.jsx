
export const totalItem = (cart) => {
    return cart.reduce((sum, product) => sum + product.quantity, 0);
}

export const totalPrice = (cart) => {
    return cart.reduce((total, product) => total + product.quantity * product.price, 0);
}

const Cartreducer = (state, action) => {
    switch (action.type) {
        case "SetCart":
            return action.payload;
        case "Add":
            const exists = state.some(p => p.pid === action.product.pid);
            if (exists) return state;
            return [...state, action.product];
        case "Remove":
            return state.filter(p => p.productId !== action.id)
        case "Increase":
            return state.map(p =>
                p.productId === action.id ? { ...p, quantity: p.quantity + 1 } : p
            );

        case "Decrease":
            return state.map(p =>
                p.productId === action.id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
            );
        default:
            return state;
    }
}
export default Cartreducer;