import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  ProcessoForm,
  ProcessosTable,
  LatestProcessoRaw,
  Revenue,
  UltimosCasos,
  TabelaCasos,
  CasoForm,
  CasosData

} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {

    // console.log('Fetching revenue data...');

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestProcessos() {
  try {
    const data = await sql<LatestProcessoRaw>`
      SELECT processos.amount, customers.name, customers.image_url, customers.email, processos.id, status
      FROM processos
      JOIN customers ON processos.customer_id = customers.id
      WHERE status = 'paid'
      ORDER BY processos.date DESC
      LIMIT 5`;

    const latestProcessos = data.rows.map((Processo) => ({
      ...Processo,
      amount: formatCurrency(Processo.amount),
    }));
    return latestProcessos;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest processos.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const ProcessoCountPromise = sql`SELECT COUNT(*) FROM processos`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const ProcessoStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM processos`;

    const data = await Promise.all([
      ProcessoCountPromise,
      customerCountPromise,
      ProcessoStatusPromise,
    ]);

    const numberOfProcessos = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidProcessos = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingProcessos = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfProcessos,
      totalPaidProcessos,
      totalPendingProcessos,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredProcessos(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  try {
    const processos = await sql<ProcessosTable>`
    SELECT 
    processos.id,
    processos.amount,
    processos.date,
    processos.status,
    customers.name,
    customers.email,
    customers.image_url
    FROM processos
    JOIN customers ON processos.customer_id = customers.id
    WHERE
    customers.name ILIKE ${`%${query}%`} OR
    customers.email ILIKE ${`%${query}%`} OR
    processos.amount::text ILIKE ${`%${query}%`} OR
    processos.date::text ILIKE ${`%${query}%`} OR
    processos.status ILIKE ${`%${query}%`}
    ORDER BY processos.date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    
    return processos.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch processos.');
  }
}

export async function fetchProcessosPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM processos
    JOIN customers ON processos.customer_id = customers.id
    WHERE
    customers.name ILIKE ${`%${query}%`} OR
    customers.email ILIKE ${`%${query}%`} OR
    processos.amount::text ILIKE ${`%${query}%`} OR
    processos.date::text ILIKE ${`%${query}%`} OR
    processos.status ILIKE ${`%${query}%`}
    `;
    
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of processos.');
  }
}


export async function fetchProcessoById(id: string) {
  try {
    const data = await sql<ProcessoForm>`
    SELECT 
    processos.id,
    processos.customer_id,
    processos.amount,
    processos.status
    FROM processos
    WHERE processos.id = ${id};
    `;
    
    const Processo = data.rows.map((Processo) => ({
      ...Processo,
      // Convert amount from cents to dollars
      amount: Processo.amount / 100,
    }));
    
    console.log(Processo);    
    return Processo[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Processo.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
    SELECT
    id,
    name
    FROM customers
    ORDER BY name ASC
    `;
    
    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT 
    customers.id,
    customers.name,
    customers.email,
    customers.image_url,
    COUNT(processos.id) AS total_processos,
    SUM(CASE WHEN processos.status = 'pending' THEN processos.amount ELSE 0 END) AS total_pending,
    SUM(CASE WHEN processos.status = 'paid' THEN processos.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN processos ON customers.id = processos.customer_id
		WHERE
    customers.name ILIKE ${`%${query}%`} OR
    customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;
    
    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
    
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}


// funcoes para os novos dados casos e clientes no postgres

const CASOS_ITENS_POR_PAGINA = 10;

export async function buscaUltimosCasos() {
  try {
    const data = await sql<UltimosCasos>`
    SELECT casos.nprocesso, casos.resumo, casos.data, casos.vara, clientes.email, casos.id, situacao
    FROM casos
    JOIN clientes ON casos.cliente_uuid = clientes.id
    WHERE situacao = 'Aberto'
    ORDER BY casos.data DESC
    LIMIT 2`;
    
    const ultimosCasos = data.rows.map((Caso) => ({
      ...Caso,
      // amount: formatCurrency(Caso.amount),
    }));
    return ultimosCasos;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest processos.');
  }
}

export async function buscaCasosFiltrados(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * CASOS_ITENS_POR_PAGINA;
  
  try {
    const casos = await sql<TabelaCasos>`
    SELECT 
    casos.id,
    casos.nprocesso,
    casos.resumo,
    casos.data,
    casos.vara,
    clientes.nome,
    clientes.email,
    situacao
    FROM casos
    JOIN clientes ON casos.cliente_uuid = clientes.id
    WHERE
    clientes.nome ILIKE ${`%${query}%`} OR
    clientes.email ILIKE ${`%${query}%`} OR
    casos.nprocesso::text ILIKE ${`%${query}%`} OR
    casos.data::text ILIKE ${`%${query}%`} OR
    casos.situacao ILIKE ${`%${query}%`}
    ORDER BY casos.data DESC
    LIMIT ${CASOS_ITENS_POR_PAGINA} OFFSET ${offset}
    `;
    // console.log('--------')
    // console.log(casos.rows)
    // console.log('--------')
    return casos.rows;
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch processos.');
  }
}

export async function buscaPaginasCasos(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM casos
    JOIN clientes ON casos.cliente_uuid = clientes.id
    WHERE
    clientes.nome ILIKE ${`%${query}%`} OR
    clientes.email ILIKE ${`%${query}%`} OR
    casos.nprocesso::text ILIKE ${`%${query}%`} OR
    casos.data::text ILIKE ${`%${query}%`} OR
    casos.situacao ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of processos.');
  }
}

export async function buscaCasosPorId(id: string) {
  try {
    const data = await sql<CasoForm>`
    SELECT 
    casos.id,
    casos.cliente_uuid,
    casos.nprocesso,
    casos.situacao
    FROM casos
    WHERE casos.id = ${id};
    `;
    
    const Caso = data.rows.map((Caso) => ({
      ...Caso,
      // Convert amount from cents to dollars
      // amount: Caso.amount / 100,
    }));
    
    console.log(Caso);    
    return Caso[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Processo.');
  }
}

export async function buscaDadosCard() {
  try {
    const quantTotalCasos = sql`SELECT COUNT(*) FROM casos`;
    const quantTotalClientes = sql`SELECT COUNT(*) FROM clientes`;
    const quantCasosAberto = sql`SELECT count(*)
      FROM casos
	    where situacao = 'Aberto'`;
    const quantCasosSuspenso = sql`SELECT count(*)
      FROM casos
	    where situacao = 'Suspenso'`;

      
      const data = await Promise.all([
        quantTotalCasos,
        quantTotalClientes,
        quantCasosAberto,
        quantCasosSuspenso,
      ]);
      
      const numeroDeProcessos = Number(data[0].rows[0].count ?? '0');
      const numeroDeClientes = Number(data[1].rows[0].count ?? '0');
      const totalCasosEmAberto = Number(data[2].rows[0].count ?? '0');
      const totalCasosSuspensos = Number(data[3].rows[0].count ?? '0');
      

    return {
      numeroDeProcessos,
      numeroDeClientes,
      totalCasosEmAberto,
      totalCasosSuspensos,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}


export async function buscaCasosData() {
  try {

    const data = await sql<CasosData>`SELECT
    EXTRACT(YEAR FROM data) AS ano,
    EXTRACT(MONTH FROM data) AS mes,
    COUNT(nprocesso) AS quantidade_processos
    FROM casos
    WHERE EXTRACT(YEAR FROM data) = 2024
    GROUP BY
      EXTRACT(YEAR FROM data),
      EXTRACT(MONTH FROM data)
    ORDER BY
      ano, mes;`;

    return data.rows;


  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}