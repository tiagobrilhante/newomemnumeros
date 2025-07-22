// noinspection JSUnresolvedReference
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {

  const cma = await prisma.militaryOrganization.create({
    data: {
      name: 'Comando Militar da Amazônia',
      acronym: 'CMA',
      color: '#F57C00',
    },
  })

  await prisma.militaryOrganization.create({
    data: {
      name: 'Comando Militar do Leste',
      acronym: 'CML',
      color: '#61d576',
    },
  })

  const bdaInfSl1 = await prisma.militaryOrganization.create({
    data: {
      name: '1ª Brigada de Infantaria de Selva',
      acronym: '1ª Bda Inf Sl',
      color: '#311B92',
      militaryOrganizationId: cma.id,
    },
  })

  await prisma.militaryOrganization.create({
    data: {
      name: '2ª Brigada de Infantaria de Selva',
      acronym: '2ª Bda Inf Sl',
      color: '#6D4C41',
      militaryOrganizationId: cma.id,
    },
  })

  console.log('Organizações Militares criadas')

  const e1Cma = await prisma.section.create({
    data: {
      name: 'Seção de Pessoal',
      acronym: 'E1',
      militaryOrganizationId: cma.id,
    },
  })

  const e2Cma = await prisma.section.create({
    data: {
      name: 'Seção de Inteligência',
      acronym: 'E2',
      militaryOrganizationId: cma.id,
    },
  })

  const e3Cma = await prisma.section.create({
    data: {
      name: 'Seção de Operações',
      acronym: 'E3',
      militaryOrganizationId: cma.id,
    },
  })

  const stiCma = await prisma.section.create({
    data: {
      name: 'Seção de Tecnologia da Informação',
      acronym: 'STI',
      militaryOrganizationId: cma.id,
    },
  })

  const e4Cma = await prisma.section.create({
    data: {
      name: 'Seção de Logística',
      acronym: 'E4',
      militaryOrganizationId: cma.id,
    },
  })

  const speiCma = await prisma.section.create({
    data: {
      name: 'Seção de Planejamento Estratégico Institucional',
      acronym: 'SPEI',
      militaryOrganizationId: cma.id,
    },
  })

  const e1BdaInfSl1 = await prisma.section.create({
    data: {
      name: 'Seção de Pessoal',
      acronym: 'E1',
      militaryOrganizationId: bdaInfSl1.id,
    },
  })

  console.log('Seções criadas')

  // Criar roles (antigas sectionFunctions)
  const stiChCma = await prisma.role.create({
    data: {
      name: 'Chefe da Seção de Tecnologia da Informação',
      acronym: 'Ch STI',
      sectionId: stiCma.id,
    },
  })

  await prisma.role.createMany({
    data: [
      {
        name: 'Chefe da Seção de Pessoal',
        acronym: 'Ch E1',
        sectionId: e1Cma.id,
      },
      {
        name: 'Chefe da Seção de Inteligência',
        acronym: 'Ch E2',
        sectionId: e2Cma.id,
      },
      {
        name: 'Chefe Seção de Operações',
        acronym: 'Ch E3',
        sectionId: e3Cma.id,
      },
      {
        name: 'Adjunto da Seção de Operações',
        acronym: 'Adj E3',
        sectionId: e3Cma.id,
      },
      {
        name: 'Chefe Seção de Logística',
        acronym: 'Ch E4',
        sectionId: e4Cma.id,
      },
      {
        name: 'Chefe da Seção de Planejamento Estratégico Institucional',
        acronym: 'Ch SPEI',
        sectionId: speiCma.id,
      },
      {
        name: 'Chefe da Seção de Pessoal',
        acronym: 'Ch E1',
        sectionId: e1BdaInfSl1.id,
      },
    ],
  })

  const adminRole = await prisma.role.create({
    data: {
      name: 'Administrador do Sistema',
      acronym: 'Admin',
      sectionId: null,
    },
  })

  const userRole = await prisma.role.create({
    data: {
      name: 'Usuário Padrão',
      acronym: 'User',
      sectionId: null,
    },
  })

  console.log('Roles criados')

  await prisma.permission.createMany({
    data: [
      {
        slug: 'users.create',
        description: 'Criar usuários',
        category: 'users',
      },
      {
        slug: 'users.read',
        description: 'Visualizar usuários',
        category: 'users',
      },
      {
        slug: 'users.update',
        description: 'Atualizar usuários',
        category: 'users',
      },
      {
        slug: 'users.delete',
        description: 'Deletar usuários',
        category: 'users',
      },
      // Permissões de seções
      {
        slug: 'sections.create',
        description: 'Criar seções',
        category: 'sections',
      },
      {
        slug: 'sections.read',
        description: 'Visualizar seções',
        category: 'sections',
      },
      {
        slug: 'sections.update',
        description: 'Atualizar seções',
        category: 'sections',
      },
      {
        slug: 'sections.delete',
        description: 'Deletar seções',
        category: 'sections',
      },
      // Permissões de roles
      {
        slug: 'roles.create',
        description: 'Criar roles',
        category: 'roles',
      },
      {
        slug: 'roles.read',
        description: 'Visualizar roles',
        category: 'roles',
      },
      {
        slug: 'roles.update',
        description: 'Atualizar roles',
        category: 'roles',
      },
      {
        slug: 'roles.delete',
        description: 'Deletar roles',
        category: 'roles',
      },
      {
        slug: 'reports.generate',
        description: 'Gerar relatórios',
        category: 'reports',
      },
      {
        slug: 'reports.export',
        description: 'Exportar relatórios',
        category: 'reports',
      },
      {
        slug: 'system.admin',
        description: 'Administrador do sistema',
        category: 'system',
      },
      {
        slug: 'system.settings',
        description: 'Configurações do sistema',
        category: 'system',
      },
    ],
  })

  console.log('Permissões criadas')

  const allPermissions = await prisma.permission.findMany()

  await prisma.rolePermission.createMany({
    data: allPermissions.map(permission => ({
      permissionId: permission.id,
      roleId: adminRole.id,
    }))
  })

  const basicPermissions = allPermissions.filter(p =>
    p.slug.includes('.read') || p.slug === 'reports.generate'
  )

  await prisma.rolePermission.createMany({
    data: basicPermissions.map(permission => ({
      permissionId: permission.id,
      roleId: userRole.id,
    }))
  })

  const stiPermissions = allPermissions.filter(p =>
    p.category === 'users' || p.category === 'system' || p.slug.includes('.read')
  )

  await prisma.rolePermission.createMany({
    data: stiPermissions.map(permission => ({
      permissionId: permission.id,
      roleId: stiChCma.id,
    }))
  })

  console.log('Permissões atribuídas aos roles')

  const allRoles = await prisma.role.findMany()

  const getRandomRole = () => {
    const randomIndex = Math.floor(Math.random() * allRoles.length)
    return allRoles[randomIndex].id
  }

  await prisma.rank.createMany({
    data: [
      {
        name: 'General de Exército',
        acronym: 'Gen Ex',
        hierarchy: 1,
      },
      {
        name: 'General de Divisão',
        acronym: 'Gen Div',
        hierarchy: 2,
      },
      {
        name: 'General de Brigada',
        acronym: 'Gen Bda',
        hierarchy: 3,
      },
      {
        name: 'Coronel',
        acronym: 'Cel',
        hierarchy: 4,
      },
      {
        name: 'Tenente Coronel',
        acronym: 'Ten Cel',
        hierarchy: 5,
      },
      {
        name: 'Major',
        acronym: 'Maj',
        hierarchy: 6,
      },
      {
        name: 'Capitão',
        acronym: 'Cap',
        hierarchy: 7,
      },
      {
        name: 'Primeiro Tenente',
        acronym: '1º Ten',
        hierarchy: 8,
      },
      {
        name: 'Segundo Tenente',
        acronym: '2º Ten',
        hierarchy: 9,
      },
      {
        name: 'Aspirante a Oficial',
        acronym: 'Asp',
        hierarchy: 10,
      },
      {
        name: 'Subtenente',
        acronym: 'S Ten',
        hierarchy: 11,
      },
      {
        name: 'Primeiro Sargento',
        acronym: '1º Sgt',
        hierarchy: 12,
      },
      {
        name: 'Segundo Sargento',
        acronym: '2º Sgt',
        hierarchy: 13,
      },
      {
        name: 'Terceiro Sargento',
        acronym: '3º Sgt',
        hierarchy: 14,
      },
      {
        name: 'Cabo',
        acronym: 'Cb',
        hierarchy: 15,
      },
      {
        name: 'Soldado',
        acronym: 'Sd',
        hierarchy: 16,
      },
      {
        name: 'Servidor Civil',
        acronym: 'SC',
        hierarchy: 17,
      },
    ],
  })

  console.log('Postos e graduações criados com sucesso')

  const ranks = await prisma.rank.findMany({
    orderBy: { hierarchy: 'asc' },
  })

  const hashedPassword = await bcrypt.hash('123456', 10)

  await prisma.user.createMany({
    data: [
      {
        name: 'Usuário de Teste',
        serviceName: 'Teste',
        email: 'teste@teste.com',
        cpf: '31484707028',
        password: hashedPassword,
        rankId: ranks[4].id,
        roleId: stiChCma.id,
      },
      {
        name: 'Administrador',
        serviceName: 'Admin',
        email: 'admin@admin.com',
        cpf: '12345678901',
        password: hashedPassword,
        rankId: ranks[0].id,
        roleId: adminRole.id,
      },
      {
        name: 'Juca Bala',
        serviceName: 'Juca',
        email: 'juca@bala.com',
        password: hashedPassword,
        cpf: '18606623075',
        rankId: ranks[5].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Carlos Alberto Santos',
        serviceName: 'Santos',
        email: 'carlos.santos@email.com',
        password: hashedPassword,
        cpf: '73105846005',
        rankId: ranks[2].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Fernanda Lima Oliveira',
        serviceName: 'Lima',
        email: 'fernanda.lima@email.com',
        password: hashedPassword,
        cpf: '63548472005',
        rankId: ranks[3].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Roberto Pereira Silva',
        serviceName: 'Pereira',
        email: 'roberto.pereira@email.com',
        password: hashedPassword,
        cpf: '04215639070',
        rankId: ranks[1].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Ana Maria Costa',
        serviceName: 'Costa',
        email: 'ana.costa@email.com',
        password: hashedPassword,
        cpf: '35817496023',
        rankId: ranks[4].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Paulo Ricardo Souza',
        serviceName: 'Souza',
        email: 'paulo.souza@email.com',
        password: hashedPassword,
        cpf: '94725863091',
        rankId: ranks[0].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Mariana Torres Almeida',
        serviceName: 'Torres',
        email: 'mariana.torres@email.com',
        password: hashedPassword,
        cpf: '15634987044',
        rankId: ranks[2].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Ricardo Mendes Ferreira',
        serviceName: 'Mendes',
        email: 'ricardo.mendes@email.com',
        password: hashedPassword,
        cpf: '58496713088',
        rankId: ranks[3].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Juliana Castro Ribeiro',
        serviceName: 'Castro',
        email: 'juliana.castro@email.com',
        password: hashedPassword,
        cpf: '26974581037',
        rankId: ranks[4].id,
        roleId: getRandomRole(),
      },
      {
        name: 'André Luiz Carvalho',
        serviceName: 'Carvalho',
        email: 'andre.carvalho@email.com',
        password: hashedPassword,
        cpf: '82746351090',
        rankId: ranks[1].id,
        roleId: getRandomRole(),
      },
      {
        name: 'Luciana Martins Rodrigues',
        serviceName: 'Martins',
        email: 'luciana.martins@email.com',
        password: hashedPassword,
        cpf: '49318276056',
        rankId: ranks[0].id,
        roleId: userRole.id,
      },
    ],
  })

  console.log('Usuários criados com sucesso!')
  console.log('Seed concluído com sucesso!')
}

try {
  await seed()
  await prisma.$disconnect()
} catch (e) {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
}
