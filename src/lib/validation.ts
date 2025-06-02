import { z } from 'zod'

// Esquemas de validação
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

export const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
  phone: z.string().optional(),
})

export const pixSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  customer: customerSchema,
  event: z.object({
    partnerId: z.string(),
    name: z.string(),
    date: z.string(),
    location: z.string(),
    ticketType: z.string(),
    isHalfPrice: z.boolean(),
  }),
})

// Função helper para validar dados
export async function validateData<T>(schema: z.Schema<T>, data: unknown): Promise<T> {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw error
  }
}
