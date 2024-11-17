// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Cliente = {
  id: string;
  nome: string;
  email: string;
};

export type Processo = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

// export type Revenue = {
//   month: string;
//   revenue: number;
// };

export type LatestProcesso = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};


// implementacao da tabela casos do banco de dados
export type UltimosCasos = {
  id: string;
  nprocesso: string;
  resumo: string;
  data: string;
  vara: string;
  situacao: string;
  cliente_id: string;
  nome: string;
};


// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestProcessoRaw = Omit<LatestProcesso, 'amount'> & {
  amount: number;
};

export type ProcessosTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type TabelaCasos = {

  id: string;
  nprocesso: string;
  resumo: string;
  data: string;
  vara: string;
  situacao: string;
  cliente_id: string;
  nome: string;
  email: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_processos: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_processos: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type CampoCliente = {
  id: string;
  nome: string;
};

export type ProcessoForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CasoForm = {
  id: string;
  cliente_uuid: string;
  nprocessp: string;
  situacao: string;
};




export type CasosData = {
  ano: string;
  mes: string;
  quantidade_processos: string;
};


export interface YAxisLabels {
  yAxisLabels: number[];
  topLabel: number;
};