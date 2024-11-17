import Pagination from '@/app/ui/casos/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/casos/table';
import { CreateProcesso } from '@/app/ui/processos/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoiceSkeleton} from '@/app/ui/skeletons';
import { Suspense } from 'react';

import { buscaPaginasCasos } from '@/app/lib/data';
 
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await buscaPaginasCasos(query);


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Casos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Procurar em processos..." />
        <CreateProcesso />
      </div>

       <Suspense key={query + currentPage} fallback={<InvoiceSkeleton/>}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>


      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}