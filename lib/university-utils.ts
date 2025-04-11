// Utilitários para o sistema universitário

import { CAMPUS_LOCATIONS } from "@/lib/location-utils"

// Função para obter o próximo horário de ônibus com base na localização do usuário
export const getNextBusTime = (
  userLocation: { lat: number; lng: number } | null,
): { time: string; location: string } | null => {
  if (!userLocation) return null

  // Obter a hora atual
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentDay = now.getDay() // 0-6 (domingo-sábado)

  // Se for domingo, não há ônibus
  if (currentDay === 0) return null

  // Converter hora atual para minutos desde meia-noite
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  // Encontrar o ponto de ônibus mais próximo
  const busStops = CAMPUS_LOCATIONS.filter(
    (loc) =>
      loc.id.includes("ponto-onibus") || loc.id === "garagem" || loc.id === "ru" || loc.id.includes("residencia"),
  )

  let nearestStop = busStops[0]
  let minDistance = Number.MAX_VALUE

  busStops.forEach((stop) => {
    const distance = Math.sqrt(
      Math.pow(stop.coordinates.lat - userLocation.lat, 2) + Math.pow(stop.coordinates.lng - userLocation.lng, 2),
    )

    if (distance < minDistance) {
      minDistance = distance
      nearestStop = stop
    }
  })

  // Horários de ônibus para cada ponto (formato: hora * 60 + minutos)
  const busSchedules: { [key: string]: number[] } = {
    garagem: [
      6 * 60 + 25,
      9 * 60 + 35,
      11 * 60 + 30,
      15 * 60 + 35,
      16 * 60,
      17 * 60 + 30,
      20 * 60 + 40,
      21 * 60 + 40,
      22 * 60 + 30,
    ],
    ru: [
      6 * 60 + 50,
      7 * 60 + 10,
      7 * 60 + 25,
      7 * 60 + 40,
      7 * 60 + 55,
      11 * 60 + 55,
      12 * 60 + 20,
      13 * 60 + 25,
      13 * 60 + 45,
      14 * 60,
      16 * 60 + 5,
      17 * 60 + 55,
      18 * 60 + 15,
    ],
    fitotecnia: [
      6 * 60 + 40,
      7 * 60 + 10,
      7 * 60 + 25,
      7 * 60 + 40,
      7 * 60 + 55,
      10 * 60,
      12 * 60 + 25,
      13 * 60 + 45,
      14 * 60,
      17 * 60 + 55,
      18 * 60 + 15,
    ],
    "engenharia-florestal": [
      6 * 60 + 50,
      7 * 60 + 10,
      7 * 60 + 25,
      7 * 60 + 40,
      7 * 60 + 55,
      8 * 60 + 20,
      10 * 60 + 30,
      11 * 60 + 55,
      12 * 60 + 20,
      13 * 60 + 25,
      13 * 60 + 45,
      14 * 60,
      16 * 60 + 5,
      17 * 60 + 55,
      18 * 60 + 15,
      21 * 60,
      22 * 60,
      22 * 60 + 50,
    ],
  }

  // Determinar qual ponto de ônibus usar com base na proximidade
  let stopKey = "ru" // padrão
  if (nearestStop.id.includes("garagem")) stopKey = "garagem"
  else if (nearestStop.id.includes("fitotecnia")) stopKey = "fitotecnia"
  else if (nearestStop.id.includes("florestal")) stopKey = "engenharia-florestal"

  // Obter os horários para o ponto mais próximo
  const schedules = busSchedules[stopKey] || busSchedules["ru"]

  // Encontrar o próximo horário
  let nextTimeInMinutes = -1
  for (const time of schedules) {
    if (time > currentTimeInMinutes) {
      nextTimeInMinutes = time
      break
    }
  }

  // Se não houver próximo horário hoje, retornar o primeiro horário do dia
  if (nextTimeInMinutes === -1 && schedules.length > 0) {
    return {
      time: "Amanhã " + formatTime(schedules[0]),
      location: nearestStop.name,
    }
  }

  // Se encontrou um horário, retornar formatado
  if (nextTimeInMinutes !== -1) {
    return {
      time: formatTime(nextTimeInMinutes),
      location: nearestStop.name,
    }
  }

  return null
}

// Função auxiliar para formatar minutos em hora:minuto
function formatTime(timeInMinutes: number): string {
  const hours = Math.floor(timeInMinutes / 60)
  const minutes = timeInMinutes % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

// Função para obter o cardápio do dia atual
export const getCurrentDayMenu = () => {
  // Obter o dia da semana atual (1-6 para Segunda-Sábado, 0 para Domingo)
  const currentDay = new Date().getDay() || 1 // Se for domingo (0), usar segunda (1)

  // Cardápio semanal
  const weeklyMenu = {
    days: [
      {
        dayIndex: 1, // Segunda
        dayName: "Segunda-feira",
        breakfast: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE FRUTAS",
          protein: "BEBIDA 1 OPÇÃO 300 ML",
          vegetarian: "OPÇÃO VEGANA 50G",
          sides: "MINGAU DE AVEIA",
          fruit: "MELANCIA",
          bakery: "1 UND",
          calories: "556 Kcal",
        },
        lunch: {
          mainDish: "FRANGO À PARMEGIANA",
          secondOption: "ENSOPADO DE CARNE",
          vegetarian: "FAROFA DE SOJA",
          sides: ["FEIJÃO CARIOCA", "ARROZ C/ CENOURA", "CENOURA RALADA COM COUVE", "ALFACE COM TOMATE E CEBOLA"],
          drink: "SUCO DE ACEROLA",
          dessert: "PÉ DE MOLEQUE",
          calories: "1.127,09 Kcal",
        },
        dinner: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE FRUTAS",
          protein: "BIFE BOVINO COZIDO",
          sides: ["ARROZ C/CHEIRO VERDE", "SALADA DE CENOURA COM MAÇÃ E UVA PASSAS", "CALDO DE FEIJÃO"],
          bakery: "1 UND",
          vegetarian:
            "LEGUMES A CHINESA (BRÓCOLIS, CENOURA, ERVILHA EM GRÃO, COUVE FLOR, PIMENTÃO, TOMATE, CEBOLA, MOLHO SHOYU)",
          calories: "873,7 Kcal",
        },
      },
      {
        dayIndex: 2, // Terça
        dayName: "Terça-feira",
        breakfast: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE MANGA",
          protein: "OVOS MEXIDOS",
          vegetarian: "----",
          sides: "BOLO DE CENOURA C/ CALDA DE CHOCOLATE",
          fruit: "BANANA DA PRATA",
          bakery: "1 UND",
          calories: "689 Kcal",
        },
        lunch: {
          mainDish: "CUBOS DE CARNES GRELHADA (BOVINO, TOSCANA E FRANGO)",
          secondOption: "----",
          vegetarian: "EMPADA DE CENOURA C/ COUVE FLOR",
          sides: [
            "FEIJÃO TROPEIRO",
            "ARROZ C/CENOURA",
            "SALADA DE COUVE C/ TOMATE CEREJA",
            "BETERRABA COZIDA COM MAÇÃ",
          ],
          drink: "SUCO DE MANGA",
          dessert: "MELÃO",
          calories: "1119,8 Kcal",
        },
        dinner: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE GOIABA",
          protein: "FRANGO AO MOLHO BRANCO",
          sides: ["ARROZ BRANCO", "GRÃO DE BICO COM TOMATE", "MASSA COM CARNE E LEGUMES"],
          bakery: "1 UND",
          vegetarian: "LASANHA VEGANA/ SOPA DE MASSA COM LEGUME",
          calories: "905,9 Kcal",
        },
      },
      {
        dayIndex: 3, // Quarta
        dayName: "Quarta-feira",
        breakfast: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE ACEROLA",
          protein: "PÃO C/ QUEIJO E PRESUNTO",
          vegetarian: "QUEIJO VEGANO",
          sides: "CUSCUZ DE TAPIOCA",
          fruit: "MELÃO",
          bakery: "1 UND",
          calories: "589 Kcal",
        },
        lunch: {
          mainDish: "COXA E SOBRECOXA ASSADA",
          secondOption: "PICADINHO DE CARNE",
          vegetarian: "ALMÔNDEGAS DE SOJA",
          sides: [
            "FEIJÃO CARIOCA",
            "ARROZ COLORIDO (PASSAS, ERVILHA, CENOURA, CHEIRO VERDE)",
            "PEPINO, COM CENOURA RALADA, TOMATE, CEBOLA E CHEIRO VERDE",
            "MIX DE FOLHOSOS (REPOLHO ROXO, REPOLHO VERDE E ACELGA) C/MAÇÃ",
          ],
          drink: "SUCO DE CAJU",
          dessert: "MELANCIA",
          calories: "1.160 Kcal",
        },
        dinner: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE ACEROLA",
          protein: "ISCA DE CARNE COM CEBOLA CARAMELIZADA",
          sides: ["ARROZ COZIDO", "SALADA DE ALFACE C/ TOMATE", "LEGUMES C/ FRANGO"],
          bakery: "1 UND",
          vegetarian: "CUSCUZ VEGANO/SOPA DE LEGUMES",
          calories: "986 Kcal",
        },
      },
      {
        dayIndex: 4, // Quinta
        dayName: "Quinta-feira",
        breakfast: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU JENIPAPO",
          protein: "IOGURTE",
          vegetarian: "IOGURTE VEGANO",
          sides: "INHAME",
          fruit: "MAMÃO",
          bakery: "1 UND",
          calories: "569 Kcal",
        },
        lunch: {
          mainDish: "FILÉ DE FRANGO AO MOLHO",
          secondOption: "STROGONOFF DE CARNE",
          vegetarian: "LEGUMES REFOGADO (BRÓCOLIS, CENOURA E CHUCHU)",
          sides: ["FEIJÃO CARIOCA", "ARROZ C/ COLORAU", "BETERRABA RALADA COM MAÇÃ", "ALFACE C/ MANGA"],
          drink: "SUCO DE UMBU",
          dessert: "GELADO DE CEREJA",
          calories: "1116,8 Kcal",
        },
        dinner: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE CAJU",
          protein: "LOMBO SUÍNO AO MOLHO MADEIRA",
          sides: ["MACARRÃO AO ALHO E ÓLEO", "SALADA DE CENOURA COZIDA, EM CUBOS COM ERVILHA", "CALDO DE FEIJÃO"],
          bakery: "1 UND",
          vegetarian: "LENTILHA REFOGADA",
          calories: "857 Kcal",
        },
      },
      {
        dayIndex: 5, // Sexta
        dayName: "Sexta-feira",
        breakfast: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE TAMARINDO",
          protein: "FRANGO DESFIADO",
          vegetarian: "PASTA DE GRÃO DE BICO (GRÃO DE BICO, AZEITE, ÁGUA, PIMENTA DO REINO, AZEITE E COENTRO)",
          sides: "----",
          fruit: "MAÇÃ",
          bakery: "1 UND",
          calories: "547 Kcal",
        },
        lunch: {
          mainDish: "FEIJOADA",
          secondOption: "FRANGO EM CUBOS AO MOLHO DE CENOURA",
          vegetarian: "FEIJOADA VEGANA",
          sides: ["FEIJÃO PRETO", "ARROZ BRANCO", "PEPINO A VINAGRETE", "COUVE C/ BACON"],
          drink: "SUCO DE FRUTAS",
          dessert: "LARANJA",
          calories: "1.108,75 Kcal",
        },
        dinner: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE MANGA",
          protein: "FRICASSÊ DE FRANGO",
          sides: ["ARROZ A GREGA", "CALADA DE CENOURA COZIDA, EM CUBOS COM MILHO", "CALDO DE FEIJÃO"],
          bakery: "1 UND",
          vegetarian: "FRICASSÊ VEGETARIANO DE LEGUMES/ CALDO DE ABÓBORA",
          calories: "817, 5 Kcal",
        },
      },
      {
        dayIndex: 6, // Sábado
        dayName: "Sábado",
        breakfast: {
          drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE UMBU",
          protein: "OVOS C/ ORÉGANO",
          vegetarian: "---",
          sides: "MINGAU DE AMIDO DE MILHO",
          fruit: "MELÃO",
          bakery: "1 UND",
          calories: "532 Kcal",
        },
        lunch: {
          mainDish: "PEITO DE FRANGO EMPANADO AO MOLHO DE MOSTARDA",
          secondOption: "ISCA C/ MILHO",
          vegetarian: "LENTILHA REFOGADA",
          sides: ["FEIJÃO CARIOCA", "ARROZ TEMPERADO", "CENOURA RALADA C/ MILHO E ERVILHA", "ACELGA COM UVA PASSAS"],
          drink: "SUCO DE ABACAXI (FRUTA)",
          dessert: "NEOGBON",
          calories: "1056,97 Kcal",
        },
        dinner: {
          drinks: "XXX",
          protein: "XXX",
          sides: ["XXX", "XXX", "XXX"],
          bakery: "XXX",
          vegetarian: "XXX",
          calories: "XXX",
        },
      },
    ],
  }

  // Encontrar o cardápio do dia atual
  const todayMenu = weeklyMenu.days.find((day) => day.dayIndex === currentDay)

  return todayMenu || weeklyMenu.days[0] // Retorna o cardápio do dia ou o de segunda-feira como padrão
}
