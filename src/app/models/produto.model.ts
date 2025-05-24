export interface Produto {
  id: number;
  nome: string;
  preco: number;
  marca: string;
  imagem: string;
  categoria: string;
  descricao?: string;
}
