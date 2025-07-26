export const retrieveMilitaryOrganizationLogo = (
  id: number,
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
