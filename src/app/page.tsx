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
  Trash2
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

  if (!isHydrated) return null;
  if (!lang) return <LanguageSelector onSelect={setLang} />;

  const t = translations[lang];

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-headline italic shadow-lg">
            K
          </div>
          <div>
            <h1 className="text-xl font-headline tracking-tight text-primary">Kanakku Flow</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t.subtitle}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm hover:bg-muted transition-all">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl w-56">
            <DropdownMenuLabel>{t.settings}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsStudioOpen(true)} className="gap-2 p-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              {t.categoryStudio}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] text-muted-foreground font-bold">{t.changeLanguage}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setLang('en')} className="gap-2">
              <Globe className="w-4 h-4" /> English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('ta')} className="gap-2">
              <Globe className="w-4 h-4" /> தமிழ்
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang('ml')} className="gap-2">
              <Globe className="w-4 h-4" /> മലയാളം
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Balance Card */}
      <Card className="bg-primary text-primary-foreground rounded-[2rem] border-none shadow-2xl shadow-primary/20 mb-8 overflow-hidden relative animate-in zoom-in duration-700">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
        <CardContent className="p-8 relative z-10 text-center">
          <span className="text-sm text-primary-foreground/80 font-medium uppercase tracking-[0.2em] mb-2 block">
            {t.balance}
          </span>
          <h2 className="text-5xl font-headline font-bold mb-8 tracking-tighter">
            ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1 text-primary-foreground/70">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.income}</span>
              </div>
              <span className="text-lg font-headline font-semibold">₹{totalIncome.toLocaleString()}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1 text-primary-foreground/70">
                <TrendingDown className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t.expense}</span>
              </div>
              <span className="text-lg font-headline font-semibold">₹{totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button 
          onClick={() => { setModalType('income'); setIsModalOpen(true); }}
          className="bg-income hover:bg-income/90 text-white rounded-2xl h-16 text-lg font-headline shadow-lg shadow-income/20 gap-3 transition-transform active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          {t.income}
        </Button>
        <Button 
          onClick={() => { setModalType('expense'); setIsModalOpen(true); }}
          className="bg-expense hover:bg-expense/90 text-white rounded-2xl h-16 text-lg font-headline shadow-lg shadow-expense/20 gap-3 transition-transform active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Minus className="w-5 h-5" />
          </div>
          {t.expense}
        </Button>
      </div>

      {/* Pie Chart Section */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <SpendingChart transactions={transactions} title={t.spendingByCategory} />
      </div>

      {/* Transactions History */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-headline flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> {t.recentTransactions}
          </h3>
          <span className="text-xs text-muted-foreground font-bold">{transactions.length} total</span>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-muted p-12 rounded-[2rem] text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground/30">
              <Wallet className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground italic font-medium">{t.noTransactions}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="group bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-primary/20 transition-all flex items-center justify-between animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {tx.emoticon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight mb-0.5">{tx.description}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      <span>{tx.category}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span>{format(new Date(tx.date), 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-right font-headline font-bold text-base ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteTransaction(tx.id)}
                  >
                    <Trash2 className="w-4 h-4" />
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
      />
      <CategoryStudio 
        isOpen={isStudioOpen} 
        onClose={() => setIsStudioOpen(false)} 
        categories={categories}
        lang={lang}
        onAdd={addCategory}
        onRemove={removeCategory}
      />
    </div>
  );
}
