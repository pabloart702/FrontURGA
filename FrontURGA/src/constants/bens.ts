import { removerAcentos } from '../utils/sanitizers';
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
    "Computador",
    "Celular",
    "Imóvel Rural",
    "Joias",
    "Móveis",
    "Arte",
    "Criptoativos",
    "Semoventes",
    "Arma"
]

export const BENS_VALIDOS = BENS.map(item => removerAcentos(item.trim().toUpperCase()));
