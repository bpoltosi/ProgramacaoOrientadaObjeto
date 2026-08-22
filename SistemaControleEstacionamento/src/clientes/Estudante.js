const Cliente = require('./Cliente');

/**
 * Cliente estudante: uma placa, cobrança por ingresso (pré-pago).
 * Saldo negativo não impede a saída, mas bloqueia novas entradas.
 */
class Estudante extends Cliente {
  /** Valor de um ingresso (placeholder, fácil de ajustar). */
  static CUSTO_FIXO_POR_INGRESSO = 15;

  /**
   * @param {string} documento
   * @param {string} nome
   * @param {number} [saldo=0]
   */
  constructor(documento, nome, saldo = 0) {
    super(documento, nome);
    /** @type {number} */
    this.saldo = saldo;
  }

  /**
   * Estudante pode cadastrar no máximo uma placa.
   * @param {string} placa
   */
  adicionarPlaca(placa) {
    if (this.placas.size >= 1) {
      throw new Error('estudante já possui placa cadastrada');
    }
    this.placas.add(placa);
  }

  /**
   * Soma crédito ao saldo.
   * @param {number} valor
   */
  carregarSaldo(valor) {
    this.saldo += valor;
  }

  /**
   * Subtrai do saldo. Pode ficar negativo.
   * @param {number} valor
   */
  debitar(valor) {
    this.saldo -= valor;
  }

  /**
   * Cobra um ingresso por dia de calendário tocado (local).
   * Saída após meia-noite gera ingresso extra.
   * @param {Date} entrada
   * @param {Date} saida
   * @returns {number}
   */
  calcularCusto(entrada, saida) {
    const dias = diasCalendarioTocados(entrada, saida);
    return Estudante.CUSTO_FIXO_POR_INGRESSO * dias;
  }

  /**
   * @returns {boolean}
   */
  podeAutorizarEntrada() {
    return this.saldo >= 0;
  }
}

/**
 * Quantidade de dias de calendário locais abrangidos pelo intervalo [entrada, saida].
 * Mesmo dia = 1; cada meia-noite cruzada incrementa 1.
 * @param {Date} entrada
 * @param {Date} saida
 * @returns {number}
 */
function diasCalendarioTocados(entrada, saida) {
  const inicio = new Date(entrada.getFullYear(), entrada.getMonth(), entrada.getDate());
  const fim = new Date(saida.getFullYear(), saida.getMonth(), saida.getDate());
  const msPorDia = 24 * 60 * 60 * 1000;
  return Math.floor((fim - inicio) / msPorDia) + 1;
}

module.exports = Estudante;
