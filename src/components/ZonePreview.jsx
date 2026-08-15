import {
    MapPin,
    Clock3,
    Users,
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

const ZONES = [
    {
        id: 'zone1',
        name: 'Zona 1',
        description:
            'M-Urb · Jordan · Fútbol',
    },
    {
        id: 'zone2',
        name: 'Zona 2',
        description:
            'M-Trainn · M-Shoes · M-Runn · Campaña',
    },
    {
        id: 'zone3',
        name: 'Zona 3',
        description:
            'W-Runn · W-Trainn · W-Shoes',
    },
    {
        id: 'zone4',
        name: 'Zona 4',
        description:
            'W-Trainn · W-Urb',
    },
    {
        id: 'accessories',
        name: 'Acc / Espejos',
        description:
            'M-Acc · W-Acc · Panel-Acc · Espejos',
    },
]

function ZonePreview({
    zoneAssignments = {},
}) {

    return (
        <div className="zone-preview">

            <div className="zone-summary">

                <div className="zone-summary-card">

                    <MapPin size={18} />

                    <div>

                        <strong>
                            5
                        </strong>

                        <span>
                            áreas
                        </span>

                    </div>

                </div>

            </div>

            <div className="zone-days">

                {DAYS.map((day) => {

                    const dayData =
                        zoneAssignments[
                            day.id
                        ]

                    const assignments =
                        dayData?.assignments ||
                        []

                    return (
                        <div
                            className="zone-day-card"
                            key={day.id}
                        >

                            <div className="zone-day-header">

                                <div>

                                    <span>
                                        PLANIFICACIÓN
                                    </span>

                                    <strong>
                                        {day.name}
                                    </strong>

                                </div>

                                <div className="zone-day-total">

                                    <Users size={15} />

                                    <span>
                                        {
                                            assignments.length
                                        }
                                    </span>

                                </div>

                            </div>

                            <div className="zones-grid">

                                {ZONES.map(
                                    (zone) => {

                                        const zonePeople =
                                            assignments.filter(
                                                (
                                                    assignment
                                                ) =>
                                                    assignment.zoneId ===
                                                    zone.id ||
                                                    assignment.zone ===
                                                    zone.id ||
                                                    assignment.zoneName ===
                                                    zone.name
                                            )

                                        return (
                                            <div
                                                className={`zone-card ${
                                                    zonePeople.length ===
                                                    0
                                                        ? 'zone-card-empty'
                                                        : ''
                                                }`}
                                                key={
                                                    zone.id
                                                }
                                            >

                                                <div className="zone-card-header">

                                                    <div className="zone-title">

                                                        <div className="zone-icon">
                                                            <MapPin
                                                                size={16}
                                                            />
                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    zone.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    zone.description
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                    <span className="zone-capacity">

                                                        {
                                                            zonePeople.length
                                                        }
                                                        /2

                                                    </span>

                                                </div>

                                                <div className="zone-people">

                                                    {zonePeople.length ===
                                                    0 ? (

                                                        <div className="zone-no-assignment">

                                                            Sin asignación

                                                        </div>

                                                    ) : (

                                                        zonePeople.map(
                                                            (
                                                                person,
                                                                index
                                                            ) => (

                                                                <div
                                                                    className="zone-person"
                                                                    key={
                                                                        person.employeeId ||
                                                                        `${zone.id}-${index}`
                                                                    }
                                                                >

                                                                    <div className="zone-person-number">
                                                                        {
                                                                            index +
                                                                            1
                                                                        }
                                                                    </div>

                                                                    <div className="zone-person-info">

                                                                        <strong>
                                                                            {
                                                                                person.employeeName ||
                                                                                person.name
                                                                            }
                                                                        </strong>

                                                                        {(person.start ||
                                                                            person.scheduleStart) && (

                                                                            <span>

                                                                                <Clock3
                                                                                    size={13}
                                                                                />

                                                                                {
                                                                                    person.start ||
                                                                                    person.scheduleStart
                                                                                }

                                                                                {' '}
                                                                                —

                                                                                {' '}

                                                                                {
                                                                                    person.end ||
                                                                                    person.scheduleEnd
                                                                                }

                                                                            </span>

                                                                        )}

                                                                    </div>

                                                                </div>

                                                            )
                                                        )

                                                    )}

                                                </div>

                                            </div>
                                        )
                                    }
                                )}

                            </div>

                        </div>
                    )
                })}

            </div>

        </div>
    )
}

export default ZonePreview