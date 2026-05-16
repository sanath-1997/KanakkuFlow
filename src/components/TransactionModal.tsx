
"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Category, Transaction } from '@/hooks/use-kanakku';
import { translations, type Language } from '@/lib/translations';
import { Plus, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  categories: Category[];
  lang: Language;
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onManageCategories?: () => void;
  currency?: string;
}

export function TransactionModal({ isOpen, onClose, type, categories, lang, onAdd, onManageCategories, currency = '₹' }: TransactionModalProps) {
  const t = translations[lang];
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEmoticon, setSelectedEmoticon] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const filteredCategories = categories.filter(cat => cat.type === type);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setSelectedEmoticon('');
      setDate(new Date());
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) return;
    
    if (!selectedCategory) {
      toast({
        variant: "destructive",
        title: t.error,
        description: t.categoryRequired,
      });
      return;
    }
    
    onAdd({
      amount: parseFloat(amount),
      description: description.trim(),
      category: selectedCategory,
      emoticon: selectedEmoticon || '💰',
      type,
      date: date.toISOString()
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
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.description}</Label>
              <Input 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="h-14 rounded-2xl bg-muted/30 border-none shadow-inner font-medium transition-all focus:bg-white focus:shadow-md"
                placeholder="e.g. Starbucks Coffee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.amount}</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-headline font-bold">{currency}</span>
                <Input 
                  id="amount" 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="pl-10 h-14 rounded-2xl bg-muted/30 border-none shadow-inner font-headline text-xl font-bold transition-all focus:bg-white focus:shadow-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.date}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-14 rounded-2xl bg-muted/30 border-none shadow-inner text-left font-normal justify-start px-4 transition-all focus:bg-white focus:shadow-md",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {date ? format(date, "PPP") : <span>{t.date}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-none overflow-hidden" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.category}</Label>
              <Select value={selectedCategory} onValueChange={(val) => {
                setSelectedCategory(val);
                const cat = categories.find(c => c.name === val);
                if (cat) setSelectedEmoticon(cat.emoticon);
              }}>
                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none shadow-inner transition-all focus:bg-white focus:shadow-md">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  {filteredCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name} className="rounded-xl m-1 h-10 cursor-pointer">
                      <span className="mr-2 text-lg">{cat.emoticon}</span> {cat.name}
                    </SelectItem>
                  ))}
                  {onManageCategories && (
                    <div className="p-2 border-t mt-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full justify-start gap-2 h-10 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageCategories();
                          onClose();
                        }}
                      >
                        <Plus className="w-4 h-4" /> {t.addCategory}
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
