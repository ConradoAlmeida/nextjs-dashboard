'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
    id: z.string(),

    clienteId: z.string({
      invalid_type_error: 'Selecione um cliente,',
    }),

    situacao: z.string({
      invalid_type_error: 'Digite a situação,',
    }),

    vara: z.string({
      invalid_type_error: 'Digite a vara,',
    }),

    resumo: z.string({
      invalid_type_error: 'Digite um resumo,',
    }),

    nprocesso: z.string({
      invalid_type_error: 'Digite o número do processo,',
    }),


    date: z.string(),

});


const CriarCaso = FormSchema.omit({ id: true, date: true});

 




const UpdateProcesso = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    clienteId?: string[];
    situacao?: string[];
    vara?: string[];
    nprocesso?: string[];
    resumo?: string[];
  };
  message?: string | null;
};



export async function createProcesso(prevState: State, formData: FormData) {
  // Validate form using Zod

  console.log('deu certo')
  

  const validatedFields = CriarCaso.safeParse({
    clienteId: formData.get('cliente_uuid'),
    nprocesso: formData.get('nprocesso'),
    resumo: formData.get('resumo'),
    vara: formData.get('vara'),
    situacao: formData.get('situacao'),
  });
  
  console.log(validatedFields);
  
  
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  
  // Prepare data for insertion into the database
  const { clienteId, situacao, vara } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  
  // Insert data into the database


  try {
    await sql`
      INSERT INTO casos (cliente_uuid, nprocesso, resumo, data, vara, situacao )
      VALUES (${clienteId}, ${situacao}, ${vara}, ${date})
    `;

  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the processos page and redirect the user.
  revalidatePath('/dashboard/casos');
  redirect('/dashboard/casos');
}

export async function criarCaso(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CriarCaso.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { clienteId, situacao, vara } = validatedFields.data;
  
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO casos (cliente_uuid, situacao, vara, date)
      VALUES (${clienteId}, ${situacao}, ${vara}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the processos page and redirect the user.
  revalidatePath('/dashboard/casos');
  redirect('/dashboard/casos');
}

export async function updateProcesso(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateProcesso.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { clienteId, situacao, vara } = validatedFields.data;
 
  try {
    await sql`
      UPDATE casos
      SET customer_id = ${clienteId}, amount = ${situacao}, status = ${vara}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/casos');
  redirect('/dashboard/casos');
}



  export async function deleteProcesso(id: string) {
    // throw new Error('Failed to Delete Invoice');

    try{
      await sql`DELETE FROM processos WHERE id = ${id}`;
      revalidatePath('/dashboard/casos');
      return { message: 'Deleted Invoite.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Invoice.' };
    }
  }


  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }