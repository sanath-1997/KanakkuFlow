
import { useState, useEffect, useMemo } from 'react';
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
  { id: 'i2', name: 'Freelance', emoticon: '👨‍💻', type: 'income' },
  { id: 'i3', name: 'Business Profit', emoticon: '🏢', type: 'income' },
  { id: 'i4', name: 'Investment Returns', emoticon: '📈', type: 'income' },
  { id: 'i5', name: 'Rental Income', emoticon: '🏠', type: 'income' },
  { id: 'i6', name: 'Gift Money', emoticon: '🎁', type: 'income' },
  { id: 'i7', name: 'Bonus', emoticon: '✨', type: 'income' },
  { id: 'i8', name: 'Sale of Assets', emoticon: '🏷️', type: 'income' },
  { id: 'i9', name: 'Dividends', emoticon: '📊', type: 'income' },
  { id: 'i10', name: 'Cashback', emoticon: '🧧', type: 'income' },

  // Expense
  { id: 'e1', name: 'Food & Dining', emoticon: '🍔', type: 'expense' },
  { id: 'e2', name: 'Groceries', emoticon: '🛒', type: 'expense' },
  { id: 'e3', name: 'Rent & Housing', emoticon: '🏠', type: 'expense' },
  { id: 'e4', name: 'Utilities & Bills', emoticon: '💡', type: 'expense' },
  { id: 'e5', name: 'Transportation', emoticon: '🚗', type: 'expense' },
  { id: 'e6', name: 'Shopping & Fashion', emoticon: '🛍️', type: 'expense' },
  { id: 'e7', name: 'Health & Medical', emoticon: '🏥', type: 'expense' },
  { id: 'e8', name: 'Education', emoticon: '📚', type: 'expense' },
  { id: 'e9', name: 'Entertainment', emoticon: '🎮', type: 'expense' },
  { id: 'e10', name: 'Travel & Vacation', emoticon: '✈️', type: 'expense' },
  { id: 'e11', name: 'Insurance', emoticon: '🛡️', type: 'expense' },
  { id: 'e12', name: 'Subscriptions', emoticon: '💳', type: 'expense' },
  { id: 'e13', name: 'Personal Care', emoticon: '✂️', type: 'expense' },
  { id: 'e14', name: 'Fitness & Sports', emoticon: '🏋️', type: 'expense' },
  { id: 'e15', name: 'Maintenance & Repairs', emoticon: '🔧', type: 'expense' },
  { id: 'e16', name: 'Gifts & Charity', emoticon: '💝', type: 'expense' },
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
        // Ensure that even if empty or corrupted, we have a list of categories
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

  const balance = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
    }, 0);
  }, [transactions]);

  const todayExpenses = useMemo(() => {
    if (!isHydrated) return 0;
    const now = new Date();
    return transactions
      .filter(tx => {
        if (tx.type !== 'expense') return false;
        try {
          const txDate = new Date(tx.date);
          return isSameDay(txDate, now);
        } catch {
          return false;
        }
      })
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions, isHydrated]);

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
