import { useState, useEffect } from 'react';
import type { Language } from '@/lib/translations';

export interface Category {
  id: string;
  name: string;
  emoticon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  emoticon: string;
  type: 'income' | 'expense';
  date: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', emoticon: '🍔' },
  { id: '2', name: 'Rent', emoticon: '🏠' },
  { id: '3', name: 'Transport', emoticon: '🚗' },
  { id: '4', name: 'Salary', emoticon: '💰' },
  { id: '5', name: 'Utilities', emoticon: '💡' },
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
