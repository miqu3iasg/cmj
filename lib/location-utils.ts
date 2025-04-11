// Tipos e utilitários para localizações no campus

export interface CampusLocation {
  id: string
  name: string
  description: string
  type: "building" | "restaurant" | "library" | "administrative" | "other"
  coordinates: {
    lat: number
    lng: number
  }
}

// Localizações do campus baseadas no mapa
export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: "ufrb-main",
    name: "UFRB",
    description: "Campus Principal",
    type: "administrative",
    coordinates: { lat: -12.6557, lng: -39.0853 },
  },
  {
    id: "portao-2",
    name: "Portão 2 - UFRB",
    description: "Entrada secundária do campus",
    type: "other",
    coordinates: { lat: -12.658, lng: -39.089 },
  },
  {
    id: "ccet",
    name: "Centro de Ciências Exatas e Tecnológicas",
    description: "Departamento de ciências exatas e tecnologia",
    type: "building",
    coordinates: { lat: -12.6565, lng: -39.0865 },
  },
  {
    id: "reitoria",
    name: "Reitoria da Universidade Federal",
    description: "Administração central da universidade",
    type: "administrative",
    coordinates: { lat: -12.655, lng: -39.084 },
  },
  {
    id: "ru",
    name: "Restaurante Universitário Da UFRB",
    description: "Restaurante principal do campus",
    type: "restaurant",
    coordinates: { lat: -12.6545, lng: -39.083 },
  },
  {
    id: "auditorio",
    name: "Auditório Da PPGCI",
    description: "Auditório para eventos e palestras",
    type: "building",
    coordinates: { lat: -12.656, lng: -39.0835 },
  },
  {
    id: "engenharia",
    name: "ENGENHE JÚNIOR ENGENHARIA",
    description: "Departamento de Engenharia",
    type: "building",
    coordinates: { lat: -12.657, lng: -39.0845 },
  },
  {
    id: "fazenda",
    name: "Fazenda Experimental do CCAAB/UFRB",
    description: "Área de pesquisa e experimentos agrícolas",
    type: "other",
    coordinates: { lat: -12.653, lng: -39.082 },
  },
]

// Função para obter localização pelo ID
export const getLocationById = (id: string): CampusLocation | undefined => {
  return CAMPUS_LOCATIONS.find((location) => location.id === id)
}

// Função para obter localizações por tipo
export const getLocationsByType = (type: CampusLocation["type"]): CampusLocation[] => {
  return CAMPUS_LOCATIONS.filter((location) => location.type === type)
}

// Função para obter todas as localizações de edifícios (para aulas)
export const getBuildingLocations = (): CampusLocation[] => {
  return CAMPUS_LOCATIONS.filter((location) => location.type === "building" || location.type === "administrative")
}
