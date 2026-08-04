import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Upload, Move, Check, Sparkles, AlertCircle } from 'lucide-react';

export default function BottonPreviewModal({ isOpen, onClose, onAddToCart }) {
  const [selectedDiameter, setSelectedDiameter] = useState('38mm');
  const [selectedFinish, setSelectedFinish] = useState('chaveiro');
  const [quantity, setQuantity] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);

  // Controles de Canvas & Zoom Flexível (Amplitude 0.1x a 5.0x)
  const [scale, setScale] = useState(1.0);
  const [initialFitScale, setInitialFitScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  if (!isOpen) return null;

  // Ao selecionar uma imagem, calcular auto-fit inicial
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setImageSrc(event.target.result);

          // Calcular Fit Inicial Ideal para o tamanho do Canvas (400px x 400px)
          const canvasSize = 320;
          const fitScale = Math.min(canvasSize / img.width, canvasSize / img.height);
          setInitialFitScale(fitScale);
          setScale(1.0); // Resetar slider para 1.0 (multiplicador do fit)
          setPosition({ x: 0, y: 0 });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Renderizar o Canvas sempre que a imagem, zoom ou posição mudar
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;

    ctx.clearRect(0, 0, size, size);

    // Salvar estado para aplicar máscara circular do botton
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, center - 4, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Fundo branco no botton
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Desenhar imagem com escala combinada e posição
    const img = imageRef.current;
    const effectiveScale = initialFitScale * scale;
    const drawWidth = img.width * effectiveScale;
    const drawHeight = img.height * effectiveScale;

    const drawX = center - (drawWidth / 2) + position.x;
    const drawY = center - (drawHeight / 2) + position.y;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Borda metálica simulando a prensa do botton
    ctx.beginPath();
    ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [imageSrc, scale, initialFitScale, position]);

  // Handler de arrastar a imagem com toque/mouse
  function handleMouseDown(e) {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  }

  function handleTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  }

  function handleConfirmAddToCart() {
    const itemPrice = selectedDiameter === '38mm' ? 6.00 : 5.00;
    const customItem = {
      id: `custom-${Date.now()}`,
      name: `Botton Personalizado Exclusivo (${selectedDiameter})`,
      diameter: selectedDiameter,
      finish_type: selectedFinish,
      quantity,
      price: itemPrice,
      original_image_url: imageSrc,
      crop_data: { scale, position }
    };
    onAddToCart(customItem);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-purple-900/80 to-slate-900 px-5 py-3 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={20} />
            <h3 className="font-bold text-white text-base">Personalizar Meu Botton</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal (Mobile Scroll) */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* Seção Canvas de Visualização */}
          <div className="flex flex-col items-center justify-center bg-slate-950/70 p-4 rounded-xl border border-slate-800 relative">
            {!imageSrc ? (
              <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-purple-500/50 hover:border-purple-400 rounded-full cursor-pointer bg-purple-950/20 hover:bg-purple-900/30 transition-all text-center p-6">
                <Upload className="text-purple-400 mb-2" size={32} />
                <span className="text-xs font-bold text-purple-200">Escolha uma Imagem</span>
                <span className="text-[10px] text-slate-400 mt-1">Fotos do celular, logos ou qualquer imagem</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div 
                  className="relative cursor-move touch-none select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                >
                  <canvas ref={canvasRef} width={320} height={320} className="rounded-full shadow-2xl shadow-purple-900/40" />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded-full text-[10px] text-purple-300 flex items-center gap-1">
                    <Move size={10} /> Arraste para enquadrar
                  </div>
                </div>

                {/* Slider de Zoom Estendido (0.1x a 5.0x) */}
                <div className="w-full max-w-xs space-y-1 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-semibold text-purple-300">
                    <span className="flex items-center gap-1"><ZoomOut size={14} /> Zoom</span>
                    <span className="text-[10px] text-slate-400">{scale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.05"
                    value={scale}
                    onChange={e => setScale(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Menor (Fotos Grandes)</span>
                    <span>Maior (Zoom em Detalhes)</span>
                  </div>
                </div>

                {/* Trocar Imagem */}
                <label className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer underline flex items-center gap-1">
                  <Upload size={12} /> Escolher outra foto
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* Opções de Diâmetro & Acabamento */}
          <div className="space-y-3 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Tamanho do Botton</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedDiameter('38mm')}
                  className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                    selectedDiameter === '38mm' ? 'bg-purple-600/30 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  38mm (Médio Padrão)
                </button>
                <button
                  onClick={() => setSelectedDiameter('25mm')}
                  className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                    selectedDiameter === '25mm' ? 'bg-purple-600/30 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  25mm (Pequeno)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Acabamento Traseiro</label>
              <div className="grid grid-cols-3 gap-2">
                {['chaveiro', 'alfinete', 'ima'].map(finish => (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish)}
                    className={`py-1.5 px-2 rounded-lg border text-center capitalize transition-all ${
                      selectedFinish === finish ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-slate-400">Total: </span>
            <span className="text-base font-extrabold text-emerald-400">R$ {(quantity * (selectedDiameter === '38mm' ? 6.0 : 5.0)).toFixed(2)}</span>
          </div>

          <button
            disabled={!imageSrc}
            onClick={handleConfirmAddToCart}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
              imageSrc 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30 cursor-pointer' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Check size={16} /> Adicionar ao Carrinho
          </button>
        </div>

      </div>
    </div>
  );
}
