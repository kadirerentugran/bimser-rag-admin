'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2, FileText, Database, Clock } from 'lucide-react';

export default function ReindexPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleReindex = async () => {
    setIsProcessing(true);
    setResult(null);
    try {
      const response = await fetchApi('/embeddings/reindex', { method: 'POST' });
      setResult(response);
      toast.success('Vektör indeksleme başarıyla tamamlandı!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center uppercase">Vektör INDEX İşlemi</h1>
      </div>

      <div className="bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-700 rounded-sm p-8 text-center space-y-6 shadow-sm">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-sm flex items-center justify-center">
          <RefreshCw className={`w-8 h-8 text-gray-700 dark:text-gray-300 ${isProcessing ? 'animate-spin' : ''}`} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Tüm Dokümanları Senkronize Et</h2>

        </div>

        <button
          onClick={handleReindex}
          disabled={isProcessing}
          className="bg-eba hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold tracking-wider uppercase py-2.5 px-8 rounded-sm transition-colors shadow-sm"
        >
          {isProcessing ? 'JSON DOSYASI INDEKSELENİYOR..' : 'Reindex Başlat'}
        </button>
      </div>

      {result && result.success && (
        <div className="bg-white dark:bg-[#1b1b1d] border-l-4 border-l-emerald-500 border border-gray-300 dark:border-gray-700 rounded-sm p-6 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
            <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">İşlem Tamamlandı</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-[#202022] border border-gray-300 dark:border-gray-700 p-4 rounded-sm flex items-center gap-4">
              <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">İşlenen Doküman</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{result.indexed_documents}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#202022] border border-gray-300 dark:border-gray-700 p-4 rounded-sm flex items-center gap-4">
              <Database className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Üretilen Vektör</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{result.total_chunks}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
