import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const users = new Array(10).fill(0).map(() =>
    prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
    }),
  );
  const documents = new Array(10).fill(0).map(() => {
  let last_update_date = faker.date.past()
  let max_years_in_past = 10
  return prisma.document.create({
    data: {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      authorId: parseInt(faker.random.numeric(1, { bannedDigits: ['0'] })),
      creation_date: faker.date.past(max_years_in_past, last_update_date.toLocaleDateString()),
      last_update_date: last_update_date,
    },
  })
  }
);

  await prisma.$transaction(users);
  await prisma.$transaction(documents);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
