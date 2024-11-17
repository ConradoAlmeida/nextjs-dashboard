'use client';
import { useActionState } from 'react';

import { CampoCliente } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { criarCaso, State } from '@/app/lib/actions';

export default function Form({ clientes }: { clientes: CampoCliente[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(criarCaso, initialState);

  return (
<form action={formAction}>
  <div className="rounded-md bg-gray-50 p-4 md:p-6">
    {/* Customer Name */}
    <div className="mb-4">
      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
        Escolha o Cliente
      </label>
      <div className="relative">
        <select
          id="clinete"
          name="clienteId"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          defaultValue=""
          aria-describedby="customer-error"
        >
          <option value="" disabled>
            Escolha o Cliente
          </option>
          {clientes.map((nome) => (
            <option key={nome.id} value={nome.id}>
              {nome.nome}
            </option>
          ))}
        </select>
        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.errors?.clienteId &&
          state.errors.clienteId.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

        {/* Situacao do Caso */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Escolha a Situação do Caso
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="situacao"
                name="situacao"
                type="text"
                placeholder="Situação do Caso"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Numero do caso */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Digite o Número do Processo
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="nprocesso"
                name="nprocesso"
                type="text"
                placeholder="Número do Processo"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Resumo do caso */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Digite o Resumo do Caso
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="resumo"
                name="resumo"
                type="text"
                placeholder="Resumo do Caso"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Vara do caso */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Digite o Vara onde está o Caso
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="resumo"
                name="resumo"
                type="text"
                placeholder="Vara do Caso"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>




      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/processos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Novo Caso</Button>
      </div>
    </form>
  );
}
