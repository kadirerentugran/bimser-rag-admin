"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, FileText, RefreshCw, Download } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  slug: string;
  product: string;
  parent: string;
  source_file: string;
  updated_at: string;
  created_at: string;
}

export default function DatabasePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDocuments = async () => {
    try {
      const apiKey = Cookies.get("admin_key");
      if (!apiKey) {
        toast.error("API Anahtarı bulunamadı.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/db/documents", {
        headers: { "x-api-key": apiKey },
      });

      if (!res.ok) throw new Error("Veriler alınamadı");

      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      toast.error("Veritabanı bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = async (id: string, slug: string) => {
    try {
      const apiKey = Cookies.get("admin_key");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/db/documents/${id}/download`, {
        headers: { "x-api-key": apiKey || "" },
      });

      if (!res.ok) throw new Error("İndirme başarısız");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      toast.error("Dosya indirilirken hata oluştu");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`'${title}' belgesini silmek istediğinize emin misiniz? (Vektörler de silinecek)`)) return;

    try {
      const apiKey = Cookies.get("admin_key");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/db/documents/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": apiKey || "" },
      });

      if (!res.ok) throw new Error("Silme işlemi başarısız");
      
      toast.success("Belge ve vektörler silindi!");
      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error("Hata oluştu");
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center border-b border-gray-300 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">Veritabanı Yönetimi</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1b1b1d] rounded-sm border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#1b1b1d] text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700">
                <th className="px-4 py-3 font-semibold">Doküman Başlığı</th>
                <th className="px-4 py-3 font-semibold">Ürün</th>
                <th className="px-4 py-3 font-semibold">Son Güncelleme</th>
                <th className="px-4 py-3 font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gray-400" />
                    Yükleniyor...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    Gösterilecek kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-[#202022]/50 transition-colors group">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-gray-200 dark:bg-gray-800 rounded-sm text-gray-600 dark:text-gray-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">{doc.title}</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={doc.source_file}>
                            {doc.source_file}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                        {doc.product || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {new Date(doc.updated_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-1">
                      <button
                        onClick={() => handleDownload(doc.id, doc.slug)}
                        className="p-1.5 text-gray-500 hover:text-eba hover:bg-eba-light dark:hover:bg-eba/10 rounded-sm transition-colors border border-transparent hover:border-eba/30"
                        title="İndir"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm transition-colors border border-transparent hover:border-red-200"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
