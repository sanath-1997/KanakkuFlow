"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { translations, type Language } from '@/lib/translations';
import { Plus, Trash2, Tag } from 'lucide-react';
import type { Category } from '@/hooks/use-kanakku';

interface CategoryStudioProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  lang: Language;
  onAdd: (cat: Omit<Category, 'id'>) => void;
  onRemove: (id: string) => void;
}

const COMMON_EMOJIS = ['🍔', '🏠', '🚗', '💰', '💡', '🛍️', '🏥', '🎭', '🎓', '✈️', '🎁', '🐶', '🍕', '💻', '🍿'];

export function CategoryStudio({ isOpen, onClose, categories, lang, onAdd, onRemove }: CategoryStudioProps) {
  const t = translations[lang];
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('📦');

  const handleAdd = () => {
    if (!newName) return;
    onAdd({ name: newName, emoticon: newEmoji });
    setNewName('');
    setNewEmoji('📦');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary" /> {t.categoryStudio}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-muted/30 p-4 rounded-2xl space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">{t.categoryName}</Label>
              <Input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Category name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">{t.emoticon}</Label>
              <div className="grid grid-cols-5 gap-2">
                {COMMON_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewEmoji(emoji)}
                    className={`text-xl p-2 rounded-xl transition-all ${newEmoji === emoji ? 'bg-primary text-white scale-110' : 'hover:bg-muted bg-white border border-border'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleAdd} className="w-full rounded-xl gap-2">
              <Plus className="w-4 h-4" /> {t.addCategory}
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">{t.category}</Label>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-border rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.emoticon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemove(cat.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
