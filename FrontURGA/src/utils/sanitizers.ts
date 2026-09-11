export const removerAcentos = (value: string) => {
    if (typeof value !== 'string') return value;
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};