import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
    currency: Currency;
    symbol: string;
    rate: number;
    setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>('USD');

    const settings = {
        USD: { symbol: '$', rate: 1 },
        EUR: { symbol: '€', rate: 0.92 },
        GBP: { symbol: '£', rate: 0.79 },
    };

    return (
        <CurrencyContext.Provider value={{ 
            currency, 
            setCurrency, 
            symbol: settings[currency].symbol, 
            rate: settings[currency].rate 
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used within Provider");
    return context;
};