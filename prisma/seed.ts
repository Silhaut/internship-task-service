import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Running seed');

  // === 1. Профессии ===
  await prisma.profession.createMany({
    data: [
      { name: 'Frontend', description: 'Разрабатывает пользовательские интерфейсы, работает с React, Angular, Vue.' },
      { name: 'Backend', description: 'Создаёт серверную логику, API и базы данных.' },
      { name: 'DevOps', description: 'Отвечает за CI/CD, деплой, инфраструктуру и стабильность систем.' },
      { name: 'UI/UX designer', description: 'Проектирует визуальные интерфейсы и пользовательский опыт.' },
      { name: 'ML engineer', description: 'Создаёт и обучает модели машинного обучения, анализирует данные.' },
    ],
    skipDuplicates: true,
  });

  // Получаем ID профессий
  const professions = await prisma.profession.findMany();
  const profByName = Object.fromEntries(professions.map((p) => [p.name, p.id]));

  // === 2. Вопросы ===
  const questionsData = [
    {
      text: 'Что вам больше всего интересно в работе?',
      answers: [
        {
          text: 'Создавать красивые интерфейсы и анимации.',
          weights: { Frontend: 3, Backend: 0, DevOps: 0, 'UI/UX designer': 3, 'ML engineer': 0 },
        },
        {
          text: 'Проектировать архитектуру и логику приложения.',
          weights: { Frontend: 1, Backend: 3, DevOps: 1, 'UI/UX designer': 0, 'ML engineer': 1 },
        },
        {
          text: 'Настраивать сервера и автоматизацию деплоя.',
          weights: { Frontend: 0, Backend: 1, DevOps: 3, 'UI/UX designer': 0, 'ML engineer': 1 },
        },
        {
          text: 'Работать с данными, экспериментировать с моделями.',
          weights: { Frontend: 0, Backend: 1, DevOps: 1, 'UI/UX designer': 0, 'ML engineer': 3 },
        },
      ],
    },
    {
      text: 'Что приносит вам больше удовольствия?',
      answers: [
        {
          text: 'Когда интерфейс выглядит идеально и работает плавно.',
          weights: { Frontend: 3, Backend: 0, DevOps: 0, 'UI/UX designer': 3, 'ML engineer': 0 },
        },
        {
          text: 'Когда сервер выдаёт быстрый и стабильный отклик.',
          weights: { Frontend: 0, Backend: 3, DevOps: 1, 'UI/UX designer': 0, 'ML engineer': 0 },
        },
        {
          text: 'Когда CI/CD работает без единого сбоя.',
          weights: { Frontend: 0, Backend: 1, DevOps: 3, 'UI/UX designer': 0, 'ML engineer': 0 },
        },
        {
          text: 'Когда модель делает точные прогнозы.',
          weights: { Frontend: 0, Backend: 1, DevOps: 0, 'UI/UX designer': 0, 'ML engineer': 3 },
        },
      ],
    },
    {
      text: 'Что вы любите изучать?',
      answers: [
        {
          text: 'Современные фреймворки — React, Vue, Angular.',
          weights: { Frontend: 3, Backend: 1, DevOps: 0, 'UI/UX designer': 1, 'ML engineer': 0 },
        },
        {
          text: 'Node.js, Nest.js, базы данных и REST API.',
          weights: { Frontend: 1, Backend: 3, DevOps: 1, 'UI/UX designer': 0, 'ML engineer': 0 },
        },
        {
          text: 'Docker, Kubernetes, CI/CD пайплайны.',
          weights: { Frontend: 0, Backend: 1, DevOps: 3, 'UI/UX designer': 0, 'ML engineer': 1 },
        },
        {
          text: 'Нейронные сети, Python и машинное обучение.',
          weights: { Frontend: 0, Backend: 1, DevOps: 0, 'UI/UX designer': 0, 'ML engineer': 3 },
        },
      ],
    },
    {
      text: 'Как вы предпочитаете решать задачи?',
      answers: [
        {
          text: 'Создаю прототип интерфейса и тестирую с пользователями.',
          weights: { Frontend: 2, Backend: 0, DevOps: 0, 'UI/UX designer': 3, 'ML engineer': 0 },
        },
        {
          text: 'Прорабатываю бизнес-логику и архитектуру API.',
          weights: { Frontend: 1, Backend: 3, DevOps: 1, 'UI/UX designer': 0, 'ML engineer': 0 },
        },
        {
          text: 'Автоматизирую процессы и повышаю надёжность.',
          weights: { Frontend: 0, Backend: 1, DevOps: 3, 'UI/UX designer': 0, 'ML engineer': 0 },
        },
        {
          text: 'Экспериментирую с моделями и параметрами данных.',
          weights: { Frontend: 0, Backend: 1, DevOps: 0, 'UI/UX designer': 0, 'ML engineer': 3 },
        },
      ],
    },
    {
      text: 'Что для вас идеальный результат работы?',
      answers: [
        {
          text: 'Интерфейс, которым приятно пользоваться.',
          weights: { Frontend: 3, Backend: 0, DevOps: 0, 'UI/UX designer': 3, 'ML engineer': 0 },
        },
        {
          text: 'Система, которая работает быстро и стабильно.',
          weights: { Frontend: 1, Backend: 3, DevOps: 1, 'UI/UX designer': 0, 'ML engineer': 0 },
        },
        {
          text: 'Инфраструктура, которая не ломается даже ночью.',
          weights: { Frontend: 0, Backend: 1, DevOps: 3, 'UI/UX designer': 0, 'ML engineer': 0 },
        },
        {
          text: 'Модель, делающая точные предсказания.',
          weights: { Frontend: 0, Backend: 1, DevOps: 0, 'UI/UX designer': 0, 'ML engineer': 3 },
        },
      ],
    },
  ];

  // === 3. Сохраняем вопросы, ответы и веса ===
  for (const q of questionsData) {
    const question = await prisma.question.create({
      data: { text: q.text },
    });

    for (const a of q.answers) {
      const answer = await prisma.answerOption.create({
        data: { questionId: question.id, text: a.text },
      });

      for (const [professionName, weight] of Object.entries(a.weights)) {
        await prisma.answerOptionWeight.create({
          data: {
            answerOptionId: answer.id,
            professionId: profByName[professionName],
            weight,
          },
        });
      }
    }
  }

  console.log("Seeding complete!")
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
