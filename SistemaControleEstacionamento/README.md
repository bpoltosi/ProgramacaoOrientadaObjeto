Sistema de Controle de Estacionamento — Fase 1

Núcleo funcional em JavaScript (Node.js, CommonJS): cadastro de clientes, entrada/saída, cobrança por tipo de cliente e desconto de cliente frequente. 

Pré-requisitos
- [Node.js](https://nodejs.org/) (qualquer versão LTS recente)

Não há dependências de pacote: não é necessário `npm install`.

Como rodar?
Na pasta do projeto executar o comando:
node main.js


O script demonstra cadastro, entradas, saídas, regras de bloqueio e o desconto de cliente frequente.

Estrutura

fase1/
  main.js
  README.md
  src/
    App.js
    clientes/
      Cliente.js
      ClienteAvulso.js
      Estudante.js
      Professor.js
      Empresa.js
      CadastroClientes.js
    descontos/
      Desconto.js
      DescontoClienteFrequente.js
    estacionamento/
      RegistroDeEntradas_E_Saidas.js
      TicketEstacionamento.js
    relatorios/
      RelatoriosGerenciais.js
