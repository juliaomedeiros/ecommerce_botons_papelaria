import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Upload, HelpCircle, ShoppingCart, Info } from 'lucide-react';

export default function BottonPreviewCanvas({ onAddToCart, onOpenSizeGuide }) {
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Variações escolhidas pelo cliente
  const [diameter, setDiameter] = useState('38mm'); // '25mm' | '38mm'
  const [finishType, setFinishType] = useState('alfinete'); // 'alfinete' | 'chaveiro' | 'ima'
  const [quantity, setQuantity] = useState(5);

  // Preço base calculado
  const basePrice = diameter === '38mm' ? 6.00 : 5.00;
  const finishExtra = finishType === 'chaveiro' ? 2.50 : finishType === 'ima' ? 2.00 : 0.00;
  const unitPrice = basePrice + finishExtra;
  const totalPrice = unitPrice * quantity;

  // Carregar imagem de preset inicial
  useEffect(() => {
    const defaultSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23173440"/><circle cx="200" cy="200" r="140" fill="%233fb9c8" opacity="0.3"/><text x="200" y="190" font-size="32" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">Tuta&apos;s Paper</text><text x="200" y="230" font-size="20" font-family="sans-serif" fill="%23fff7eb" text-anchor="middle">Sua Foto Aqui</text></svg>`;
    loadImg(defaultSvg);
  }, []);

  function loadImg(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageObj(img);
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    };
  }

  // File upload handler
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        loadImg(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Renderizar o Canvas com Máscara Redonda
  useEffect(() => {
    if (!canvasRef.current || !imageObj) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 320; // Tamanho do canvas na tela

    canvas.width = size;
    canvas.height = size;

    // Limpar
    ctx.clearRect(0, 0, size, size);

    // Salvar estado para aplicar clip circular
    ctx.save();

    // Desenhar círculo de fundo
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size / 2) - 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Desenhar Imagem Ajustada
    const imgWidth = imageObj.width * scale;
    const imgHeight = imageObj.height * scale;
    const drawX = (size / 2) - (imgWidth / 2) + position.x;
    const drawY = (size / 2) - (imgHeight / 2) + position.y;

    ctx.drawImage(imageObj, drawX, drawY, imgWidth, imgHeight);

    ctx.restore();

    // Bordas simulando o aro de metal do botton
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size / 2) - 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#3fb9c8';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Efeito de brilho de acetato no botton
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [imageObj, scale, position]);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleAddToCart = () => {
    if (!imageSrc || !canvasRef.current) return;

    // Exportar a imagem circular recortada como Data URL
    const croppedDataUrl = canvasRef.current.toDataURL('image/png');

    onAddToCart({
      product_id: 'prod-fastfood-001',
      name: `Botton Personalizado (${diameter} - ${finishType.toUpperCase()})`,
      diameter,
      finish_type: finishType,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      image_source: 'user_upload',
      original_image_url: imageSrc,
      cropped_image_url: croppedDataUrl,
      crop_data: { x: position.x, y: position.y, scale }
    });
  };

  return (
    <div className="card" style={{ padding: '32px' }}>
      
      {/* Box explicativo sobre como ajustar a foto */}
      <div style={{
        background: 'var(--primary-light)',
        border: '1px solid #cee4e8',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'var(--primary)',
        fontSize: '0.9rem'
      }}>
        <Info size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Como personalizar:</strong> Clique e arraste a imagem dentro do círculo para posicionar. Use a barra de zoom para ajustar imagens pequenas ou de alta resolução.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
        
        {/* Lado Esquerdo: Canvas Interativo & Controles */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', cursor: isDragging ? 'grabbing' : 'grab' }}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                borderRadius: '50%',
                boxShadow: '0 12px 30px rgba(23,52,64,0.2)',
                background: '#f8fafc'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(23,52,64,0.85)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none'
            }}>
              ✨ Clique e Arraste a Imagem
            </div>
          </div>

          {/* Slider de Zoom com Amplitude Ampliada (0.2x a 3.0x) */}
          <div style={{ marginTop: '16px', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Zoom da Imagem:</span>
              <strong>{Math.round(scale * 100)}%</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ZoomOut size={18} color="var(--primary)" />
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={scale}
                onChange={e => setScale(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--primary)' }}
              />
              <ZoomIn size={18} color="var(--primary)" />
            </div>
          </div>

          {/* Botões de Ação do Canvas */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => { setScale(1.0); setPosition({ x: 0, y: 0 }); }} title="Resetar Posição e Zoom" style={{ fontSize: '0.85rem' }}>
              <RotateCcw size={16} /> Resetar Enquadramento
            </button>

            <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
              <Upload size={16} /> Carregar Imagem
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Lado Direito: Seleção de Variações */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button className="btn btn-outline" onClick={onOpenSizeGuide} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              <HelpCircle size={14} /> Guia de Tamanhos
            </button>
          </div>

          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '8px' }}>
            Personalizador de Bottons
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
            Monte seu botton, chaveiro ou ímã personalizado em tempo real com sua própria imagem.
          </p>

          {/* 1. Escolha do Tamanho (Diâmetro) */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
              1. Escolha o Diâmetro (Tamanho):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${diameter === '25mm' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setDiameter('25mm')}
                style={{ justifyContent: 'center' }}
              >
                25mm (2,5 cm)
              </button>
              <button
                type="button"
                className={`btn ${diameter === '38mm' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setDiameter('38mm')}
                style={{ justifyContent: 'center' }}
              >
                38mm (3,8 cm) ★
              </button>
            </div>
          </div>

          {/* 2. Escolha do Acabamento */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
              2. Escolha a Modalidade de Acabamento:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className={`btn ${finishType === 'alfinete' ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setFinishType('alfinete')}
                style={{ padding: '8px 10px', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                Alfinete
              </button>
              <button
                type="button"
                className={`btn ${finishType === 'chaveiro' ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setFinishType('chaveiro')}
                style={{ padding: '8px 10px', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                Chaveiro
              </button>
              <button
                type="button"
                className={`btn ${finishType === 'ima' ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setFinishType('ima')}
                style={{ padding: '8px 10px', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                Ímã
              </button>
            </div>
          </div>

          {/* 3. Quantidade e Preço Total */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Quantidade:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <button className="btn btn-outline" style={{ padding: '4px 12px' }} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{quantity}</span>
                <button className="btn btn-outline" style={{ padding: '4px 12px' }} onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Valor Unitário: R$ {unitPrice.toFixed(2)}</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                Total: R$ {totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleAddToCart} style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}>
            <ShoppingCart size={20} /> Adicionar ao Carrinho
          </button>
        </div>

      </div>
    </div>
  );
}
