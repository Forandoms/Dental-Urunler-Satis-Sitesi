import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'SET_ORDER_SUBMITTING':
      return {
        ...state,
        isOrderSubmitting: action.payload
      };
    
    case 'SET_LAST_ORDER_TIME':
      return {
        ...state,
        lastOrderTime: action.payload
      };
    
    default:
      return state;
  }
};

const initialState = {
  items: [],
  isOrderSubmitting: false,
  lastOrderTime: typeof window !== 'undefined' ? localStorage.getItem('lastOrderTime') : null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setOrderSubmitting = (isSubmitting) => {
    dispatch({ type: 'SET_ORDER_SUBMITTING', payload: isSubmitting });
  };

  const setLastOrderTime = (time) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastOrderTime', time);
    }
    dispatch({ type: 'SET_LAST_ORDER_TIME', payload: time });
  };

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    items: state.items,
    totalItems,
    totalPrice,
    isOrderSubmitting: state.isOrderSubmitting,
    lastOrderTime: state.lastOrderTime,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setOrderSubmitting,
    setLastOrderTime
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

