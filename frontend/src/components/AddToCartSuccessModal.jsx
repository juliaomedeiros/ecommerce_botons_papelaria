import React from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight, X } from 'lucide-react';

export default function AddToCartSuccessModal({ isOpen, item, onClose, onGoToCheckout, onContinueShopping }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100 flex flex-col"
        style={{
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(16, 185, 129, 0.2)'
        }}
      >
        
        {/* Header com Ícone de Sucesso */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 px-6 py-4 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Produto Adicionado ao Carrinho!</h3>
              <p className="text-xs text-emerald-400 font-medium">Item adicionado com sucesso</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resumo do Item Adicionado */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            {/* Preview da Imagem (Original ou Recortada) */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center">
              <img 
                src={item.original_image_url || item.cropped_image_url || item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%2394a3b8'%3EBotton%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-100 text-sm truncate">{item.name}</h4>
              <div className="text-xs text-slate-400 mt-1 space-x-2">
                <span>Diâmetro: <strong className="text-purple-300">{item.diameter || '38mm'}</strong></span>
                <span>•</span>
                <span>Acabamento: <strong className="text-purple-300 capitalize">{item.finish_type || 'Alfinete'}</strong></span>
              </div>
              <div className="text-sm font-extrabold text-emerald-400 mt-1">
                R$ {(parseFloat(item.price || item.total_price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)}
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-slate-300 font-medium">
            O que você deseja fazer agora?
          </p>
        </div>

        {/* Botões de Ação (Ir para o Pagamento vs Continuar Comprando) */}
        <div className="bg-slate-950 p-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onContinueShopping}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag size={16} /> Continuar Comprando
          </button>

          <button
            onClick={onGoToCheckout}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            Ir para o Pagamento <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
