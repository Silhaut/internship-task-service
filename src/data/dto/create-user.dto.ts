export type CreateUserDto = {
  telegramId: string
  firstName: string
  lastName: string
  phone: string
  role: 'USER' | 'ADMIN'
}