
import { useState, useEffect } from 'react';
import type { Language } from '@/lib/translations';
import { isSameDay } from 'date-fns';

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
  // Income
  { id: 'i1', name: 'Salary', emoticon: '💰', type: 'income' },
  { id: 'i2', name: 'Business Profit', emoticon: '🏢', type: 'income' },
  { id: 'i3', name: 'Freelance', emoticon: '👨‍💻', type: 'income' },
  { id: 'i4', name: 'Dividends', emoticon: '📈', type: 'income' },
  { id: 'i5', name: 'Rent Income', emoticon: '🏠', type: 'income' },
  { id: 'i6', name: 'Investment Returns', emoticon: '📊', type: 'income' },
  { id: 'i7', name: 'Gift Income', emoticon: '🎁', type: 'income' },
  { id: 'i8', name: 'Commission', emoticon: '💸', type: 'income' },
  { id: 'i9', name: 'Bonus', emoticon: '✨', type: 'income' },
  { id: 'i10', name: 'Others', emoticon: '💵', type: 'income' },

  // Expense
  { id: 'e1', name: 'Food & Dining', emoticon: '🍔', type: 'expense' },
  { id: 'e2', name: 'Groceries', emoticon: '🛒', type: 'expense' },
  { id: 'e3', name: 'Transportation', emoticon: '🚗', type: 'expense' },
  { id: 'e4', name: 'Rent & Housing', emoticon: '🏠', type: 'expense' },
  { id: 'e5', name: 'Electricity Bill', emoticon: '💡', type: 'expense' },
  { id: 'e6', name: 'Water Bill', emoticon: '🚰', type: 'expense' },
  { id: 'e7', name: 'Internet & Mobile', emoticon: '📶', type: 'expense' },
  { id: 'e8', name: 'Shopping', emoticon: '🛍️', type: 'expense' },
  { id: 'e9', name: 'Healthcare', emoticon: '🏥', type: 'expense' },
  { id: 'e10', name: 'Education', emoticon: '📚', type: 'expense' },
  { id: 'e11', name: 'Entertainment', emoticon: '🎮', type: 'expense' },
  { id: 'e12', name: 'Travel', emoticon: '✈️', type: 'expense' },
  { id: 'e13', name: 'Subscriptions', emoticon: '💳', type: 'expense' },
  { id: 'e14', name: 'Insurance', emoticon: '🛡️', type: 'expense' },
  { id: 'e15', name: 'Gifts & Charity', emoticon: '💝', type: 'expense' },
  { id: 'e16', name: 'Maintenance', emoticon: '🔧', type: 'expense' },
  { id: 'e17', name: 'Others', emoticon: '📦', type: 'expense' },
];

export function useKanakku() {
  const [lang, setLang] = useState<Language | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [budget, setBudget] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('₹');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initial load from LocalStorage
    const storedLang = localStorage.getItem('kanakku-lang') as Language;
    const storedTransactions = localStorage.getItem('kanakku-txs');
    const storedCategories = localStorage.getItem('kanakku-cats');
    const storedBudget = localStorage.getItem('kanakku-budget');
    const storedDailyLimit = localStorage.getItem('kanakku-daily-limit');
    const storedCurrency = localStorage.getItem('kanakku-currency');

    if (storedLang) setLang(storedLang);
    if (storedBudget) setBudget(parseFloat(storedBudget));
    if (storedDailyLimit) setDailyLimit(parseFloat(storedDailyLimit));
    if (storedCurrency) setCurrency(storedCurrency);
    
    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (e) {
        setTransactions([]);
      }
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
      localStorage.setItem('kanakku-daily-limit', dailyLimit.toString());
      localStorage.setItem('kanakku-currency', currency);
    }
  }, [lang, transactions, categories, budget, dailyLimit, currency, isHydrated]);

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
    setDailyLimit(0);
    localStorage.removeItem('kanakku-txs');
    localStorage.removeItem('kanakku-cats');
    localStorage.removeItem('kanakku-budget');
    localStorage.removeItem('kanakku-daily-limit');
  };

  const balance = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const todayExpenses = transactions
    .filter(tx => tx.type === 'expense' && isSameDay(new Date(tx.date), new Date()))
    .reduce((acc, tx) => acc + tx.amount, 0);

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
    dailyLimit,
    setDailyLimit,
    todayExpenses,
    currency,
    setCurrency,
    isHydrated
  };
}
