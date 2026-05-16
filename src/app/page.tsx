
"use client"

import React, { useState } from 'react';
import { useKanakku } from '@/hooks/use-kanakku';
import { translations } from '@/lib/translations';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SpendingChart } from '@/components/SpendingChart';
import { TransactionModal } from '@/components/TransactionModal';
import { CategoryStudio } from '@/components/CategoryStudio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Minus, 
  Settings, 
  Wallet, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Globe,
  Trash2,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const { 
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
  } = useKanakku();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioMode, setStudioMode] = useState<'income' | 'expense' | 'all'>('all');

  if (!isHydrated) return null;
  if (!lang) return <LanguageSelector onSelect={setLang} />;

  const t = translations[lang];

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const openStudio = (mode: 'income' | 'expense' | 'all') => {
    setStudioMode(mode);
    setIsStudioOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-headline italic shadow-lg shadow-primary/30">
            <span className="text-2xl">K</span>
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold tracking-tight text-primary">Kanakku Flow</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{t.subtitle}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm hover:bg-muted transition-all border border-border/50">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2 border-none shadow-xl">
            <DropdownMenuLabel className="px-3 pt-3 pb-1 text-xs uppercase text-muted-foreground font-bold tracking-widest">{t.settings}</DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 my-2" />
            <DropdownMenuItem onClick={() => openStudio('all')} className="gap-2 p-3 rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer">
              <Tag className="w-4 h-4" />
              <span className="font-semibold">{t.categoryStudio}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2 my-2" />
            <DropdownMenuLabel className="px-3 pt-3 pb-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{t.changeLanguage}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setLang('en')} className="gap-2 p-3 rounded-xl focus:bg-primary/5 transition-colors cursor-pointer">
              <Globe className="w-4 h-4 opacity-50" /> English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('ta')} className="gap-2 p-3 rounded-xl focus:bg-primary/5 transition-colors cursor-pointer">
              <Globe className="w-4 h-4 opacity-50" /> தமிழ்
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('ml')} className="gap-2 p-3 rounded-xl focus:bg-primary/5 transition-colors cursor-pointer">
              <Globe className="w-4 h-4 opacity-50" /> മലയാളം
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Balance Card */}
      <Card className="bg-primary text-primary-foreground rounded-[2.5rem] border-none shadow-2xl shadow-primary/20 mb-8 overflow-hidden relative animate-in zoom-in duration-700">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <CardContent className="p-10 relative z-10 text-center">
          <span className="text-sm text-primary-foreground/70 font-bold uppercase tracking-[0.3em] mb-4 block">
            {t.balance}
          </span>
          <h2 className="text-6xl font-headline font-bold mb-10 tracking-tighter">
            ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 text-primary-foreground/60">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.income}</span>
              </div>
              <span className="text-xl font-headline font-bold">₹{totalIncome.toLocaleString()}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 text-primary-foreground/60">
                <TrendingDown className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.expense}</span>
              </div>
              <span className="text-xl font-headline font-bold">₹{totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-6 mb-10 items-start">
        <Button 
          onClick={() => { setModalType('income'); setIsModalOpen(true); }}
          className="bg-income hover:bg-income/90 text-white rounded-3xl h-20 text-xl font-headline font-bold shadow-xl shadow-income/20 gap-4 transition-all active:scale-95 border-none w-full"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          {t.income}
        </Button>
        <div className="flex flex-col gap-5">
          <Button 
            onClick={() => { setModalType('expense'); setIsModalOpen(true); }}
            className="bg-expense hover:bg-expense/90 text-white rounded-3xl h-20 text-xl font-headline font-bold shadow-xl shadow-expense/20 gap-4 transition-all active:scale-95 border-none w-full"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Minus className="w-6 h-6" />
            </div>
            {t.expense}
          </Button>
          <Button 
            variant="outline"
            size="default"
            onClick={() => openStudio('all')}
            className="self-center flex items-center gap-3 h-12 px-6 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all group border-2 border-border/60 bg-white shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">{t.manageCategories}</span>
          </Button>
        </div>
      </div>

      {/* Spending Chart Section */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <SpendingChart transactions={transactions} title={t.spendingByCategory} />
      </div>

      {/* Transactions History */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-headline font-bold flex items-center gap-3">
            <History className="w-6 h-6 text-primary" /> {t.recentTransactions}
          </h3>
          <span className="text-xs text-muted-foreground font-bold bg-muted/50 px-3 py-1 rounded-full">{transactions.length} total</span>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-muted p-16 rounded-[2.5rem] text-center">
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/30">
              <Wallet className="w-10 h-10" />
            </div>
            <p className="text-muted-foreground italic font-medium text-lg">{t.noTransactions}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="group bg-white rounded-[1.5rem] p-5 shadow-sm border border-transparent hover:border-primary/20 hover:shadow-md transition-all flex items-center justify-between animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {tx.emoticon}
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-tight mb-1">{tx.category}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      <span>{format(new Date(tx.date), 'MMM dd, hh:mm a')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className={`text-right font-headline font-bold text-lg ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteTransaction(tx.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType}
        categories={categories}
        lang={lang}
        onAdd={addTransaction}
        onManageCategories={() => openStudio(modalType)}
      />
      <CategoryStudio 
        isOpen={isStudioOpen} 
        onClose={() => setIsStudioOpen(false)} 
        categories={categories}
        lang={lang}
        onAdd={addCategory}
        onRemove={removeCategory}
        mode={studioMode}
      />
    </div>
  );
}
