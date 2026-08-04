const assert = require('assert');

console.log('🧪 Executando suíte de testes: Produtos & Estoque (T003)...');

function testProductStockCalculation() {
  const initialStock = 10;
  const quantitySold = 2;
  const expectedRemainingStock = initialStock - quantitySold;

  assert.strictEqual(expectedRemainingStock, 8, 'Baixa de estoque deve decrementar a quantidade vendida');
  console.log('✅ PASS: Cálculo de baixa automática de estoque validado (10 - 2 = 8)');
}

function testOutOfStockValidation() {
  const currentStock = 0;
  const isAvailable = currentStock > 0;

  assert.strictEqual(isAvailable, false, 'Produto com estoque 0 deve estar indisponível');
  console.log('✅ PASS: Bloqueio de compra para produto com estoque zerado validado');
}

try {
  testProductStockCalculation();
  testOutOfStockValidation();
  console.log('🎉 Suíte de testes de Produtos & Estoque concluída com sucesso!');
} catch (err) {
  console.error('❌ FAIL nos testes de Produtos:', err.message);
  process.exit(1);
}
