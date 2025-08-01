export const retrieveMilitaryOrganizationLogo = (
  id: string,
  tipo: string,
  militaryOrganizations: militaryOrganization[]
) => {
  const militaryOrganization = militaryOrganizations.find(
    (militaryOrganization) => militaryOrganization.id === id
  )

  if (!militaryOrganization?.logo) {
    return undefined
  }

  const logoPath = militaryOrganization.logo

  // Se já tem query parameter (timestamp), manter
  if (logoPath.includes('?v=')) {
    const basePath = logoPath.substring(0, logoPath.lastIndexOf('/') + 1)
    const logoWithQuery = logoPath.substring(logoPath.lastIndexOf('/') + 1)
    const logoName = logoWithQuery.split('?')[0]
    const queryParam = logoWithQuery.split('?')[1]

    if (tipo === 'mini') {
      if (logoName === 'default.png') {
        return `${basePath}default_mini.png`
      }
      return `${basePath}logo_mini.png?${queryParam}`
    }

    if (tipo === 'big') {
      if (logoName === 'default.png') {
        return `${basePath}default.png`
      }
      return `${basePath}logo.png?${queryParam}`
    }

    return `${basePath}logo.png?${queryParam}`
  }

  // Caso não tenha query parameter (logos antigos)
  const basePath = logoPath.substring(0, logoPath.lastIndexOf('/') + 1)
  const logoName = logoPath.substring(logoPath.lastIndexOf('/') + 1)

  if (tipo === 'mini') {
    if (logoName === 'default.png') {
      return `${basePath}default_mini.png`
    }
    return `${basePath}logo_mini.png`
  }

  if (tipo === 'big') {
    if (logoName === 'default.png') {
      return `${basePath}default.png`
    }
    return `${basePath}logo.png`
  }

  return `${basePath}logo.png`
}
