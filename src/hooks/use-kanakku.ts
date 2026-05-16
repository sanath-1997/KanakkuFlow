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
  // Expenses
  { id: 'e1', name: 'Food', emoticon: '🍔', type: 'expense' },
  { id: 'e2', name: 'Groceries', emoticon: '🛒', type: 'expense' },
  { id: 'e3', name: 'Rent', emoticon: '🏠', type: 'expense' },
  { id: 'e4', name: 'Transport', emoticon: '🚗', type: 'expense' },
  { id: 'e5', name: 'Utilities', emoticon: '💡', type: 'expense' },
  { id: 'e6', name: 'Shopping', emoticon: '🛍️', type: 'expense' },
  { id: 'e7', name: 'Health', emoticon: '🏥', type: 'expense' },
  { id: 'e8', name: 'Dining Out', emoticon: '🍕', type: 'expense' },
  { id: 'e9', name: 'Entertainment', emoticon: '🎭', type: 'expense' },
  { id: 'e10', name: 'Education', emoticon: '🎓', type: 'expense' },
  { id: 'e11', name: 'Travel', emoticon: '✈️', type: 'expense' },
  { id: 'e12', name: 'Subscriptions', emoticon: '💻', type: 'expense' },
  
  // Income
  { id: 'i1', name: 'Salary', emoticon: '💰', type: 'income' },
  { id: 'i2', name: 'Freelance', emoticon: '👨‍💻', type: 'income' },
  { id: 'i3', name: 'Bonus', emoticon: '🎁', type: 'income' },
  { id: 'i4', name: 'Investment', emoticon: '📈', type: 'income' },
  { id: 'i5', name: 'Gift', emoticon: '🧧', type: 'income' },
  { id: 'i6', name: 'Interest', emoticon: '🏦', type: 'income' },
  { id: 'i7', name: 'Rental Income', emoticon: '🏘️', type: 'income' },
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
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    
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
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...cat, id: Math.random().toString(36).substr(2, 9) }]);
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