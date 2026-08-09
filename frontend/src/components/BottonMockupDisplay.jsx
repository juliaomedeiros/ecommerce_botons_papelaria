import React, { useState } from 'react';
import { Eye, Shield, Key, Magnet } from 'lucide-react';

export default function BottonMockupDisplay({ 
  imageUrl, 
  productName = 'Botton', 
  finishType = 'alfinete', 
  size = 'normal', // 'card' (200px) or 'modal' (260px)
  showToggle = true 
}) {
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'

  const dimensions = size === 'card' 
    ? { containerHeight: '200px', mockupSize: '160px' } 
    : { containerHeight: '260px', mockupSize: '210px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Botões de Alternância Frente / Verso */}
      {showToggle && (
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          marginBottom: '10px', 
          background: '#e2e8f0', 
          padding: '3px', 
          borderRadius: '20px' 
        }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveSide('front'); }}
            style={{
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              background: activeSide === 'front' ? 'var(--primary, #173440)' : 'transparent',
              color: activeSide === 'front' ? '#ffffff' : '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            Frente 🔘
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveSide('back'); }}
            style={{
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              background: activeSide === 'back' ? 'var(--primary, #173440)' : 'transparent',
              color: activeSide === 'back' ? '#ffffff' : '#475569',
              transition: 'all 0.2s ease'
            }}
          >
            Verso 🧷
          </button>
        </div>
      )}

      {/* Area de Exibição do Mockup */}
      <div style={{
        height: dimensions.containerHeight,
        width: '100%',
        borderRadius: '16px',
        background: 'radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
      }}>
        {activeSide === 'front' ? (
          /* MOCKUP DA FRENTE DO BOTTON */
          <div style={{
            width: dimensions.mockupSize,
            height: dimensions.mockupSize,
            borderRadius: '50%',
            position: 'relative',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25), inset 0 0 0 4px #cbd5e1, inset 0 0 0 7px #94a3b8',
            overflow: 'hidden',
            background: '#ffffff',
            transition: 'transform 0.3s ease'
          }}>
            {/* Imagem do Botton */}
            <img
              src={imageUrl}
              alt={productName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
              onError={(e) => { 
                e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60'; 
              }}
            />

            {/* Brilho da Película de Acetato (Curva 3D) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.15) 100%)',
              pointerEvents: 'none'
            }} />
          </div>
        ) : (
          /* MOCKUP DO VERSO METÁLICO DO BOTTON */
          <div style={{
            width: dimensions.mockupSize,
            height: dimensions.mockupSize,
            borderRadius: '50%',
            position: 'relative',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
            background: 'radial-gradient(circle at 35% 35%, #f1f5f9 0%, #cbd5e1 50%, #64748b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #cbd5e1'
          }}>
            {/* Linhas circulares de estampagem do metal */}
            <div style={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              border: '1px dashed #94a3b8',
              opacity: 0.6
            }} />

            {/* Renderização do Acabamento Verso */}
            {finishType === 'chaveiro' ? (
              /* VERSO CHAVEIRO */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#334155' }}>
                <Key size={36} style={{ strokeWidth: 1.8 }} />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', marginTop: '4px', textTransform: 'uppercase' }}>
                  Argola Chaveiro
                </span>
              </div>
            ) : finishType === 'ima' ? (
              /* VERSO ÍMÃ DE GELADEIRA */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#1e293b' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#334155',
                  boxShadow: 'inset 0 0 6px #090d16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8'
                }}>
                  <Magnet size={28} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', marginTop: '4px', textTransform: 'uppercase', color: '#334155' }}>
                  Ímã Magnético
                </span>
              </div>
            ) : (
              /* VERSO ALFINETE (PADRÃO) */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#334155' }}>
                <div style={{
                  width: '70px',
                  height: '14px',
                  border: '2px solid #475569',
                  borderRadius: '10px',
                  position: 'relative',
                  background: '#94a3b8',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '10px',
                    width: '50px',
                    height: '2px',
                    background: '#1e293b',
                    transform: 'rotate(-4deg)'
                  }} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', marginTop: '8px', textTransform: 'uppercase' }}>
                  Alfinete de Metal
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
