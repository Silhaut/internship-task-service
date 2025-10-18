export type CreateUserDto = {
  telegramId: string
  username: string
  firstName: string
  lastName: string
  password: string
  phone: string
  role: 'USER' | 'ADMIN'
}