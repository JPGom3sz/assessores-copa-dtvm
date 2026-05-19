// ═══════════════════════════════════════════════════════════════════
//  COPA BRB INVESTIMENTOS 2026 — DADOS
// ═══════════════════════════════════════════════════════════════════
//
//  COMO USAR:
//  1. Atualize QUINZENAS para alimentar os resultados de cada período.
//  2. A tabela "Geral" é calculada AUTOMATICAMENTE somando todas as
//     quinzenas — mas você pode sobrescrever qualquer campo em
//     GERAL_OVERRIDE (explicação abaixo).
//
// ───────────────────────────────────────────────────────────────────
//  ESTRUTURA DE CADA QUINZENA:
//  {
//    label: 'Nome exibido no seletor (ex: "1ª Quinzena · Jan")',
//    data: [
//      {
//        nome: 'Nome do assessor',           ← deve bater com ASSESSORES
//        retencaoV: 75,                      ← número de 0 a 100 (barra visual)
//        retencao: '75%',                    ← texto exibido
//        captacao: 'R$ 1.250.000',           ← texto exibido
//        captacaoV: 1250000,                 ← valor numérico (para somar no geral)
//        receita: 'R$ 32.000',              ← texto exibido
//        receitaV: 32000,                    ← valor numérico (para somar no geral)
//        pontos: 87,                         ← pontuação da quinzena
//      },
//      ...
//    ]
//  }
//
//  GERAL_OVERRIDE — sobrescrever campos do acumulado geral:
//  Use este objeto para corrigir ou ajustar valores calculados
//  automaticamente. Qualquer campo não listado aqui é calculado
//  normalmente pela soma das quinzenas.
//
//  Formato:
//  {
//    'Nome do Assessor': {
//      retencao: '88%',      ← sobrescreve o texto de retenção
//      retencaoV: 88,        ← sobrescreve a barra visual
//      captacao: 'R$ X',     ← sobrescreve o texto de captação
//      receita: 'R$ Y',      ← sobrescreve o texto de receita
//      pontos: 150,          ← sobrescreve pontuação total
//    }
//  }
// ═══════════════════════════════════════════════════════════════════

const ASSESSORES = [
    { nome: 'Luis Siscato',      foto: 'img/Figurinha Luis.png',    avColor: '#00d2ff' },
    { nome: 'Erick Rodrigo',     foto: 'img/Figurinha Erick.png',   avColor: '#b8b8b8' },
    { nome: 'Pedro Aleixo',      foto: 'img/Figurinha Pedro.png',   avColor: '#cd7f32' },
    { nome: 'Rafael Barbosa',    foto: 'img/Figurinha Rafael.png',  avColor: '#5577aa' },
    { nome: 'Clérton Macambira', foto: 'img/Figurinha Clerton.png', avColor: '#5577aa' },
    { nome: 'Sam Bastos',        foto: 'img/Figurinha Sam.png',     avColor: '#5577aa' },
];

// ── QUINZENAS ──────────────────────────────────────────────────────
//  Adicione ou edite quinzenas aqui.
//  A primeira da lista é exibida por padrão ao carregar a página.
const QUINZENAS = [
    {
       label: '1ª Quinzena',
        status: 'Em breve', 
        data: [
            { nome: 'Luis Siscato',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Erick Rodrigo',     retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Pedro Aleixo',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Rafael Barbosa',    retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Clérton Macambira', retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Sam Bastos',        retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
        ]
    },
     
     {
         label: '2ª Quinzena',
        status: 'Em breve', 
        data: [
            { nome: 'Luis Siscato',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Erick Rodrigo',     retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Pedro Aleixo',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Rafael Barbosa',    retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Clérton Macambira', retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Sam Bastos',        retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
        ]
    },
     {
         label: '3ª Quinzena',
        status: 'Em breve', 
        data: [
            { nome: 'Luis Siscato',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Erick Rodrigo',     retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Pedro Aleixo',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Rafael Barbosa',    retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Clérton Macambira', retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Sam Bastos',        retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
        ]
    },
     {
         label: '4ª Quinzena',
         status: 'Em breve', 
        data: [
            { nome: 'Luis Siscato',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Erick Rodrigo',     retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Pedro Aleixo',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Rafael Barbosa',    retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Clérton Macambira', retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Sam Bastos',        retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
        ]
    },

{
         label: 'Grande final',
           status: 'Em breve', 
         data: [
            { nome: 'Luis Siscato',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Erick Rodrigo',     retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Pedro Aleixo',      retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Rafael Barbosa',    retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Clérton Macambira', retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
            { nome: 'Sam Bastos',        retencaoV: 0, retencao: '0%', captacao: 'R$ 0', captacaoV: 0, receita: 'R$ 0', receitaV: 0, pontos: 0 },
        ]
    },

    
     


    
];

// ── GERAL_OVERRIDE ─────────────────────────────────────────────────
//  Sobrescreva aqui qualquer campo do acumulado geral.
//  Deixe em branco ({}) para usar apenas o cálculo automático.
const GERAL_OVERRIDE = {
    // Exemplo:
    // 'Luis Siscato': { pontos: 200, retencao: '85%', retencaoV: 85 },
};
