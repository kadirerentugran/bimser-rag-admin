'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { Database, FileText, Clock, Server, CheckCircle2, XCircle } from 'lucide-react';

interface StatusData {
  document_count: number;
  embedding_count: number;
  last_reindex: string | null;
  ollama: {
    status: string;
    models: string[];
    llm_ready: boolean;
    embed_ready: boolean;
  };
  db_status: string;
}

export default function DashboardPage() {
  const { data: status, isLoading, error } = useQuery<StatusData>({
    queryKey: ['systemStatus'],
    queryFn: () => fetchApi('/embeddings/status'),
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Bağlantı Hatası</h2>
        <p>Backend servisine bağlanılamadı. Lütfen `bimser-api` projesinin çalıştığından emin olun.</p>
      </div>
    );
  }

  const stats = [
    { label: 'İndekslenmiş Doküman', value: status.document_count, icon: FileText, color: 'text-blue-400' },
    { label: 'Toplam Vektör (Chunk)', value: status.embedding_count, icon: Database, color: 'text-purple-400' },
    
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">ADMİN PANEL</h1>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-700 rounded-sm p-4 shadow-sm flex items-center gap-4">
              <div className={`p-3 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-700 rounded-sm shadow-sm overflow-hidden">
          <div className="  p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex  justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Server className="w-4 h-4 text-gray-500 " /> LLM SERVİSİ
            </h3>
            {status.ollama.status === 'online' ? (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold uppercase rounded-sm">Çevrimiçi</span>
            ) : (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold uppercase rounded-sm">Çevrimdışı</span>
            )}
          </div>
          
          <div className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Embedding Modeli (nomic)</span>
              {status.ollama.embed_ready ? <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold uppercase rounded-sm">Hazır</span> : <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold uppercase rounded-sm">Hazır Değil</span>}
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">llama3.1:8b</span>
              {status.ollama.llm_ready ? <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold uppercase rounded-sm">Hazır</span> : <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold uppercase rounded-sm">Hazır Değil</span>}
            </div>
          </div>
        </div>

        <div className=" bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-700 rounded-sm shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm  font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Database className="w-4 h-4 text-gray-500" /> VERİTABANI               
            </h3>
          </div>
          <div className="flex items-center justify-between p-4 border-gray-200 border-b dark:border-gray-800">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">PostgreSQL+ pgvector</span>
           {status.db_status === 'connected' ? (
             <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200  text-[11px] font-bold uppercase rounded-sm">Bağlı</span>
            ) : (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold uppercase rounded-sm">Bağlantı Hatası</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
