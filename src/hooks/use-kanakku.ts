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
  description: string;
  category: string;
  emoticon: string;
  type: 'income' | 'expense';
  date: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', emoticon: '🍔', type: 'expense' },
  { id: '2', name: 'Rent', emoticon: '🏠', type: 'expense' },
  { id: '3', name: 'Transport', emoticon: '🚗', type: 'expense' },
  { id: '4', name: 'Utilities', emoticon: '💡', type: 'expense' },
  { id: '5', name: 'Entertainment', emoticon: '🎭', type: 'expense' },
  { id: '6', name: 'Salary', emoticon: '💰', type: 'income' },
  { id: '7', name: 'Bonus', emoticon: '🎁', type: 'income' },
  { id: '8', name: 'Investment', emoticon: '📈', type: 'income' },
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
