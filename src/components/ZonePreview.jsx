import {
    MapPin,
    User,
    Clock3,
    CheckCircle2,
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
        description: 'M-Urb · Jordan · Fútbol',
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

    const getZoneAssignments = (
        day,
        zoneId
    ) => {

        const dayData =
            zoneAssignments?.[day]

        if (!dayData) {
            return []
        }

        if (dayData.zones?.[zoneId]) {
            return dayData.zones[zoneId]
        }

        return []
    }

    return (
        <section className="zone-preview">

            {/* ================================= */}
            {/* ENCABEZADO */}
            {/* ================================= */}

            <div className="planning-section-header">

                <div>
                    <span className="eyebrow">
                        PISO DE VENTAS
                    </span>

                    <h2>
                        Distribución de zonas
                    </h2>

                    <p>
                        Asignación del personal a las
                        diferentes ubicaciones de la tienda.
                    </p>
                </div>

                <div className="zone-header-badge">

                    <MapPin size={18} />

                    <span>
                        5 áreas
                    </span>

                </div>

            </div>

            {/* ================================= */}
            {/* DÍAS */}
            {/* ================================= */}

            <div className="zone-days">

                {DAYS.map((day) => {

                    return (
                        <div
                            className="zone-day-section"
                            key={day.id}
                        >

                            {/* HEADER DEL DÍA */}

                            <div className="zone-day-header">

                                <div className="zone-day-title">

                                    <div className="zone-day-icon">
                                        <MapPin
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            PLANIFICACIÓN
                                        </span>

                                        <h3>
                                            {day.name}
                                        </h3>
                                    </div>

                                </div>

                                <CheckCircle2
                                    size={19}
                                />

                            </div>

                            {/* ZONAS */}

                            <div className="zones-grid">

                                {ZONES.map(
                                    (zone) => {

                                        const people =
                                            getZoneAssignments(
                                                day.id,
                                                zone.id
                                            )

                                        return (
                                            <div
                                                className={`zone-card ${
                                                    zone.id ===
                                                    'accessories'
                                                        ? 'zone-card-accessories'
                                                        : ''
                                                }`}
                                                key={
                                                    zone.id
                                                }
                                            >

                                                {/* HEADER */}

                                                <div className="zone-card-header">

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

                                                    <span className="zone-count">
                                                        {
                                                            people.length
                                                        }
                                                        /2
                                                    </span>

                                                </div>

                                                {/* PERSONAS */}

                                                <div className="zone-people">

                                                    {people.length ===
                                                    0 ? (

                                                        <div className="zone-empty">
                                                            Sin asignación
                                                        </div>

                                                    ) : (

                                                        people.map(
                                                            (
                                                                person
                                                            ) => (

                                                                <div
                                                                    className="zone-person"
                                                                    key={
                                                                        person.employeeId
                                                                    }
                                                                >

                                                                    <div className="zone-person-icon">
                                                                        <User
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="zone-person-info">

                                                                        <strong>
                                                                            {
                                                                                person.employeeName
                                                                            }
                                                                        </strong>

                                                                        <span>

                                                                            <Clock3
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />

                                                                            {
                                                                                person.start
                                                                            }
                                                                            {' — '}
                                                                            {
                                                                                person.end
                                                                            }

                                                                        </span>

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

        </section>
    )
}

export default ZonePreview