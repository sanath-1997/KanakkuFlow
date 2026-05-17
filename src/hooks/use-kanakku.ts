import { useState, useEffect } from 'react';
import type { Language } from '@/lib/translations';

export interface Category {
  id: string;
  name: string;
  emoticon: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  emoticon: string;
  type: 'income' | 'expense';
  date: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  // Expense Categories
  { id: 'e1', name: 'Food & Dining', emoticon: '🍔', type: 'expense' },
  { id: 'e2', name: 'Groceries', emoticon: '🛒', type: 'expense' },
  { id: 'e3', name: 'Housing & Rent', emoticon: '🏠', type: 'expense' },
  { id: 'e4', name: 'Transportation', emoticon: '🚗', type: 'expense' },
  { id: 'e5', name: 'Electricity & Water', emoticon: '💡', type: 'expense' },
  { id: 'e6', name: 'Mobile & Internet', emoticon: '📱', type: 'expense' },
  { id: 'e7', name: 'Shopping', emoticon: '🛍️', type: 'expense' },
  { id: 'e8', name: 'Health & Medical', emoticon: '🏥', type: 'expense' },
  { id: 'e9', name: 'Education', emoticon: '🎓', type: 'expense' },
  { id: 'e10', name: 'Entertainment', emoticon: '🎬', type: 'expense' },
  { id: 'e11', name: 'Travel & Trips', emoticon: '✈️', type: 'expense' },
  { id: 'e12', name: 'Insurance', emoticon: '🛡️', type: 'expense' },
  { id: 'e13', name: 'Home Maintenance', emoticon: '🛠️', type: 'expense' },
  { id: 'e14', name: 'Others', emoticon: '📦', type: 'expense' },
  
  // Income Categories
  { id: 'i1', name: 'Monthly Salary', emoticon: '💰', type: 'income' },
  { id: 'i2', name: 'Business Profit', emoticon: '🏢', type: 'income' },
  { id: 'i3', name: 'Freelance Work', emoticon: '👨‍💻', type: 'income' },
  { id: 'i4', name: 'Stock Dividends', emoticon: '📈', type: 'income' },
  { id: 'i5', name: 'Rental Income', emoticon: '🏘️', type: 'income' },
  { id: 'i6', name: 'Interest Earned', emoticon: '🏦', type: 'income' },
  { id: 'i7', name: 'Gifts & Awards', emoticon: '🎁', type: 'income' },
  { id: 'i8', name: 'Refunds', emoticon: '🔄', type: 'income' },
  { id: 'i9', name: 'Other Income', emoticon: '💵', type: 'income' },
];

export function useKanakku() {
  const [lang, setLang] = useState<Language | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [budget, setBudget] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('₹');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initial load from LocalStorage
    const storedLang = localStorage.getItem('kanakku-lang') as Language;
    const storedTransactions = localStorage.getItem('kanakku-txs');
    const storedCategories = localStorage.getItem('kanakku-cats');
    const storedBudget = localStorage.getItem('kanakku-budget');
    const storedCurrency = localStorage.getItem('kanakku-currency');

    if (storedLang) setLang(storedLang);
    if (storedBudget) setBudget(parseFloat(storedBudget));
    if (storedCurrency) setCurrency(storedCurrency);
    
    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (e) {}
    }
    
    if (storedCategories) {
      try {
        const parsed = JSON.parse(storedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
    
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (lang) localStorage.setItem('kanakku-lang', lang);
      localStorage.setItem('kanakku-txs', JSON.stringify(transactions));
      localStorage.setItem('kanakku-cats', JSON.stringify(categories));
      localStorage.setItem('kanakku-budget', budget.toString());
      localStorage.setItem('kanakku-currency', currency);
    }
  }, [lang, transactions, categories, budget, currency, isHydrated]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newId = Math.random().toString(36).substring(2, 11);
    const newTx = { ...tx, id: newId };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newId = Math.random().toString(36).substring(2, 11);
    setCategories(prev => {
      const exists = prev.find(c => c.name.toLowerCase() === cat.name.toLowerCase() && c.type === cat.type);
      if (exists) return prev;
      return [...prev, { ...cat, id: newId }];
    });
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const clearAllData = () => {
    setTransactions([]);
    setCategories(DEFAULT_CATEGORIES);
    setBudget(0);
    localStorage.removeItem('kanakku-txs');
    localStorage.removeItem('kanakku-cats');
    localStorage.removeItem('kanakku-budget');
  };

  const balance = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  return {
    lang,
    setLang,
    transactions,
    addTransaction,
    deleteTransaction,
    categories,
    addCategory,
    removeCategory,
    clearAllData,
    balance,
    budget,
    setBudget,
    currency,
    setCurrency,
    isHydrated
  };
}
