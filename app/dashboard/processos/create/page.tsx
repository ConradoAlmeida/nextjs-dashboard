import Form from '@/app/ui/processos/create-form';
import Breadcrumbs from '@/app/ui/processos/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/processos' },
          {
            label: 'Create Invoice',
            href: '/dashboard/processos/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}