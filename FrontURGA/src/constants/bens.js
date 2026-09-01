import { removerAcentos } from '../utils/sanitizers.js';
export const BENS = [
    "Carro",
    "Moto",
    "Imóvel",
    "Caminhão",
    "Ônibus",
    "Embarcação",
    "Aeronave",
    "Bicicleta",
    "Dinheiro",
    "Dólar",
    "Euro",
    "Computador",
    "Celular",
    "Imóvel Rural",
    "Joias",
    "Móveis",
    "Arte",
    "Criptoativos",
    "Semoventes"
]

export const BENS_VALIDOS = BENS.map(item => removerAcentos(item.trim().toUpperCase()));
