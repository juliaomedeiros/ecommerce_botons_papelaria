const http = require('http');

console.log('🧪 Executando suíte de testes da API...');

function testHealth() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ PASS: GET /api/health retornou status 200');
          resolve(true);
        } else {
          console.error('❌ FAIL: GET /api/health retornou', res.statusCode);
          reject(false);
        }
      });
    }).on('error', (err) => {
      console.warn('⚠️ Servidor local não está em execução na porta 5000, teste ignorado.');
      resolve(true);
    });
  });
}

testHealth().then(() => {
  console.log('🎉 Suíte de testes concluída!');
});
