
"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { translations, type Language } from '@/lib/translations';
import { Trash2, Tag, TrendingUp, TrendingDown, Plus, Check } from 'lucide-react';
import type { Category } from '@/hooks/use-kanakku';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryStudioProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  lang: Language;
  onAdd: (cat: Omit<Category, 'id'>) => void;
  onRemove: (id: string) => void;
  mode?: 'income' | 'expense' | 'all';
}

const COMMON_EMOJIS = ['🍔', '🛒', '🏠', '🚗', '💡', '🛍️', '🏥', '📦', '💰', '👨‍💻', '📈', '🎁', '🧧', '💵', '🍕', '💻', '🍿'];

export function CategoryStudio({ isOpen, onClose, categories, lang, onAdd, onRemove, mode = 'all' }: CategoryStudioProps) {
  const t = translations[lang];
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('📦');
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');

  // Sync activeTab with forced mode when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'income') setActiveTab('income');
      else if (mode === 'expense') setActiveTab('expense');
    }
  }, [isOpen, mode]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd({ 
      name: newName.trim(), 
      emoticon: newEmoji, 
      type: activeTab 
    });
    setNewName('');
    setNewEmoji('📦');
  };

  const filteredCategories = categories.filter(cat => cat.type === activeTab);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] h-[90vh] flex flex-col overflow-hidden p-0 gap-0 border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-4 shrink-0">
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" /> {t.categoryStudio}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as any)} 
          className="w-full flex-1 flex flex-col px-8 overflow-hidden min-h-0"
        >
          {mode === 'all' && (
            <TabsList className="grid grid-cols-2 mb-6 rounded-xl bg-muted/50 p-1 shrink-0">
              <TabsTrigger value="expense" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:text-expense">
                <TrendingDown className="w-4 h-4" /> {t.expense}
              </TabsTrigger>
              <TabsTrigger value="income" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:text-income">
                <TrendingUp className="w-4 h-4" /> {t.income}
              </TabsTrigger>
            </TabsList>
          )}

          <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2 custom-scrollbar min-h-0">
            {/* Input Form */}
            <div className="bg-muted/30 p-5 rounded-2xl space-y-4 border border-border/50 shrink-0">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t.categoryName}</Label>
                <Input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder={t.categoryName}
                  className="rounded-xl bg-white border-none shadow-sm h-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t.emoticon}</Label>
                <div className="grid grid-cols-6 gap-2">
                  {COMMON_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewEmoji(emoji)}
                      className={`text-xl p-2 rounded-xl transition-all aspect-square flex items-center justify-center ${newEmoji === emoji ? 'bg-primary text-white scale-105 shadow-md shadow-primary/20' : 'hover:bg-white bg-white/50 border border-transparent'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full rounded-xl h-14 gap-2 font-headline text-base shadow-lg active:scale-95 transition-all">
                <Plus className="w-5 h-5" /> {t.addCategory}
              </Button>
            </div>

            {/* Category List */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                {activeTab === 'income' ? t.incomeCategories : t.expenseCategories}
              </Label>
              <div className="space-y-2">
                {filteredCategories.length === 0 ? (
                  <div className="bg-white/50 border-2 border-dashed rounded-2xl py-12 text-center">
                    <p className="text-sm text-muted-foreground italic">No categories yet</p>
                  </div>
                ) : (
                  filteredCategories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-white border border-border/50 rounded-2xl shadow-sm group hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl w-10 h-10 flex items-center justify-center bg-muted/30 rounded-xl">{cat.emoticon}</span>
                        <span className="font-semibold text-sm">{cat.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onRemove(cat.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-10 w-10 opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Tabs>

        <DialogFooter className="p-8 pt-4 border-t bg-muted/10 shrink-0">
          <Button variant="secondary" onClick={onClose} className="w-full h-14 rounded-2xl font-headline text-lg gap-2">
            <Check className="w-5 h-5" /> {t.done}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
