"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { translations, type Language } from '@/lib/translations';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
      <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-xl">
          <span className="text-4xl font-headline italic">K</span>
        </div>
        <h1 className="text-4xl font-headline tracking-tight text-primary">Kanakku Flow</h1>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Choose your preferred language to get started with your finances.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <Button 
          variant="outline" 
          className="h-24 text-lg font-medium border-2 hover:border-primary hover:bg-primary/5 transition-all"
          onClick={() => onSelect('en')}
        >
          English
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-lg font-medium border-2 hover:border-primary hover:bg-primary/5 transition-all"
          onClick={() => onSelect('ta')}
        >
          தமிழ்
        </Button>
        <Button 
          variant="outline" 
          className="h-24 text-lg font-medium border-2 hover:border-primary hover:bg-primary/5 transition-all"
          onClick={() => onSelect('ml')}
        >
          മലയാളം
        </Button>
      </div>
    </div>
  );
}
