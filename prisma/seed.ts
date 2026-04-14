import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 A correr seed...')

  const categories = [
    { name: 'Tecnologia', slug: 'tecnologia', icon: 'Laptop' },
    { name: 'Design', slug: 'design', icon: 'Palette' },
    { name: 'Idiomas', slug: 'idiomas', icon: 'Languages' },
    { name: 'Tutoria', slug: 'tutoria', icon: 'GraduationCap' },
    { name: 'Música', slug: 'musica', icon: 'Music' },
    { name: 'Fotografia', slug: 'fotografia', icon: 'Camera' },
    { name: 'Escrita', slug: 'escrita', icon: 'PenLine' },
    { name: 'Outros', slug: 'outros', icon: 'Package' },
    { name: 'Ciências', slug: 'ciencias', icon: 'FlaskConical' },
    { name: 'Artes', slug: 'artes', icon: 'Brush' },
    { name: 'Desporto', slug: 'desporto', icon: 'Trophy' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { icon: cat.icon },
      create: cat,
    })
  }
  console.log('✅ Categorias criadas')

  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@estudantes.piaget.pt' },
    update: {},
    create: {
      name: 'Admin SkoolBay',
      email: 'admin@estudantes.piaget.pt',
      password: adminPassword,
      emailVerified: new Date(),
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin criado (admin@estudantes.piaget.pt / Admin123!)')

  const testPassword = await bcrypt.hash('Test123!', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@estudantes.piaget.pt' },
    update: {},
    create: {
      name: 'Estudante Teste',
      email: 'test@estudantes.piaget.pt',
      password: testPassword,
      emailVerified: new Date(),
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
      bio: 'Estudante de teste para desenvolvimento.',
    },
  })
  console.log('✅ Utilizador de teste criado (test@estudantes.piaget.pt / Test123!)')

  const techCat = await prisma.category.findUnique({ where: { slug: 'tecnologia' } })
  await prisma.service.create({
    data: {
      title: 'Explicações de Programação em Python',
      description:
        'Ajudo com fundamentos de Python, lógica de programação, e projetos académicos. Tenho experiência a ensinar algoritmos, estruturas de dados, e debugging.',
      price: 15.0,
      userId: testUser.id,
      categoryId: techCat?.id,
    },
  })
  console.log('✅ Serviço de exemplo criado')

  console.log('\n🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
