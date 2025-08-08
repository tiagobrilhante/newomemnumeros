// noinspection JSUnresolvedReference
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { PERMISSION_CATEGORIES } from '../shared/constants/permissions'

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

  const roles1 = await prisma.role.createMany({
    data: [
      {
        name: 'Chefe da Seção de Tecnologia da Informação',
        acronym: 'Ch STI',
      },
      {
        name: 'Chefe da Seção de Pessoal',
        acronym: 'Ch E1',
      },
      {
        name: 'Chefe da Seção de Inteligência',
        acronym: 'Ch E2',
      },
      {
        name: 'Chefe Seção de Operações',
        acronym: 'Ch E3',
      },
      {
        name: 'Adjunto da Seção de Operações',
        acronym: 'Adj E3',
      },
      {
        name: 'Chefe Seção de Logística',
        acronym: 'Ch E4',
      },
      {
        name: 'Chefe da Seção de Planejamento Estratégico Institucional',
        acronym: 'Ch SPEI',
      },
      {
        name: 'Chefe da Seção de Pessoal',
        acronym: 'Ch E1',
      },
    ],
  })

  const adminGeralRole = await prisma.role.create({
    data: {
      name: 'Administrador Geral',
      acronym: 'Admin Geral',
    },
  })

  const adminRole = await prisma.role.create({
    data: {
      name: 'Administrador OM',
      acronym: 'Admin OM',
    },
  })

  console.log('Role criados')

  // Criar permissões baseadas nas constantes
  const permissionsToCreate = []
  
  // Extrair todas as permissões das constantes
  for (const module of PERMISSION_CATEGORIES) {
    for (const subcategory of module.subcategories) {
      for (const permission of subcategory.permissions) {
        permissionsToCreate.push({
          slug: permission.slug,
          description: permission.slug, // Usar slug como descrição temporariamente
          category: permission.category,
        })
      }
    }
  }

  await prisma.permission.createMany({
    data: permissionsToCreate
  })
  
  // Buscar permissões administrativas globais
  const adminPermissionGlobal = await prisma.permission.findFirst({
    where: { slug: 'admin.system.manage' }
  })
  
  const adminPermissionOM = await prisma.permission.findFirst({
    where: { slug: 'admin.organization.manage' }
  })

  console.log('Permissões criadas')

  //continue a partir daqui
  
  // Buscar roles criadas anteriormente
  const allRoles = await prisma.role.findMany()
  const chStiRole = allRoles.find(role => role.acronym === 'Ch STI')
  const chE1Role = allRoles.find(role => role.acronym === 'Ch E1')
  const chE2Role = allRoles.find(role => role.acronym === 'Ch E2')
  const chE3Role = allRoles.find(role => role.acronym === 'Ch E3')
  const adjE3Role = allRoles.find(role => role.acronym === 'Adj E3')
  const chE4Role = allRoles.find(role => role.acronym === 'Ch E4')
  const chSpeiRole = allRoles.find(role => role.acronym === 'Ch SPEI')

  console.log('Roles encontradas para vinculação')

  // Criar vinculações RoleMilitaryOrganization
  const roleMilOrgData = []

  // Admin Geral - sem vinculação específica (role global)
  // Admin OM - vinculado ao CMA
  roleMilOrgData.push({
    roleId: adminRole.id,
    militaryOrganizationId: cma.id,
  })

  // Roles específicas vinculadas ao CMA
  if (chStiRole) roleMilOrgData.push({ roleId: chStiRole.id, militaryOrganizationId: cma.id })
  if (chE1Role) roleMilOrgData.push({ roleId: chE1Role.id, militaryOrganizationId: cma.id })
  if (chE2Role) roleMilOrgData.push({ roleId: chE2Role.id, militaryOrganizationId: cma.id })
  if (chE3Role) roleMilOrgData.push({ roleId: chE3Role.id, militaryOrganizationId: cma.id })
  if (adjE3Role) roleMilOrgData.push({ roleId: adjE3Role.id, militaryOrganizationId: cma.id })
  if (chE4Role) roleMilOrgData.push({ roleId: chE4Role.id, militaryOrganizationId: cma.id })
  if (chSpeiRole) roleMilOrgData.push({ roleId: chSpeiRole.id, militaryOrganizationId: cma.id })

  // Role Ch E1 vinculada também à 1ª Bda Inf Sl (segunda ocorrência)
  const chE1Roles = allRoles.filter(role => role.acronym === 'Ch E1')
  const chE1BdaRole = chE1Roles.length > 1 ? chE1Roles[1] : null
  if (chE1BdaRole) {
    roleMilOrgData.push({
      roleId: chE1BdaRole.id,
      militaryOrganizationId: bdaInfSl1.id,
    })
  }

  await prisma.roleMilitaryOrganization.createMany({
    data: roleMilOrgData
  })

  console.log('Vinculações RoleMilitaryOrganization criadas')

  const allPermissions = await prisma.permission.findMany()

  // Atribuir permissão de sistema global ao Admin Geral
  if (adminPermissionGlobal) {
    await prisma.rolePermission.create({
      data: {
        permissionId: adminPermissionGlobal.id,
        roleId: adminGeralRole.id,
      }
    })
  }

  // Atribuir permissão de administração organizacional ao Admin OM
  if (adminPermissionOM) {
    await prisma.rolePermission.create({
      data: {
        permissionId: adminPermissionOM.id,
        roleId: adminRole.id,
      }
    })
  }

  // Atribuir permissões técnicas ao Chefe STI (permissions organizacionais)
  if (chStiRole) {
    const stiPermissions = allPermissions.filter(p =>
      p.slug.includes('admin.users.manage') ||
      p.slug.includes('admin.sections.manage') ||
      p.slug.includes('admin.roles.manage')
    )

    if (stiPermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: stiPermissions.map(permission => ({
          permissionId: permission.id,
          roleId: chStiRole.id,
        }))
      })
    }
  }

  console.log('Permissões atribuídas aos roles')

  // Criar relacionamentos RoleSection para vincular roles às seções apropriadas
  const roleSectionData = []

  // Chefe STI vinculado à seção STI
  if (chStiRole) {
    roleSectionData.push({
      roleId: chStiRole.id,
      sectionId: stiCma.id,
    })
  }

  // Outros chefes vinculados às suas respectivas seções
  if (chE1Role) {
    roleSectionData.push({
      roleId: chE1Role.id,
      sectionId: e1Cma.id,
    })
  }

  if (chE2Role) {
    roleSectionData.push({
      roleId: chE2Role.id,
      sectionId: e2Cma.id,
    })
  }

  if (chE3Role) {
    roleSectionData.push({
      roleId: chE3Role.id,
      sectionId: e3Cma.id,
    })
  }

  if (adjE3Role) {
    roleSectionData.push({
      roleId: adjE3Role.id,
      sectionId: e3Cma.id,
    })
  }

  if (chE4Role) {
    roleSectionData.push({
      roleId: chE4Role.id,
      sectionId: e4Cma.id,
    })
  }

  if (chSpeiRole) {
    roleSectionData.push({
      roleId: chSpeiRole.id,
      sectionId: speiCma.id,
    })
  }

  // Ch E1 da 1ª Bda Inf Sl vinculado à sua seção
  if (chE1BdaRole) {
    roleSectionData.push({
      roleId: chE1BdaRole.id,
      sectionId: e1BdaInfSl1.id,
    })
  }

  await prisma.roleSection.createMany({
    data: roleSectionData
  })

  console.log('Relacionamentos Role-Section criados')

  const allSections = await prisma.section.findMany()

  const getRandomRole = () => {
    const randomIndex = Math.floor(Math.random() * allRoles.length)
    return allRoles[randomIndex].id
  }

  const getRandomSection = () => {
    const randomIndex = Math.floor(Math.random() * allSections.length)
    return allSections[randomIndex].id
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
        roleId: chStiRole?.id || getRandomRole(),
        sectionId: stiCma.id, // Ch STI vinculado à seção STI
      },
      {
        name: 'Administrador',
        serviceName: 'Admin',
        email: 'admin@admin.com',
        cpf: '12345678901',
        password: hashedPassword,
        rankId: ranks[0].id,
        roleId: adminGeralRole.id,
        // Admin não tem seção específica
      },
      {
        name: 'Juca Bala',
        serviceName: 'Juca',
        email: 'juca@bala.com',
        password: hashedPassword,
        cpf: '18606623075',
        rankId: ranks[5].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Carlos Alberto Santos',
        serviceName: 'Santos',
        email: 'carlos.santos@email.com',
        password: hashedPassword,
        cpf: '73105846005',
        rankId: ranks[2].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Fernanda Lima Oliveira',
        serviceName: 'Lima',
        email: 'fernanda.lima@email.com',
        password: hashedPassword,
        cpf: '63548472005',
        rankId: ranks[3].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Roberto Pereira Silva',
        serviceName: 'Pereira',
        email: 'roberto.pereira@email.com',
        password: hashedPassword,
        cpf: '04215639070',
        rankId: ranks[1].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Ana Maria Costa',
        serviceName: 'Costa',
        email: 'ana.costa@email.com',
        password: hashedPassword,
        cpf: '35817496023',
        rankId: ranks[4].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Paulo Ricardo Souza',
        serviceName: 'Souza',
        email: 'paulo.souza@email.com',
        password: hashedPassword,
        cpf: '94725863091',
        rankId: ranks[0].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Mariana Torres Almeida',
        serviceName: 'Torres',
        email: 'mariana.torres@email.com',
        password: hashedPassword,
        cpf: '15634987044',
        rankId: ranks[2].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Ricardo Mendes Ferreira',
        serviceName: 'Mendes',
        email: 'ricardo.mendes@email.com',
        password: hashedPassword,
        cpf: '58496713088',
        rankId: ranks[3].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Juliana Castro Ribeiro',
        serviceName: 'Castro',
        email: 'juliana.castro@email.com',
        password: hashedPassword,
        cpf: '26974581037',
        rankId: ranks[4].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'André Luiz Carvalho',
        serviceName: 'Carvalho',
        email: 'andre.carvalho@email.com',
        password: hashedPassword,
        cpf: '82746351090',
        rankId: ranks[1].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
      {
        name: 'Luciana Martins Rodrigues',
        serviceName: 'Martins',
        email: 'luciana.martins@email.com',
        password: hashedPassword,
        cpf: '49318276056',
        rankId: ranks[0].id,
        roleId: getRandomRole(),
        sectionId: getRandomSection(),
      },
    ],
  })

  console.log('Usuários criados com sucesso!')
  console.log('Seed concluído com sucesso!')
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
