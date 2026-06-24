export interface MemorandoBuscarTodosParamsInterface {
  buscar?: string;
  ordenacao?: string;
  tipoOrdenacao?: string;
  status?: string;
  destinatario?: boolean | 'true' | 'false' | 1 | 0;
  remetente?: boolean | 'true' | 'false' | 1 | 0;
  pagina?: number;
  itensPorPagina?: number;
}
