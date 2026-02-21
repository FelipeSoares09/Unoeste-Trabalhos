document.addEventListener('DOMContentLoaded', () => {
    const inputVagas = document.getElementById('qtd-vagas');
    const precoUnitario = parseFloat(document.getElementById('preco-unitario').innerText);
    const campoTotal = document.getElementById('valor-total');

    if(inputVagas) {
        inputVagas.addEventListener('input', () => {
            const quantidade = parseInt(inputVagas.value) || 0;
            const total = (quantidade * precoUnitario).toFixed(2);
            campoTotal.innerText = total;
        });
    }
});