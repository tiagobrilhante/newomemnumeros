import type { MilitaryOrganization } from '@prisma/client'
import { BaseTransformer } from './base.transformer'

// Tipos para organizações militares com relacionamentos
type MilitaryOrganizationWithRelations = MilitaryOrganization & {
  subOrganizations?: MilitaryOrganization[]
  parentOrganization?: MilitaryOrganization | null
  users?: {
    id: string
    name: string
    serviceName: string
  }[]
}

export class MilitaryOrganizationTransformer extends BaseTransformer {
  /**
   * Transformação padrão para organizações militares com relacionamentos
   */
  static transform(militaryOrganization: MilitaryOrganizationWithRelations) {
    const { 
      subOrganizations, 
      parentOrganization, 
      users,
      createdAt, 
      updatedAt, 
      deleted, 
      ...cleanOrganization 
    } = militaryOrganization

    return {
      ...cleanOrganization,
      // Inclui relacionamentos transformados se existirem
      ...(subOrganizations && {
        subOrganizations: this.removeAuditFieldsFromCollection(subOrganizations)
      }),
      ...(parentOrganization && {
        parentOrganization: this.removeAuditFields(parentOrganization)
      }),
      ...(users && {
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          serviceName: user.serviceName
        }))
      })
    }
  }

  /**
   * Transformação para autenticação - inclui apenas dados essenciais
   */
  static transformForAuth(militaryOrganization: MilitaryOrganizationWithRelations) {
    const { 
      id, 
      name, 
      acronym, 
      color, 
      logo,
      parentOrganization 
    } = militaryOrganization

    return {
      id,
      name,
      acronym,
      color,
      logo,
      ...(parentOrganization && {
        parentOrganization: {
          id: parentOrganization.id,
          name: parentOrganization.name,
          acronym: parentOrganization.acronym
        }
      })
    }
  }

  /**
   * Transformação para listagem básica - sem relacionamentos detalhados
   */
  static transformForList(militaryOrganization: MilitaryOrganizationWithRelations) {
    const { 
      createdAt, 
      updatedAt, 
      deleted,
      subOrganizations,
      users,
      ...cleanOrganization 
    } = militaryOrganization

    return {
      ...cleanOrganization,
      // Contadores para sub-organizações e usuários
      subOrganizationsCount: subOrganizations?.length || 0,
      usersCount: users?.length || 0,
      // Organização pai simplificada
      ...(militaryOrganization.parentOrganization && {
        parentOrganization: {
          id: militaryOrganization.parentOrganization.id,
          name: militaryOrganization.parentOrganization.name,
          acronym: militaryOrganization.parentOrganization.acronym
        }
      })
    }
  }

  /**
   * Transformação de coleção com controle de profundidade
   */
  static collection(
    militaryOrganizations: MilitaryOrganizationWithRelations[], 
    mode: 'full' | 'auth' | 'list' = 'list'
  ) {
    return militaryOrganizations.map(org => {
      switch (mode) {
        case 'full':
          return this.transform(org)
        case 'auth':
          return this.transformForAuth(org)
        case 'list':
        default:
          return this.transformForList(org)
      }
    })
  }

  /**
   * Transformação hierárquica - organiza em estrutura de árvore
   */
  static transformHierarchical(militaryOrganizations: MilitaryOrganizationWithRelations[]) {
    const transformed = this.collection(militaryOrganizations, 'full')
    
    // Separa organizações raiz das subordinadas
    const rootOrganizations = transformed.filter(org => !org.militaryOrganizationId)
    const subordinateOrganizations = transformed.filter(org => org.militaryOrganizationId)
    
    // Constrói hierarquia
    const buildHierarchy = (parentId: number | null): any[] => {
      return subordinateOrganizations
        .filter(org => org.militaryOrganizationId === parentId)
        .map(org => ({
          ...org,
          children: buildHierarchy(org.id)
        }))
    }

    // Adiciona filhos às organizações raiz
    return rootOrganizations.map(rootOrg => ({
      ...rootOrg,
      children: buildHierarchy(rootOrg.id)
    }))
  }

  /**
   * Transformação para seleção em formulários
   */
  static transformForSelect(militaryOrganizations: MilitaryOrganizationWithRelations[]) {
    return militaryOrganizations.map(org => ({
      id: org.id,
      name: org.name,
      acronym: org.acronym,
      label: `${org.acronym} - ${org.name}`,
      value: org.id.toString(),
      // Inclui informação se é organização pai
      isParent: !org.militaryOrganizationId,
      parentId: org.militaryOrganizationId
    }))
  }
}
