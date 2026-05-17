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
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Tag,
  Calendar as CalendarIcon,
  X,
  Download,
  AlertTriangle,
  Target,
  Coins
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
    clearAllData,
    balance,
    budget,
    setBudget,
    currency,
    setCurrency,
    isHydrated
  } = useKanakku();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioMode, setStudioMode] = useState<'income' | 'expense' | 'all'>('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  if (!isHydrated) return null;
  if (!lang) return <LanguageSelector onSelect={setLang} />;

  const t = translations[lang];

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const currentMonthExpenses = transactions
    .filter(tx => {
      const date = new Date(tx.date);
      return tx.type === 'expense' && date >= startOfMonth(new Date()) && date <= endOfMonth(new Date());
    })
    .reduce((acc, tx) => acc + tx.amount, 0);

  const budgetProgress = budget > 0 ? (currentMonthExpenses / budget) * 100 : 0;
  const isOverBudget = currentMonthExpenses > budget;

  const openStudio = (mode: 'income' | 'expense' | 'all') => {
    setStudioMode(mode);
    setIsStudioOpen(true);
  };

  const handleExport = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Emoticon'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(tx => [
        format(new Date(tx.date), 'yyyy-MM-dd HH:mm:ss'),
        tx.type,
        tx.category,
        tx.amount,
        tx.emoticon
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kanakku_flow_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = filterDate 
    ? transactions.filter(tx => isSameDay(new Date(tx.date), filterDate))
    : transactions;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8 min-h-screen">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-headline italic shadow-lg shadow-primary/30">
            <span className="text-xl md:text-2xl">K</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-headline font-bold tracking-tight text-primary">Kanakku Flow</h1>
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
            <DropdownMenuLabel className="px-3 pt-3 pb-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{t.settings}</DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2 my-2" />
            
            <DropdownMenuItem onClick={() => { setTempBudget(budget.toString()); setIsBudgetDialogOpen(true); }} className="gap-2 p-3 rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer">
              <Target className="w-4 h-4" />
              <span className="font-semibold">{t.setBudget}</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2 p-3 rounded-xl focus:bg-primary/5 transition-colors cursor-pointer">
                <Coins className="w-4 h-4" />
                <span className="font-semibold">{t.changeCurrency}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="rounded-xl border-none shadow-xl">
                {['₹', '$', '€', '£', '¥'].map((curr) => (
                  <DropdownMenuItem key={curr} onClick={() => setCurrency(curr)} className="gap-2 p-3 rounded-xl cursor-pointer">
                    <span className="font-bold">{curr}</span> {curr === '₹' ? 'Rupee' : curr === '$' ? 'Dollar' : curr === '€' ? 'Euro' : curr === '£' ? 'Pound' : 'Yen'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuItem onClick={handleExport} className="gap-2 p-3 rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              <span className="font-semibold">{t.exportData}</span>
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
            
            <DropdownMenuSeparator className="mx-2 my-2" />
            <DropdownMenuItem onClick={() => setIsClearAlertOpen(true)} className="gap-2 p-3 rounded-xl focus:bg-destructive/10 text-destructive transition-colors cursor-pointer">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">{t.clearAllData}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Card className="bg-primary text-primary-foreground rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl shadow-primary/20 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <CardContent className="p-8 md:p-10 relative z-10 text-center">
          <span className="text-xs text-primary-foreground/70 font-bold uppercase tracking-[0.3em] mb-4 block">
            {t.balance}
          </span>
          <h2 className="text-4xl md:text-6xl font-headline font-bold mb-8 md:mb-10 tracking-tighter">
            {currency}{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1 text-primary-foreground/60">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{t.income}</span>
              </div>
              <span className="text-lg md:text-xl font-headline font-bold">{currency}{totalIncome.toLocaleString()}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1 text-primary-foreground/60">
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{t.expense}</span>
              </div>
              <span className="text-lg md:text-xl font-headline font-bold">{currency}{totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {budget > 0 && (
        <Card className="mb-8 rounded-3xl border-none shadow-sm bg-white overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{t.budget}</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t.monthlyLimit}: {currency}{budget.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold ${isOverBudget ? 'text-destructive' : 'text-primary'}`}>
                {isOverBudget ? t.overspent : t.remaining}
              </span>
              <p className="text-base md:text-lg font-headline font-bold">
                {currency}{Math.abs(budget - currentMonthExpenses).toLocaleString()}
              </p>
            </div>
          </div>
          <Progress value={budgetProgress} className={`h-2.5 rounded-full ${isOverBudget ? 'bg-destructive/10' : 'bg-primary/10'}`} />
        </Card>
      )}

      <div className="flex flex-col gap-4 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => { setModalType('income'); setIsModalOpen(true); }}
            className="flex-1 bg-income hover:bg-income/90 text-white rounded-3xl h-16 md:h-20 text-lg md:text-xl font-headline font-bold shadow-xl shadow-income/20 gap-3 transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" />
            <span>{t.income}</span>
          </Button>
          <Button 
            onClick={() => { setModalType('expense'); setIsModalOpen(true); }}
            className="flex-1 bg-expense hover:bg-expense/90 text-white rounded-3xl h-16 md:h-20 text-lg md:text-xl font-headline font-bold shadow-xl shadow-expense/20 gap-3 transition-all active:scale-95"
          >
            <Minus className="w-6 h-6" />
            <span>{t.expense}</span>
          </Button>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => openStudio('all')}
          className="flex items-center justify-center gap-3 h-14 md:h-16 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all border-2 border-border/60 bg-white shadow-sm w-full"
        >
          <Tag className="w-4 h-4" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t.manageCategories}</span>
        </Button>
      </div>

      <div className="mb-10">
        <SpendingChart transactions={transactions} title={t.spendingByCategory} currency={currency} />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
          <h3 className="text-xl font-headline font-bold flex items-center gap-3">
            <History className="w-6 h-6 text-primary" /> {t.recentTransactions}
          </h3>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-xl border-2 transition-all ${filterDate ? 'border-primary text-primary bg-primary/5' : 'border-border/60'}`}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {filterDate ? format(filterDate, 'MMM dd, yyyy') : t.filterByDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-none overflow-hidden" align="end">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {filterDate && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setFilterDate(undefined)}
                className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-muted p-12 md:p-16 rounded-[2rem] md:rounded-[2.5rem] text-center">
            <Wallet className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic font-medium">
              {filterDate ? t.noTransactionsOnDate : t.noTransactions}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div 
                key={tx.id} 
                className="group bg-white rounded-[1.5rem] p-4 md:p-5 shadow-sm border border-transparent hover:border-primary/20 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-muted/30 flex items-center justify-center text-2xl md:text-3xl">
                    {tx.emoticon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-base leading-tight mb-0.5">{tx.category}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {format(new Date(tx.date), 'MMM dd, hh:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-5">
                  <div className={`text-right font-headline font-bold text-base md:text-lg ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-9 w-9 text-muted-foreground hover:text-destructive"
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

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType}
        categories={categories}
        lang={lang}
        onAdd={addTransaction}
        onManageCategories={() => openStudio(modalType)}
        currency={currency}
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

      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="w-[95vw] rounded-[2rem] border-none shadow-2xl p-8 sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" /> {t.setBudget}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.monthlyLimit}</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">{currency}</span>
                <Input 
                  type="number" 
                  value={tempBudget} 
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="pl-10 h-14 rounded-2xl bg-muted/30 border-none font-headline font-bold text-xl"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setIsBudgetDialogOpen(false)} className="h-12 rounded-xl flex-1 font-bold">{t.cancel}</Button>
            <Button 
              onClick={() => {
                setBudget(parseFloat(tempBudget) || 0);
                setIsBudgetDialogOpen(false);
              }}
              className="h-12 rounded-xl flex-1 font-bold bg-primary shadow-lg shadow-primary/20"
            >
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isClearAlertOpen} onOpenChange={setIsClearAlertOpen}>
        <AlertDialogContent className="w-[95vw] rounded-[2rem] border-none shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-headline font-bold text-destructive flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" /> {t.confirmClear}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground py-2">
              {t.clearWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 pt-4">
            <AlertDialogCancel className="h-12 rounded-xl font-bold flex-1 border-none bg-muted/50">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                clearAllData();
                setIsClearAlertOpen(false);
              }}
              className="h-12 rounded-xl font-bold flex-1 bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20 border-none"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
