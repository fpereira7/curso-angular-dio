export interface Filme {
    id?: number;
    titulo: string;
    urlFoto?: string;
    dataLancamento: Date;
    descricao?: string;
    notaIMDB: number;
    urlIMDB?: string;
    genero: string;
}