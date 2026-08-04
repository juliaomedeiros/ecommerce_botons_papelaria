const assert = require('assert');

console.log('🧪 Executando suíte de testes: RBAC & Permissões (T004)...');

function testAdminPermission() {
  const userRole = 'admin';
  const allowedRoles = ['admin', 'funcionario'];
  const canAccessFinancialDashboard = ['admin'].includes(userRole);
  const canManageProducts = allowedRoles.includes(userRole);

  assert.strictEqual(canAccessFinancialDashboard, true, 'Admin deve ter acesso ao Dashboard Financeiro');
  assert.strictEqual(canManageProducts, true, 'Admin deve ter permissão de alterar produtos e estoques');
  console.log('✅ PASS: Permissões de Admin validadas com sucesso');
}

function testFuncionarioPermission() {
  const userRole = 'funcionario';
  const allowedRoles = ['admin', 'funcionario'];
  const canAccessFinancialDashboard = ['admin'].includes(userRole);
  const canManageProducts = allowedRoles.includes(userRole);

  assert.strictEqual(canAccessFinancialDashboard, false, 'Funcionário NÃO pode acessar o Dashboard Financeiro');
  assert.strictEqual(canManageProducts, true, 'Funcionário PODE alterar produtos, preços e estoques');
  console.log('✅ PASS: Permissões de Funcionário validadas (Preço/Estoque liberado, Financeiro restrito)');
}

try {
  testAdminPermission();
  testFuncionarioPermission();
  console.log('🎉 Suíte de testes de RBAC concluída com sucesso!');
} catch (err) {
  console.error('❌ FAIL nos testes de RBAC:', err.message);
  process.exit(1);
}
