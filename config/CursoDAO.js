const pool = require('./database');

async function listarCursos() {
    const [linhas] = await pool.execute('SELECT * FROM cursos');
    return linhas;
}

async function buscarCursoPorId(id) {
    const [linhas] = await pool.execute('SELECT * FROM cursos WHERE id = ?', [id]);
    return linhas[0];
}

async function criarCurso(curso) {
    const [result] = await pool.query(
        'INSERT INTO cursos (titulo, imagem, descricao, data_inicio, duracao, preco, instrutor, nivel, vagas_disponiveis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [curso.titulo, curso.imagem, curso.descricao, curso.data_inicio, curso.duracao, curso.preco, curso.instrutor, curso.nivel, curso.vagas_disponiveis]
    );
    return result.insertId;
}

async function atualizarCurso(id, curso) {
    await pool.query(
        'UPDATE cursos SET titulo = ?, imagem = ?, descricao = ?, data_inicio = ?, duracao = ?, preco = ?, instrutor = ?, nivel = ?, vagas_disponiveis = ? WHERE id = ?',
        [curso.titulo, curso.imagem, curso.descricao, curso.data_inicio, curso.duracao, curso.preco, curso.instrutor, curso.nivel, curso.vagas_disponiveis, id]
    );
}

async function deletarCurso(id) {
    await pool.query('DELETE FROM cursos WHERE id = ?', [id]);
}

module.exports = { listarCursos, buscarCursoPorId, criarCurso, atualizarCurso, deletarCurso };