import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { buscaDadosCard, fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  processos: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numeroDeProcessos,
    numeroDeClientes,
    totalCasosEmAberto,
    totalCasosSuspensos,
  } = await buscaDadosCard();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card title="Em aberto" value={totalCasosEmAberto} type="collected" />
      <Card title="Suspenso" value={totalCasosSuspensos} type="pending" />
      <Card title="Número de Processos" value={numeroDeProcessos} type="processos" />
      <Card
        title="Número de Clientes"
        value={numeroDeClientes}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'processos' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
