import * as XLSX from 'xlsx'

const DAYS = [
  {
    id: 'monday',
    name: 'Lunes',
    startColumn: 1,
    endColumn: 2,
  },
  {
    id: 'tuesday',
    name: 'Martes',
    startColumn: 3,
    endColumn: 4,
  },
  {
    id: 'wednesday',
    name: 'Miércoles',
    startColumn: 5,
    endColumn: 6,
  },
  {
    id: 'thursday',
    name: 'Jueves',
    startColumn: 7,
    endColumn: 8,
  },
  {
    id: 'friday',
    name: 'Viernes',
    startColumn: 9,
    endColumn: 10,
  },
  {
    id: 'saturday',
    name: 'Sábado',
    startColumn: 11,
    endColumn: 12,
  },
  {
    id: 'sunday',
    name: 'Domingo',
    startColumn: 13,
    endColumn: 14,
  },
]

export function readScheduleExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)

        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
        })

        if (!workbook.SheetNames.includes('HORARIO')) {
          throw new Error(
            'El archivo no contiene una hoja llamada "HORARIO".'
          )
        }

        const worksheet = workbook.Sheets['HORARIO']

        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          raw: false,
        })

        const employees = parseEmployees(rows)

        const weekInfo = parseWeekInfo(rows)

        resolve({
          sheetName: 'HORARIO',
          weekInfo,
          employees,
          totalEmployees: employees.length,
          rows,
        })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('No se pudo leer el archivo Excel.'))
    }

    reader.readAsArrayBuffer(file)
  })
}

function parseWeekInfo(rows) {
  const monthRow = rows[0] || []
  const daysRow = rows[1] || []
  const datesRow = rows[2] || []

  const month = cleanValue(monthRow[0])

  const days = DAYS.map((day, index) => {
    const dayColumn = day.startColumn

    return {
      id: day.id,
      name: day.name,
      date: cleanValue(datesRow[dayColumn]),
      excelName: cleanValue(daysRow[dayColumn]),
    }
  })

  return {
    month,
    days,
  }
}

function parseEmployees(rows) {
  const employees = []

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]

    if (!row || !row[0]) {
      continue
    }

    const name = String(row[0]).trim()

    // Ignorar encabezados como AGOSTO
    if (
      name === 'AGOSTO' ||
      name === 'COLABORADOR' ||
      name === 'NOMBRE'
    ) {
      continue
    }

    const hoursRow = rows[rowIndex + 1] || []

    const schedule = {}

    DAYS.forEach((day) => {
      const start = cleanValue(row[day.startColumn])
      const end = cleanValue(row[day.endColumn])

      const hours = parseNumber(hoursRow[day.startColumn])

      schedule[day.id] = {
        day: day.name,
        start: start || null,
        end: end || null,
        hours: hours || 0,
        isWorking: Boolean(start && end),
      }
    })

    const weeklyHours = parseNumber(hoursRow[15])

    employees.push({
      id: employees.length + 1,
      name,
      schedule,
      weeklyHours: weeklyHours || 0,
    })

    // Saltamos la fila de horas que pertenece al colaborador
    rowIndex++
  }

  return employees
}

function cleanValue(value) {
  if (value === undefined || value === null) {
    return ''
  }

  return String(value).trim()
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') {
    return 0
  }

  const number = Number(String(value).replace(',', '.'))

  return Number.isNaN(number) ? 0 : number
}