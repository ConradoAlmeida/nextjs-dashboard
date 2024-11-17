import Form from '@/app/ui/casos/create-form';
import Breadcrumbs from '@/app/ui/casos/breadcrumbs';
import { buscaClientes } from '@/app/lib/data';
 
export default async function Page() {
  const clientes = await buscaClientes();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Casos', href: '/dashboard/casos' },
          {
            label: 'Novo Caso',
            href: '/dashboard/casos/create',
            active: true,
          },
        ]}
      />
      <Form clientes={clientes} />
    </main>
  );
}