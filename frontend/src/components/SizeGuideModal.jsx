import React from 'react';
import { X, Check, HelpCircle } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose, onConfirm, isFlowTarget }) {
  if (!isOpen) return null;

  function handleActionClick() {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={22} /> Guia de Tamanhos & Acabamentos
          </h2>
          <button className="btn btn-outline" onClick={onClose} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: '#475569', marginBottom: '24px', fontSize: '0.95rem' }}>
          Trabalhamos com duas opções de diâmetro e três tipos de acabamento para atender qualquer necessidade. Veja abaixo a comparação real:
        </p>

        {/* Comparação dos Diâmetros */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            border: '2px solid #cee4e8',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            background: '#fafafa'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              border: '3px solid var(--primary)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'var(--primary)',
              fontSize: '0.9rem',
              background: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
            }}>
              25mm
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>25mm (2,5 cm)</h4>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Pequeno & Discreto</span>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
              Ideal para lapelas, uniformes, pins evangélicos/católicos, broches delicados e lembrancinhas.
            </p>
          </div>

          <div style={{
            border: '2px solid var(--primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            background: 'var(--primary-light)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '3px solid var(--primary)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'var(--primary)',
              fontSize: '1.1rem',
              background: '#fff',
              boxShadow: '0 4px 14px rgba(23,52,64,0.15)'
            }}>
              38mm
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>38mm (3,8 cm)</h4>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Tamanho Padrão ★</span>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
              Tamanho mais vendido! Excelente leitura de fotos, frases, logos de empresas, chaveiros e ímãs de geladeira.
            </p>
          </div>
        </div>

        {/* Modalidades de Acabamento */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#0f172a' }}>
          Modalidades de Acabamento Disponíveis:
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
            <Check size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
            <div>
              <strong>Botton de Alfinete (Broche):</strong> Base de alumínio resistente com alfinete de segurança no verso. Perfeito para usar em roupas e bolsas.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
            <Check size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
            <div>
              <strong>Chaveiro com Corrente:</strong> Argola e correntinha metálica cromada. Excelente opção de presente ou brinde de evento.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
            <Check size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
            <div>
              <strong>Ímã de Geladeira / Quadro:</strong> Imã forte fixado no verso. Ideal para lembrancinhas de casamentos, batizados e geladeiras.
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleActionClick} style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}>
          {isFlowTarget ? 'Entendi, Escolher Meu Botton ➔' : 'Entendi, Fechar Guia'}
        </button>
      </div>
    </div>
  );
}
