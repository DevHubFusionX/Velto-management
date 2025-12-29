export const formatCurrency = (amount, currency = 'NGN') => {
    const formatter = new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const cn = (...inputs) => {
    // Already defined but moving here or importing for consistency
    return inputs.filter(Boolean).join(' ');
};
