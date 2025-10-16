-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_option_weights" (
    "id" TEXT NOT NULL,
    "answerOptionId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answer_option_weights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_answers" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "test_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "scoreDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegramId_key" ON "users"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "answer_option_weights_answerOptionId_professionId_key" ON "answer_option_weights"("answerOptionId", "professionId");

-- CreateIndex
CREATE UNIQUE INDEX "professions_name_key" ON "professions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "test_results_testId_key" ON "test_results"("testId");

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_weights" ADD CONSTRAINT "answer_option_weights_answerOptionId_fkey" FOREIGN KEY ("answerOptionId") REFERENCES "answer_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option_weights" ADD CONSTRAINT "answer_option_weights_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answer_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
