export type CreateTestResultDto = {
  testId: string
  professionId: string,
  scoreDetails: Record<string, number>
}