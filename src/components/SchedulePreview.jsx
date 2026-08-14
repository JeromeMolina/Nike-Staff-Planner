import {
  Users,
  Clock3,
  CalendarDays,
} from 'lucide-react'

const DAYS = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' },
]

function SchedulePreview({ employees }) {
  if (!employees || employees.length === 0) {
    return null
  }

  const totalHours = employees.reduce(
    (total, employee) => total + employee.weeklyHours,
    0
  )

  return (
    <section className="schedule-preview">
      <div className="preview-header">
        <div>
          <span className="eyebrow">HORARIO IMPORTADO</span>
          <h2>Personal y turnos</h2>
          <p>
            Información obtenida directamente de la hoja HORARIO del Excel.
          </p>
        </div>
      </div>

      <div className="preview-stats">
        <div className="preview-stat">
          <Users size={20} />
          <div>
            <span>Colaboradores</span>
            <strong>{employees.length}</strong>
          </div>
        </div>

        <div className="preview-stat">
          <Clock3 size={20} />
          <div>
            <span>Horas semanales</span>
            <strong>{totalHours} h</strong>
          </div>
        </div>

        <div className="preview-stat">
          <CalendarDays size={20} />
          <div>
            <span>Días</span>
            <strong>7</strong>
          </div>
        </div>
      </div>

      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Colaborador</th>

              {DAYS.map((day) => (
                <th key={day.id}>{day.name}</th>
              ))}

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="employee-name">
                  {employee.name}
                </td>

                {DAYS.map((day) => {
                  const schedule = employee.schedule[day.id]

                  return (
                    <td key={day.id}>
                      {schedule?.isWorking ? (
                        <div className="shift">
                          <strong>
                            {schedule.start} - {schedule.end}
                          </strong>

                          <span>
                            {schedule.hours} h
                          </span>
                        </div>
                      ) : (
                        <span className="day-off">
                          LIBRE
                        </span>
                      )}
                    </td>
                  )
                })}

                <td className="weekly-total">
                  {employee.weeklyHours} h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default SchedulePreview