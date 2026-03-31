export const mostrarMensagem = (texto, tipo = 'sucesso') => {
    const msgBox = document.getElementById('msg-box');
    msgBox.textContent = texto;
    msgBox.className = tipo === 'sucesso' ? 'msg-sucesso' : 'msg-erro';
    msgBox.classList.remove('hidden');
    setTimeout(() => msgBox.classList.add('hidden'), 3000);
};

export const renderTabelaClientes = (clientes, onEdit, onDelete) => {
    const tbody = document.getElementById('tabela-clientes');
    tbody.innerHTML = clientes.map(c => `
        <tr>
            <td data-label="Nome">${c.nome}</td>
            <td data-label="CPF">${c.cpf}</td>
            <td data-label="Email">${c.email}</td>
            <td>
                <button class="btn-edit" onclick="window.editarCliente('${c.id}')">Editar</button>
                <button class="btn-del" onclick="window.deletarCliente('${c.id}')">Deletar</button>
            </td>
        </tr>
    `).join('');
};

export const renderTabelaContas = (contas, clientes, onStatusChange, onDelete) => {
    const tbody = document.getElementById('tabela-contas');
    tbody.innerHTML = contas.map(c => {
        const cliente = clientes.find(cl => String(cl.id) === String(c.clienteId));
        return `
        <tr>
            <td data-label="Número">${c.numero}</td>
            <td data-label="Cliente">${cliente ? cliente.nome : 'Desconhecido'}</td>
            <td data-label="Tipo">${c.tipo}</td>
            <td data-label="Saldo">R$ ${c.saldo.toFixed(2)}</td>
            <td data-label="Status">
                <select onchange="window.mudarStatusConta('${c.id}', this.value)">
                    <option value="Ativa" ${c.status === 'Ativa' ? 'selected' : ''}>Ativa</option>
                    <option value="Inativa" ${c.status === 'Inativa' ? 'selected' : ''}>Inativa</option>
                </select>
            </td>
            <td><button class="btn-del" onclick="window.deletarConta('${c.id}')">Deletar</button></td>
        </tr>
    `}).join('');
};

export const renderTabelaTransacoes = (transacoes) => {
    const tbody = document.getElementById('tabela-transacoes');
    // Inverte a ordem das transações para mostrar a mais recente primeiro
    const transacoesOrdenadas = [...transacoes].reverse();
    
    tbody.innerHTML = transacoesOrdenadas.map(t => `
        <tr>
            <td data-label="Data">${t.data}</td>
            <td data-label="Tipo">${t.tipo}</td>
            <td data-label="Valor">R$ ${t.valor.toFixed(2)}</td>
            <td data-label="Saldo Novo">R$ ${t.novoSaldo.toFixed(2)}</td>
        </tr>
    `).join('');
};

export const preencherSelects = (clientes, contas) => {
    const selectCliente = document.getElementById('conta-clienteId');
    selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>' + 
        clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');

    const selectConta = document.getElementById('transacao-contaId');
    selectConta.innerHTML = '<option value="">Selecione a Conta</option>' + 
        contas.filter(c => c.status === 'Ativa').map(c => `<option value="${c.id}">${c.numero} - ${clientes.find(cl => String(cl.id) === String(c.clienteId))?.nome || ''}</option>`).join('');
};