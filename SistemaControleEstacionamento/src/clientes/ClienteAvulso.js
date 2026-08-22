const Cliente = require('./Cliente');
/*
    Cliente não cadastrado, criado sob demanda pela placa.
    Não é gerenciado por CadastroClientes.
 */
class ClienteAvulso extends Cliente {
  static VALOR_HORA = 8;
  static LIMITE_HORAS = 6;
  static VALOR_DIARIA = 60;

  /**
   * @param {string} placa identificador real do avulso
   */
  constructor(placa) {
    super(null, null);
    /** @type {string} */
    this.placa = placa;
    this.placas.add(placa);
  }
  /**
    Avulso tem uma única placa (a que originou a instância).
   * @param {string} placa
   */

  adicionarPlaca(placa) {
    if (this.placas.size >= 1) {
      throw new Error('cliente avulso já possui placa associada');
    }
    this.placa = placa;
    this.placas.add(placa);
  }
  /**
    <= 6h sem cruzar meia-noite: hora iniciada conta cheia.
    > 6h ou cruzou meia-noite: diária × dias de calendário tocados.
    Se (descontoAplicavel) for informado, aplica (.aplicar(valorBruto)) 
   
   * @param {Date} entrada
   * @param {Date} saida
   * @param {{ aplicar: (valorBase: number) => number }} [descontoAplicavel]
   * @returns {number}
   */
  calcularCusto(entrada, saida, descontoAplicavel) {
    const valorBruto = this._calcularValorBruto(entrada, saida);
    if (descontoAplicavel && typeof descontoAplicavel.aplicar === 'function') {
      return descontoAplicavel.aplicar(valorBruto);
    }
    return valorBruto;
  }

  /**
   * Bloqueio por recusa de pagamento é responsabilidade do registro de entradas.
   * @returns {boolean}
   */
  podeAutorizarEntrada() {
    return true;
  }

  /**
   * @param {Date} entrada
   * @param {Date} saida
   * @returns {number}
   * @private
   */
  _calcularValorBruto(entrada, saida) {
    const cruzouMeiaNoite = !mesmoDiaLocal(entrada, saida);
    const horasDecimais = (saida.getTime() - entrada.getTime()) / (60 * 60 * 1000);
    // Permanência instantânea ainda inicia uma hora de cobrança.
    const horasIniciadas = horasDecimais <= 0 ? 1 : Math.ceil(horasDecimais);

    if (!cruzouMeiaNoite && horasDecimais <= ClienteAvulso.LIMITE_HORAS) {
      return ClienteAvulso.VALOR_HORA * horasIniciadas;
    }

    return ClienteAvulso.VALOR_DIARIA * diasCalendarioTocados(entrada, saida);
  }
}

/**
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
function mesmoDiaLocal(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
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

module.exports = ClienteAvulso;
