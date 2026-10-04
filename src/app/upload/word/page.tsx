'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import { UploadCloud, Save, XCircle } from 'lucide-react';

import Cookies from 'js-cookie';

export default function WordUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ title: '', product: '', parent: '', description: '' });
  const [sections, setSections] = useState<any[] | null>(null);
  const [jsonCode, setJsonCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  });

  const handlePreview = async () => {
    if (!file) return toast.error('Lütfen bir dosya seçin');
    if (!formData.title || !formData.product || !formData.parent) return toast.error('Lütfen tüm zorunlu alanları doldurun');

    setIsProcessing(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const apiKey = Cookies.get('admin_key') || '';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/parse/word/preview`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
        body: data,
      });

      if (!response.ok) throw new Error('Ayrıştırma hatası');
      const result = await response.json();
      
      setSections(result.sections);
      setJsonCode(JSON.stringify(result.sections, null, 2));
      toast.success('Word dosyası başarıyla çözümlendi!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!sections) return;
    
    let parsedSections;
    try {
      parsedSections = JSON.parse(jsonCode);
    } catch (e) {
      return toast.error('Geçersiz JSON formatı! Lütfen editördeki sözdizimini düzeltin.');
    }

    setIsProcessing(true);
    try {
      await fetchApi('/parse/save_json', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          product: formData.product,
          parent: formData.parent,
          description: formData.description,
          sections: parsedSections,
        }),
      });
      toast.success('Doküman başarıyla docs klasörüne kaydedildi!');
      
      // Temizle
      setFile(null);
      setSections(null);
      setFormData({ title: '', product: '', parent: '', description: '' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center border-b border-gray-300 dark:border-gray-700 pb-4 ">
        <div>
          <h1 className="text-2xl font-bold  text-gray-900 dark:text-white uppercase">Word Dokümanı Yükle</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-700 rounded-sm p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 pb-2">Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Ürün Klasörü </label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-[#141415] border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:border-eba focus:ring-1 focus:ring-eba text-sm text-gray-900 dark:text-white transition-colors"
                >
                  <option value="" disabled>Ürün Seçin</option>
                  <option value="Bimser Synergy">Bimser Synergy</option>
                  <option value="eBA">eBA</option>
                  <option value="ensemble">ensemble</option>
                  <option value="QMDS">QMDS</option>
                  <option value="QGRC">QGRC</option>
                  <option value="Beam">Beam</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori </label>
                <input
                  type="text"
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  placeholder="örn: Kullanım Dokümanları"
                  className="w-full px-3 py-2 bg-white dark:bg-[#141415] border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:border-eba focus:ring-1 focus:ring-eba text-sm text-gray-900 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Doküman Başlığı </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="örn: EBYS Kurulum Kılavuzu"
                  className="w-full px-3 py-2 bg-white dark:bg-[#141415] border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:border-eba focus:ring-1 focus:ring-eba text-sm text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>

          <div 
            {...getRootProps()} 
            className={`border border-dashed rounded-sm p-6 text-center cursor-pointer transition-all shadow-sm
              ${isDragActive ? 'border-eba bg-eba-light dark:bg-eba/10' : 'border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-[#1b1b1d] hover:bg-gray-100 dark:hover:bg-[#202022]'}
              ${file ? 'border-green-500 bg-green-50 dark:bg-green-500/5' : ''}
            `}
          >
            <input {...getInputProps()} />
            <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${file ? 'text-green-500' : 'text-gray-500'}`} />
            {file ? (
              <div>
                <p className="text-green-700 dark:text-green-400 font-semibold text-sm">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">.docx dosyanızı sürükleyin</p>
                <p className="text-xs text-gray-500 mt-1">veya seçmek için tıklayın</p>
              </div>
            )}
          </div>

          <button
            onClick={handlePreview}
            disabled={!file || isProcessing}
            className="w-full bg-eba hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-sm transition-colors shadow-sm text-sm"
          >
            {isProcessing ? 'İşleniyor...' : 'Çözümle (Preview)'}
          </button>
        </div>

        {/* Sağ Panel: Editör */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px]">
          <div className="bg-white dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-700 rounded-sm overflow-hidden flex-1 flex flex-col shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#202022]">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">JSON Çıktısı</h3>
              {sections && (
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" /> Sisteme Kaydet
                </button>
              )}
            </div>
            
            <div className="flex-1 relative bg-white dark:bg-[#1e1e1e]">
              {!sections ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                  <p>Word dosyasını çözümlediğinizde kod burada görünecektir.</p>
                </div>
              ) : (
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={jsonCode}
                  onChange={(val) => setJsonCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: 'on',
                    formatOnPaste: true,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

