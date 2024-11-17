import Form from '@/app/ui/casos/edit-form';
import Breadcrumbs from '@/app/ui/casos/breadcrumbs';
// import { fetchCustomers, fetchProcessoById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
// export default async function Page(props: { params: Promise<{ id: string }> }) {
//     const params = await props.params;
//     const id = params.id;
//     const [processo, customers] = await Promise.all([
//         fetchProcessoById(id),
//         fetchCustomers(),
//     ]);
 
//     if (!processo){
//       notFound();
//     }

//     return (
//     <main>
//       <Breadcrumbs
//         breadcrumbs={[
//           { label: 'Processos', href: '/dashboard/processos' },
//           {
//             label: 'Edit Invoice',
//             href: `/dashboard/processos/${id}/edit`,
//             active: true,
//           },
//         ]}
//       />
//       <Form processo={processo} customers={customers} />
//     </main>
//   );
// }