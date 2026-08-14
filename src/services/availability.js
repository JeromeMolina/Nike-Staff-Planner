const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export function getWorkingEmployees(employees, day) {
  if (!employees || !DAYS.includes(day)) {
    return []
  }

  return employees.filter((employee) => {
    const schedule = employee.schedule?.[day]

    return schedule?.isWorking === true
  })
}

export function getEmployeeSchedule(employee, day) {
  if (!employee || !DAYS.includes(day)) {
    return null
  }

  return employee.schedule?.[day] || null
}

export function isEmployeeWorking(employee, day) {
  const schedule = getEmployeeSchedule(employee, day)

  return Boolean(schedule?.isWorking)
}

export function getEmployeesByTime(
  employees,
  day,
  startTime,
  endTime
) {
  const workingEmployees = getWorkingEmployees(employees, day)

  return workingEmployees.filter((employee) => {
    const schedule = employee.schedule[day]

    return (
      timeToMinutes(schedule.start) <= timeToMinutes(startTime) &&
      timeToMinutes(schedule.end) >= timeToMinutes(endTime)
    )
  })
}

function timeToMinutes(time) {
  if (!time) {
    return null
  }

  const [hours, minutes] = String(time)
    .split(':')
    .map(Number)

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null
  }

  return hours * 60 + minutes
}