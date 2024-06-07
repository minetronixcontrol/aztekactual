
const BanderaUS = {};
let flagEU = 'data:image/png;base64,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';
BanderaUS.imagen = flagEU;

module.exports = BanderaUS;