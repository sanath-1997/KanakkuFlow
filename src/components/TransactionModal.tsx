"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { suggestTransactionCategory } from '@/ai/flows/transaction-category-suggestion';
import type { Category, Transaction } from '@/hooks/use-kanakku';
import { translations, type Language } from '@/lib/translations';
import { Sparkles, Loader2 } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  categories: Category[];
  lang: Language;
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
}

export function TransactionModal({ isOpen, onClose, type, categories, lang, onAdd }: TransactionModalProps) {
  const t = translations[lang];
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEmoticon, setSelectedEmoticon] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Auto-reset when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setSelectedCategory('');
      setSelectedEmoticon('');
    }
  }, [isOpen]);

  const handleAISuggestion = async () => {
    if (!description || isSuggesting) return;
    setIsSuggesting(true);
    try {
      const result = await suggestTransactionCategory({ description });
      if (result) {
        setSelectedCategory(result.category);
        setSelectedEmoticon(result.emoticon);
      }
    } catch (err) {
      console.error("AI suggestion failed", err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !selectedCategory) return;
    
    onAdd({
      description,
      amount: parseFloat(amount),
      category: selectedCategory,
      emoticon: selectedEmoticon || '💰',
      type,
      date: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className={`text-2xl font-headline ${type === 'income' ? 'text-income' : 'text-expense'}`}>
            {type === 'income' ? t.income : t.expense}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.description}</Label>
            <div className="relative">
              <Input 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="pr-10 rounded-xl"
                placeholder="Ex: Weekly Groceries"
              />
              <button
                type="button"
                onClick={handleAISuggestion}
                disabled={!description || isSuggesting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-primary/10 text-primary disabled:opacity-30"
                title="AI Suggest Category"
              >
                {isSuggesting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.amount}</Label>
              <Input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="rounded-xl font-headline text-lg"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.category}</Label>
              <Select value={selectedCategory} onValueChange={(val) => {
                setSelectedCategory(val);
                const cat = categories.find(c => c.name === val);
                if (cat) setSelectedEmoticon(cat.emoticon);
              }}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <span className="mr-2">{cat.emoticon}</span> {cat.name}
                    </SelectItem>
                  ))}
                  {/* Dynamic Category from AI if it doesn't exist */}
                  {selectedCategory && !categories.find(c => c.name === selectedCategory) && (
                    <SelectItem value={selectedCategory}>
                      <span className="mr-2">{selectedEmoticon}</span> {selectedCategory}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-xl">
              {t.cancel}
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 rounded-xl ${type === 'income' ? 'bg-income hover:bg-income/90' : 'bg-expense hover:bg-expense/90'}`}
            >
              {t.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
