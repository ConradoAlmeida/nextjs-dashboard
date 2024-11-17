import Form from '@/app/ui/casos/edit-form';
import Breadcrumbs from '@/app/ui/casos/breadcrumbs';
import { buscaClientes, buscaCasosPorId } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [caso, clientes] = await Promise.all([
        buscaCasosPorId(id),
        buscaClientes(),
    ]);
 
    if (!caso){
      notFound();
    }

    return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Processos', href: '/dashboard/casos' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/casos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form caso={caso} cliente={clientes} />
    </main>
  );
}