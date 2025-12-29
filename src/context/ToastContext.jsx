import React, { createContext, useContext } from 'react';
import { toast } from 'sonner';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    // We expose the raw sonner toast function, but wrapped in valid context 
    // if we wanted to abstract it later. For now, direct access is fine 
    // but using context allows us to mock or swap implementations easily.
    const showToast = {
        success: (message) => toast.success(message),
        error: (message) => toast.error(message),
        info: (message) => toast.info(message),
        warning: (message) => toast.warning(message),
        loading: (message) => toast.loading(message),
        dismiss: (id) => toast.dismiss(id),
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
