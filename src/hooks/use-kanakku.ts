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
  // Common Expenses
  { id: 'e1', name: 'Food', emoticon: '🍔', type: 'expense' },
  { id: 'e2', name: 'Groceries', emoticon: '🛒', type: 'expense' },
  { id: 'e3', name: 'Rent', emoticon: '🏠', type: 'expense' },
  { id: 'e4', name: 'Transport', emoticon: '🚗', type: 'expense' },
  { id: 'e5', name: 'Utilities', emoticon: '💡', type: 'expense' },
  { id: 'e6', name: 'Shopping', emoticon: '🛍️', type: 'expense' },
  { id: 'e7', name: 'Health', emoticon: '🏥', type: 'expense' },
  { id: 'e8', name: 'Other', emoticon: '📦', type: 'expense' },
  
  // Common Income
  { id: 'i1', name: 'Salary', emoticon: '💰', type: 'income' },
  { id: 'i2', name: 'Freelance', emoticon: '👨‍💻', type: 'income' },
  { id: 'i3', name: 'Investments', emoticon: '📈', type: 'income' },
  { id: 'i4', name: 'Bonus', emoticon: '🎁', type: 'income' },
  { id: 'i5', name: 'Gift', emoticon: '🧧', type: 'income' },
  { id: 'i6', name: 'Other', emoticon: '💵', type: 'income' },
];

export function useKanakku() {
  const [lang, setLang] = useState<Language | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('kanakku-lang') as Language;
    const storedTransactions = localStorage.getItem('kanakku-txs');
    const storedCategories = localStorage.getItem('kanakku-cats');

    if (storedLang) setLang(storedLang);
    
    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (e) {
        console.error("Failed to parse transactions", e);
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
        console.error("Failed to parse categories", e);
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
    }
  }, [lang, transactions, categories, isHydrated]);

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
    setCategories(prev => [...prev, { ...cat, id: newId }]);
  };

  const removeCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
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
    balance,
    isHydrated
  };
}
