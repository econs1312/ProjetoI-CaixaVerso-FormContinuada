import { api } from './api.js';
import { validarCliente, validarTransacao } from './validacao.js';
import { mostrarMensagem, renderTabelaClientes, renderTabelaContas, renderTabelaTransacoes, preencherSelects } from './ui.js';

let state = { clientes: [], contas: [], transacoes: [] };

// INICIALIZAÇÃO
async function carregarDados() {
    try {
        state.clientes = await api.get('clientes');
        state.contas = await api.get('contas');
        state.transacoes = await api.get('transacoes'); 
        
        atualizarUI();
    } catch (error) {
        mostrarMensagem('Erro ao conectar com o servidor.', 'erro');
        console.error("Erro no carregamento:", error);
        alert("Erro ao carregar os dados. Verifique se o json-server está rodando no terminal!");
    }
}

function atualizarUI() {
    renderTabelaClientes(state.clientes);
    renderTabelaContas(state.contas, state.clientes);
    renderTabelaTransacoes(state.transacoes);
    preencherSelects(state.clientes, state.contas); // Atualiza os dropdowns
}

// --- GESTÃO DE CLIENTES ---
document.getElementById('form-cliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cliente-id').value;
    const nome = document.getElementById('cliente-nome').value;
    const cpf = document.getElementById('cliente-cpf').value;
    const email = document.getElementById('cliente-email').value;

    try {
        validarCliente(nome, cpf, email);
        const payload = { nome, cpf, email };
        
        if (id) {
            await api.put('clientes', id, payload);
        } else {
            await api.post('clientes', payload);
        }
        
        // 1. Força o recarregamento dos dados do servidor para o frontend
        await carregarDados(); 

        // 2. Exibe as mensagens de sucesso (Caixa verde + Alerta solicitado)
        mostrarMensagem('Cliente salvo com sucesso!');
        alert(`Sucesso! O cliente "${nome}" foi cadastrado e já está disponível para abrir contas.`);
        
        // 3. Limpa o formulário
        e.target.reset();
        document.getElementById('cliente-id').value = '';
        
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
        alert(`Erro ao salvar cliente: ${error.message}`);
    }
});

window.deletarCliente = async (id) => {
    if(!confirm('Tem certeza? Isso pode quebrar contas atreladas.')) return;
    try {
        await api.delete('clientes', id);
        mostrarMensagem('Cliente removido!');
        await carregarDados();
    } catch (error) { 
        mostrarMensagem(error.message, 'erro'); 
    }
};

window.editarCliente = (id) => {
    const cliente = state.clientes.find(c => String(c.id) === String(id));
    if (cliente) {
        document.getElementById('cliente-id').value = cliente.id;
        document.getElementById('cliente-nome').value = cliente.nome;
        document.getElementById('cliente-cpf').value = cliente.cpf;
        document.getElementById('cliente-email').value = cliente.email;
    }
};

// Filtro de Clientes (Bônus)
document.getElementById('filtro-cliente').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = state.clientes.filter(c => c.nome.toLowerCase().includes(termo));
    renderTabelaClientes(filtrados);
});

// --- GESTÃO DE CONTAS ---
document.getElementById('form-conta').addEventListener('submit', async (e) => {
    e.preventDefault();
    const clienteId = document.getElementById('conta-clienteId').value;
    const tipo = document.getElementById('conta-tipo').value;

    try {
        const novaConta = {
            numero: Math.floor(1000 + Math.random() * 9000), 
            clienteId, 
            tipo, 
            saldo: 0, 
            status: "Ativa"
        };
        await api.post('contas', novaConta);
        
        await carregarDados();
        mostrarMensagem('Conta criada com sucesso!');
        alert("Conta criada com sucesso!");
        e.target.reset();
    } catch (error) { 
        mostrarMensagem(error.message, 'erro'); 
    }
});

window.mudarStatusConta = async (id, novoStatus) => {
    try {
        const conta = state.contas.find(c => String(c.id) === String(id));
        await api.put('contas', id, { ...conta, status: novoStatus });
        mostrarMensagem('Status atualizado!');
        await carregarDados();
    } catch (error) { 
        mostrarMensagem(error.message, 'erro'); 
    }
};

window.deletarConta = async (id) => {
    if(!confirm('Deletar esta conta?')) return;
    try {
        await api.delete('contas', id);
        mostrarMensagem('Conta removida!');
        await carregarDados();
    } catch (error) { 
        mostrarMensagem(error.message, 'erro'); 
    }
};

// --- TRANSAÇÕES ---
document.getElementById('form-transacao').addEventListener('submit', async (e) => {
    e.preventDefault();
    const contaId = document.getElementById('transacao-contaId').value;
    const tipo = document.getElementById('transacao-tipo').value;
    const valor = parseFloat(document.getElementById('transacao-valor').value);

    try {
        const conta = state.contas.find(c => String(c.id) === String(contaId));
        validarTransacao(tipo, valor, conta.saldo);

        const novoSaldo = tipo === 'Depósito' ? conta.saldo + valor : conta.saldo - valor;

        await api.put('contas', contaId, { ...conta, saldo: novoSaldo });

        const transacao = {
            contaId, tipo, valor, novoSaldo,
            data: new Date().toISOString().split('T')[0] 
        };
        await api.post('transacoes', transacao);

        await carregarDados();
        mostrarMensagem('Transação efetuada com sucesso!');
        alert("Transação registrada com sucesso!");
        e.target.reset();
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    }
});

// Boot do App
document.addEventListener('DOMContentLoaded', carregarDados);