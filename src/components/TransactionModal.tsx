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
import { Sparkles, Loader2, Tag } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  categories: Category[];
  lang: Language;
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onManageCategories?: () => void;
}

export function TransactionModal({ isOpen, onClose, type, categories, lang, onAdd, onManageCategories }: TransactionModalProps) {
  const t = translations[lang];
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEmoticon, setSelectedEmoticon] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Filter categories by type
  const filteredCategories = categories.filter(cat => cat.type === type);

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
        // We only use the AI suggestion if the category makes sense for the type, 
        // or we just set the description-based category and emoticon.
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
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className={`text-3xl font-headline font-bold mb-4 ${type === 'income' ? 'text-income' : 'text-expense'}`}>
            {type === 'income' ? t.income : t.expense}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.description}</Label>
            <div className="relative group">
              <Input 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="pr-12 h-14 rounded-2xl bg-muted/30 border-none shadow-inner text-base font-medium transition-all focus:bg-white focus:shadow-md"
                placeholder="Ex: Weekly Groceries"
              />
              <button
                type="button"
                onClick={handleAISuggestion}
                disabled={!description || isSuggesting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl hover:bg-primary/10 text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                title="AI Suggest Category"
              >
                {isSuggesting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.amount}</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-headline font-bold">₹</span>
                <Input 
                  id="amount" 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="pl-8 h-14 rounded-2xl bg-muted/30 border-none shadow-inner font-headline text-xl font-bold transition-all focus:bg-white focus:shadow-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.category}</Label>
              <Select value={selectedCategory} onValueChange={(val) => {
                setSelectedCategory(val);
                const cat = categories.find(c => c.name === val);
                if (cat) setSelectedEmoticon(cat.emoticon);
              }}>
                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none shadow-inner transition-all focus:bg-white focus:shadow-md">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  {filteredCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name} className="rounded-xl m-1 h-10">
                      <span className="mr-2 text-lg">{cat.emoticon}</span> {cat.name}
                    </SelectItem>
                  ))}
                  {/* Dynamic Category from AI if it doesn't exist */}
                  {selectedCategory && !filteredCategories.find(c => c.name === selectedCategory) && (
                    <SelectItem value={selectedCategory} className="rounded-xl m-1 h-10 bg-primary/5">
                      <span className="mr-2 text-lg">{selectedEmoticon}</span> {selectedCategory} (AI)
                    </SelectItem>
                  )}
                  {onManageCategories && (
                    <div className="p-2 border-t mt-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full justify-start gap-2 h-10 rounded-xl text-primary hover:text-primary hover:bg-primary/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageCategories();
                          onClose();
                        }}
                      >
                        <Tag className="w-4 h-4" /> {t.manageCategories}
                      </Button>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-14 rounded-2xl text-base font-headline hover:bg-muted/50 transition-all">
              {t.cancel}
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 h-14 rounded-2xl text-base font-headline font-bold shadow-lg transition-all active:scale-95 ${type === 'income' ? 'bg-income hover:bg-income/90 shadow-income/20' : 'bg-expense hover:bg-expense/90 shadow-expense/20'}`}
            >
              {t.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
