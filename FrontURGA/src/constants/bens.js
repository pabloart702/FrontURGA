import { removerAcentos } from '../utils/sanitizers.js';
export const BENS = [
    "Aeronave",
    "Arma",
    "Arte",
    "Bicicleta",
    "Caminhão",
    "Carro",
    "Celular",
    "Computador",
    "Criptoativos",
    "Dinheiro",
    "Dólar",
    "Embarcação",
    "Euro",
    "Imóvel",
    "Imóvel Rural",
    "Joias",
    "Moto",
    "Móveis",
    "Ônibus",
    "Semoventes"
]

export const BENS_VALIDOS = BENS.map(item => removerAcentos(item.trim().toUpperCase()));
