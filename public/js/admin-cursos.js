var api = '/api/cursos';
var apiUpload = '/api/upload';

function msg(texto, ok) {
    var m = document.getElementById('msg');
    m.innerHTML = '<div class="alert alert-' + (ok ? 'success' : 'danger') + '">' + texto + '</div>';
}

function brParaInputDate(s) {
    if (!s || typeof s !== 'string') return '';
    s = s.trim();
    var p = s.split('/');
    if (p.length !== 3) return '';
    var d = p[0].padStart(2, '0');
    var m = p[1].padStart(2, '0');
    var y = p[2];
    if (y.length !== 4) return '';
    return y + '-' + m + '-' + d;
}

function inputDateParaBR(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    if (p.length !== 3) return iso;
    return p[2] + '/' + p[1] + '/' + p[0];
}

function numeroParaPrecoMask(n) {
    if (n == null || n === '' || isNaN(Number(n))) return '';
    var v = Number(n);
    return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parsePrecoMask(str) {
    if (!str) return NaN;
    var soNum = str.replace(/\D/g, '');
    if (!soNum) return NaN;
    return parseInt(soNum, 10) / 100;
}

function aplicarMascaraPreco() {
    var el = document.getElementById('preco');
    el.addEventListener('input', function () {
        var soNum = el.value.replace(/\D/g, '');
        if (!soNum) {
            el.value = '';
            return;
        }
        var n = parseInt(soNum, 10) / 100;
        el.value = 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });
}

function dadosForm() {
    var dataEl = document.getElementById('data_inicio');
    var dataBR = inputDateParaBR(dataEl.value);
    return {
        titulo: document.getElementById('titulo').value.trim(),
        imagem: document.getElementById('imagem').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        data_inicio: dataBR,
        duracao: document.getElementById('duracao').value.trim(),
        preco: parsePrecoMask(document.getElementById('preco').value),
        instrutor: document.getElementById('instrutor').value.trim(),
        nivel: document.getElementById('nivel').value,
        vagas_disponiveis: parseInt(document.getElementById('vagas_disponiveis').value, 10)
    };
}

function validar() {
    var d = dadosForm();
    if (d.titulo.length < 2) { msg('Título inválido', false); return false; }
    if (!d.imagem) { msg('Selecione uma imagem (arquivo) ou edite mantendo a atual', false); return false; }
    if (d.descricao.length < 5) { msg('Descrição muito curta', false); return false; }
    if (!document.getElementById('data_inicio').value) { msg('Informe a data de início', false); return false; }
    if (isNaN(d.preco) || d.preco < 0) { msg('Preço inválido', false); return false; }
    if (!d.nivel) { msg('Selecione o nível', false); return false; }
    if (isNaN(d.vagas_disponiveis) || d.vagas_disponiveis < 0) { msg('Vagas inválidas', false); return false; }
    return true;
}

function limpar() {
    document.getElementById('f').reset();
    document.getElementById('idEdit').value = '';
    document.getElementById('imagem').value = '';
    document.getElementById('arquivoImagem').value = '';
    document.getElementById('imagemInfo').textContent = 'Nenhum arquivo (ou mantenha o atual ao editar)';
    document.getElementById('btnOk').textContent = 'Salvar';
    document.getElementById('btnCanc').style.display = 'none';
}

async function enviarArquivoSeHouver() {
    var inp = document.getElementById('arquivoImagem');
    if (!inp.files || !inp.files[0]) return null;
    var fd = new FormData();
    fd.append('arquivo', inp.files[0]);
    var r = await fetch(apiUpload, { method: 'POST', body: fd });
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(j.error || 'Falha no upload da imagem');
    return j.path;
}

async function listar() {
    var r = await fetch(api);
    var lista = await r.json();
    if (!Array.isArray(lista)) {
        msg((lista && lista.error) || 'Erro ao listar', false);
        return;
    }
    var tb = document.getElementById('tb');
    tb.innerHTML = '';
    if (!lista.length) {
        tb.innerHTML = '<tr><td colspan="4">Nenhum curso</td></tr>';
        return;
    }
    lista.forEach(function (c) {
        var tr = document.createElement('tr');
        var precoTxt = c.preco != null ? numeroParaPrecoMask(c.preco) : '';
        tr.innerHTML =
            '<td>' + c.id + '</td>' +
            '<td>' + c.titulo + '</td>' +
            '<td>' + precoTxt + '</td>' +
            '<td><button type="button" class="btn btn-sm btn-warning ed" data-id="' + c.id + '">Editar</button> ' +
            '<button type="button" class="btn btn-sm btn-danger ex" data-id="' + c.id + '">Excluir</button></td>';
        tb.appendChild(tr);
    });
    tb.querySelectorAll('.ed').forEach(function (b) {
        b.onclick = function () { editar(parseInt(b.getAttribute('data-id'), 10)); };
    });
    tb.querySelectorAll('.ex').forEach(function (b) {
        b.onclick = function () { excluir(parseInt(b.getAttribute('data-id'), 10)); };
    });
}

function nivelCompativel(val) {
    var op = ['Básico', 'Intermediário', 'Avançado', 'Expert'];
    if (op.indexOf(val) >= 0) return val;
    return '';
}

async function editar(id) {
    var r = await fetch(api + '/' + id);
    var c = await r.json();
    if (!r.ok) { msg(c.error || 'Erro', false); return; }
    document.getElementById('idEdit').value = c.id;
    document.getElementById('titulo').value = c.titulo || '';
    document.getElementById('imagem').value = c.imagem || '';
    document.getElementById('arquivoImagem').value = '';
    document.getElementById('imagemInfo').textContent = c.imagem ? 'Atual: ' + c.imagem + ' (envie outro arquivo para trocar)' : 'Nenhum arquivo';
    document.getElementById('descricao').value = c.descricao || '';
    var di = c.data_inicio || '';
    if (di.indexOf('/') >= 0 && di.split('/').length === 3) {
        document.getElementById('data_inicio').value = brParaInputDate(di);
    } else {
        document.getElementById('data_inicio').value = '';
    }
    document.getElementById('duracao').value = c.duracao || '';
    document.getElementById('preco').value = c.preco != null ? numeroParaPrecoMask(c.preco) : '';
    document.getElementById('instrutor').value = c.instrutor || '';
    var nv = nivelCompativel(c.nivel || '');
    document.getElementById('nivel').value = nv || '';
    document.getElementById('vagas_disponiveis').value = c.vagas_disponiveis != null ? c.vagas_disponiveis : '';
    document.getElementById('btnOk').textContent = 'Atualizar';
    document.getElementById('btnCanc').style.display = 'inline-block';
    msg('Editando curso ' + id, true);
}

async function excluir(id) {
    if (!confirm('Excluir?')) return;
    var r = await fetch(api + '/' + id, { method: 'DELETE' });
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) { msg(j.error || 'Erro ao excluir', false); return; }
    msg('Excluído', true);
    limpar();
    listar();
}

document.getElementById('f').onsubmit = async function (e) {
    e.preventDefault();
    try {
        var pathNovo = await enviarArquivoSeHouver();
        if (pathNovo) document.getElementById('imagem').value = pathNovo;
        if (!validar()) return;
        var body = JSON.stringify(dadosForm());
        var id = document.getElementById('idEdit').value;
        var op = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        };
        var url = id ? api + '/' + id : api;
        var r = await fetch(url, op);
        var j = await r.json().catch(function () { return {}; });
        if (!r.ok) { msg(j.error || 'Erro ao salvar', false); return; }
        msg(id ? 'Atualizado' : 'Cadastrado', true);
        limpar();
        listar();
    } catch (err) {
        msg(err.message || 'Erro', false);
    }
};

document.getElementById('btnCanc').onclick = function () {
    limpar();
    document.getElementById('msg').innerHTML = '';
};

aplicarMascaraPreco();
listar();
