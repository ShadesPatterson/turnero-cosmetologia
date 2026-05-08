import { prisma } from '../lib/prisma'

async function main() {
  const services = [
    { name: 'Lifting facial', duration: 60 },
    { name: 'Pestañas coreanas', duration: 60 },
    { name: 'Depilación definitiva', duration: 60 },
    { name: 'Masajes descontracturantes', duration: 60 },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    })
  }

  console.log('Services seeded')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})