export const validarCliente = (nome, cpf, email) => {
    if (!nome.trim() || !cpf.trim() || !email.trim()) throw new Error("Todos os campos são obrigatórios.");
    if (!email.includes('@')) throw new Error("O email deve ser válido (conter @).");
};

export const validarTransacao = (tipo, valor, saldoAtual) => {
    const val = parseFloat(valor);
    if (isNaN(val) || val <= 0) throw new Error("O valor deve ser maior que zero.");
    if (tipo === 'Saque' && val > saldoAtual) throw new Error("Saldo insuficiente para este saque.");
};