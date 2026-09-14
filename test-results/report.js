function loadTestResults() {
    document.getElementById('timestamp').textContent = new Date().toLocaleString('pt-BR');
    
    // Tenta carregar os resultados do Cypress
    fetch('cypress-results.json')
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.log('Nenhum arquivo de resultados encontrado');
            displayDefaultResults();
        });
}

function displayResults(data) {
    let passed = 0;
    let failed = 0;

    if (data.stats) {
        passed = data.stats.passes || 0;
        failed = data.stats.failures || 0;
    }

    document.getElementById('passed').textContent = passed;
    document.getElementById('failed').textContent = failed;
    document.getElementById('total').textContent = passed + failed;

    const container = document.getElementById('results-container');
    container.innerHTML = `
        <div class="info-box" style="background: ${failed === 0 ? '#d4edda' : '#f8d7da'}; border-left-color: ${failed === 0 ? '#28a745' : '#dc3545'}; color: ${failed === 0 ? '#155724' : '#721c24'};">
            <strong>${failed === 0 ? '✅ Todos os testes passaram!' : '❌ Alguns testes falharam'}</strong>
        </div>
    `;
}

function displayDefaultResults() {
    document.getElementById('passed').textContent = '0';
    document.getElementById('failed').textContent = '0';
    document.getElementById('total').textContent = '0';

    const container = document.getElementById('results-container');
    container.innerHTML = `
        <div class="info-box">
            <strong>📝 Status:</strong><br>
            Os testes foram executados. Verifique o console ou os logs do GitHub Actions para mais detalhes.
        </div>
    `;
}

// Carrega os resultados quando a página termina de carregar
document.addEventListener('DOMContentLoaded', loadTestResults);
