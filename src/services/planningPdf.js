import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


/* ============================================================
   DÍAS
============================================================ */

const DAYS = [
    {
        id: 'monday',
        name: 'Lunes',
    },
    {
        id: 'tuesday',
        name: 'Martes',
    },
    {
        id: 'wednesday',
        name: 'Miércoles',
    },
    {
        id: 'thursday',
        name: 'Jueves',
    },
    {
        id: 'friday',
        name: 'Viernes',
    },
    {
        id: 'saturday',
        name: 'Sábado',
    },
    {
        id: 'sunday',
        name: 'Domingo',
    },
]


/* ============================================================
   HORARIOS DE ALMUERZO
============================================================ */

const LUNCH_TIMES = [
    {
        shift: 1,
        label: '12:30',
    },
    {
        shift: 2,
        label: '13:30',
    },
    {
        shift: 3,
        label: '14:30',
    },
    {
        shift: 4,
        label: '15:30',
    },
]


/* ============================================================
   UTILIDADES
============================================================ */

function safeText(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return ''
    }

    return String(value)
}


/* ============================================================
   FECHA
============================================================ */

function formatDate() {

    const date =
        new Date()

    return date.toLocaleDateString(
        'es-EC',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }
    )
}


/* ============================================================
   NORMALIZAR TEXTO
   Se utiliza para reconocer las zonas aunque
   tengan pequeñas diferencias de escritura.
============================================================ */

function normalizeText(value) {

    return safeText(value)
        .normalize('NFD')
        .replace(
            /[\u0300-\u036f]/g,
            ''
        )
        .toLowerCase()
        .trim()
}


/* ============================================================
   OBTENER ZONA
============================================================ */

function getZoneKey(zoneName) {

    const zone =
        normalizeText(zoneName)


    /*
     * Accesorios / Espejos
     */

    if (
        zone.includes('acc') ||
        zone.includes('espejo')
    ) {
        return 'acc'
    }


    /*
     * Zona 1
     */

    if (
        zone.includes('zona 1') ||
        zone === '1'
    ) {
        return 'zone1'
    }


    /*
     * Zona 2
     */

    if (
        zone.includes('zona 2') ||
        zone === '2'
    ) {
        return 'zone2'
    }


    /*
     * Zona 3
     */

    if (
        zone.includes('zona 3') ||
        zone === '3'
    ) {
        return 'zone3'
    }


    /*
     * Zona 4
     */

    if (
        zone.includes('zona 4') ||
        zone === '4'
    ) {
        return 'zone4'
    }


    return 'other'
}


/* ============================================================
   ENCABEZADO GENERAL
============================================================ */

function addHeader(
    doc,
    title,
    subtitle
) {

    const pageWidth =
        doc.internal.pageSize.getWidth()


    /*
     * Logo / nombre
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(10)

    doc.setTextColor(
        30,
        30,
        30
    )

    doc.text(
        'NIKE STAFF PLANNER',
        15,
        12
    )


    /*
     * Título
     */

    doc.setFontSize(19)

    doc.setTextColor(
        20,
        20,
        20
    )

    doc.text(
        title,
        pageWidth / 2,
        17,
        {
            align: 'center',
        }
    )


    /*
     * Subtítulo
     */

    doc.setFont(
        'helvetica',
        'normal'
    )

    doc.setFontSize(8)

    doc.setTextColor(
        100,
        100,
        100
    )

    doc.text(
        subtitle,
        pageWidth / 2,
        23,
        {
            align: 'center',
        }
    )


    /*
     * Fecha
     */

    doc.setFontSize(7)

    doc.text(
        `Generado: ${formatDate()}`,
        pageWidth - 15,
        12,
        {
            align: 'right',
        }
    )


    /*
     * Línea separadora
     */

    doc.setDrawColor(
        210,
        210,
        210
    )

    doc.setLineWidth(
        0.3
    )

    doc.line(
        15,
        27,
        pageWidth - 15,
        27
    )
}


/* ============================================================
   TÍTULO DE SECCIÓN
============================================================ */

function addSectionTitle(
    doc,
    title,
    y
) {

    const pageWidth =
        doc.internal.pageSize.getWidth()

    /*
     * Barra de sección
     */

    doc.setFillColor(
        20,
        185,
        155
    )

    doc.roundedRect(
        15,
        y,
        pageWidth - 30,
        7,
        1.5,
        1.5,
        'F'
    )


    /*
     * Texto
     */

    doc.setFont(
        'helvetica',
        'bold'
    )

    doc.setFontSize(9)

    doc.setTextColor(
        255,
        255,
        255
    )

    doc.text(
        title,
        19,
        y + 4.8
    )


    return y + 10
}


/* ============================================================
   PIE DE PÁGINA
============================================================ */

function addFooter(
    doc,
    pageNumber
) {

    const pageWidth =
        doc.internal.pageSize.getWidth()

    const pageHeight =
        doc.internal.pageSize.getHeight()


    doc.setDrawColor(
        220,
        220,
        220
    )

    doc.setLineWidth(
        0.25
    )

    doc.line(
        15,
        pageHeight - 11,
        pageWidth - 15,
        pageHeight - 11
    )


    doc.setFont(
        'helvetica',
        'normal'
    )

    doc.setFontSize(7)

    doc.setTextColor(
        120,
        120,
        120
    )


    doc.text(
        'Nike Staff Planner • Quicentro',
        15,
        pageHeight - 6
    )


    doc.text(
        `Página ${pageNumber} de 2`,
        pageWidth - 15,
        pageHeight - 6,
        {
            align: 'right',
        }
    )
}


/* ============================================================
   OBTENER ASIGNACIÓN DE UN DÍA
============================================================ */

function findAssignmentByDay(
    assignments,
    dayId
) {

    if (
        !Array.isArray(
            assignments
        )
    ) {
        return null
    }


    return assignments.find(
        (assignment) =>
            assignment?.day === dayId
    ) || null
}


/* ============================================================
   PÁGINA 1
   A15 + LIMPIEZA
============================================================ */

function buildActivitiesPage(
    doc,
    a15Assignments,
    cleaningAssignments
) {

    addHeader(
        doc,
        'PLANIFICACIÓN DE ACTIVIDADES',
        'Distribución semanal de A15 y Limpieza'
    )


    let currentY = 33


    currentY =
        addSectionTitle(
            doc,
            'A15 Y LIMPIEZA',
            currentY
        )


    /*
     * Construir las 7 filas
     */

    const rows = []


    DAYS.forEach(
        (day) => {

            const a15 =
                findAssignmentByDay(
                    a15Assignments,
                    day.id
                )


            const cleaning =
                findAssignmentByDay(
                    cleaningAssignments,
                    day.id
                )


            rows.push([

                day.name,

                a15
                    ? safeText(
                        a15.employeeName
                    )
                    : 'Sin asignación',

                a15
                    ? safeText(
                        a15.start
                    )
                    : '—',

                cleaning
                    ? safeText(
                        cleaning.employeeName
                    )
                    : 'Sin asignación',

                cleaning
                    ? safeText(
                        cleaning.start
                    )
                    : '—',

            ])
        }
    )


    autoTable(
        doc,
        {
            startY: currentY,

            head: [
                [
                    'DÍA',
                    'A15',
                    'INGRESO',
                    'LIMPIEZA',
                    'INGRESO',
                ],
            ],

            body: rows,

            theme: 'grid',

            margin: {
                left: 15,
                right: 15,
            },

            styles: {
                font: 'helvetica',
                fontSize: 9,
                cellPadding: 5,
                valign: 'middle',
                lineColor: [
                    220,
                    220,
                    220,
                ],
                lineWidth: 0.25,
                textColor: [
                    60,
                    60,
                    60,
                ],
            },

            headStyles: {
                fillColor: [
                    20,
                    185,
                    155,
                ],

                textColor: [
                    255,
                    255,
                    255,
                ],

                fontStyle: 'bold',

                fontSize: 8,

                halign: 'center',

                valign: 'middle',

                cellPadding: 4,
            },

            bodyStyles: {
                minCellHeight: 12,
            },

            alternateRowStyles: {
                fillColor: [
                    248,
                    250,
                    250,
                ],
            },

            columnStyles: {

                0: {
                    cellWidth: 30,
                    halign: 'center',
                    fontStyle: 'bold',
                },

                1: {
                    cellWidth: 65,
                },

                2: {
                    cellWidth: 30,
                    halign: 'center',
                },

                3: {
                    cellWidth: 65,
                },

                4: {
                    cellWidth: 30,
                    halign: 'center',
                },

            },
        }
    )


    /*
     * Nota inferior
     */

    const finalY =
        doc.lastAutoTable.finalY


    doc.setFont(
        'helvetica',
        'normal'
    )

    doc.setFontSize(7)

    doc.setTextColor(
        110,
        110,
        110
    )


    doc.text(
        'Las asignaciones se generan automáticamente según las reglas de planificación configuradas.',
        15,
        finalY + 9
    )


    /*
     * Pie
     */

    addFooter(
        doc,
        1
    )
}


/* ============================================================
   CONSTRUIR TEXTO DE ALMUERZOS
============================================================ */

function getLunchPeople(
    result,
    shift
) {

    const assignments =
        result?.assignments || []


    const people =
        assignments.filter(
            (assignment) =>
                Number(
                    assignment?.lunchShift
                ) === shift
        )


    if (
        people.length === 0
    ) {
        return '—'
    }


    return people
        .map(
            (person) =>
                safeText(
                    person.employeeName
                )
        )
        .join('\n')
}


/* ============================================================
   CONSTRUIR TEXTO DE ZONAS
============================================================ */

function getZonePeople(
    result,
    zoneKey
) {

    const assignments =
        result?.assignments || []


    const people =
        assignments.filter(
            (assignment) =>
                getZoneKey(
                    assignment?.zoneName
                ) === zoneKey
        )


    if (
        people.length === 0
    ) {
        return '—'
    }


    return people
        .map(
            (person) => {

                const name =
                    safeText(
                        person.employeeName
                    )


                const start =
                    safeText(
                        person.start
                    )


                return start
                    ? `${name}\n${start}`
                    : name
            }
        )
        .join('\n\n')
}


/* ============================================================
   PÁGINA 2
   ALMUERZOS + ZONAS
============================================================ */

function buildLunchAndZonesPage(
    doc,
    lunchAssignments,
    zoneAssignments
) {

    addHeader(
        doc,
        'PLANIFICACIÓN DE OPERACIONES',
        'Distribución de almuerzos y zonas del piso de ventas'
    )


    let currentY = 33


    /* ========================================================
       ALMUERZOS
    ======================================================== */

    currentY =
        addSectionTitle(
            doc,
            'ALMUERZOS',
            currentY
        )


    /*
     * Una sola fila por día.
     * Cada columna representa un turno.
     */

    const lunchRows =
        DAYS.map(
            (day) => {

                const result =
                    lunchAssignments?.[
                        day.id
                    ]


                return [

                    day.name,

                    getLunchPeople(
                        result,
                        1
                    ),

                    getLunchPeople(
                        result,
                        2
                    ),

                    getLunchPeople(
                        result,
                        3
                    ),

                    getLunchPeople(
                        result,
                        4
                    ),

                ]
            }
        )


    autoTable(
        doc,
        {
            startY: currentY,

            head: [
                [
                    'DÍA',
                    '12:30 - 13:30',
                    '13:30 - 14:30',
                    '14:30 - 15:30',
                    '15:30 - 16:30',
                ],
            ],

            body: lunchRows,

            theme: 'grid',

            margin: {
                left: 15,
                right: 15,
            },

            styles: {
                font: 'helvetica',

                fontSize: 6.5,

                cellPadding: 2.5,

                valign: 'middle',

                lineColor: [
                    220,
                    220,
                    220,
                ],

                lineWidth: 0.25,

                textColor: [
                    60,
                    60,
                    60,
                ],

                overflow: 'linebreak',
            },

            headStyles: {

                fillColor: [
                    20,
                    185,
                    155,
                ],

                textColor: [
                    255,
                    255,
                    255,
                ],

                fontStyle: 'bold',

                fontSize: 6.5,

                halign: 'center',

                valign: 'middle',

                cellPadding: 3,
            },

            alternateRowStyles: {
                fillColor: [
                    248,
                    250,
                    250,
                ],
            },

            columnStyles: {

                0: {
                    cellWidth: 28,
                    halign: 'center',
                    fontStyle: 'bold',
                },

                1: {
                    cellWidth: 61,
                },

                2: {
                    cellWidth: 61,
                },

                3: {
                    cellWidth: 61,
                },

                4: {
                    cellWidth: 61,
                },

            },
        }
    )


    /*
     * Siguiente sección
     */

    currentY =
        doc.lastAutoTable.finalY +
        8


    /* ========================================================
       ZONAS
    ======================================================== */

    currentY =
        addSectionTitle(
            doc,
            'ZONAS DEL PISO DE VENTAS',
            currentY
        )


    /*
     * Tabla compacta de zonas.
     *
     * Cada fila = un día.
     *
     * Cada celda contiene los nombres
     * asignados a esa zona.
     */

    const zoneRows =
        DAYS.map(
            (day) => {

                const result =
                    zoneAssignments?.[
                        day.id
                    ]


                return [

                    day.name,

                    getZonePeople(
                        result,
                        'zone1'
                    ),

                    getZonePeople(
                        result,
                        'zone2'
                    ),

                    getZonePeople(
                        result,
                        'zone3'
                    ),

                    getZonePeople(
                        result,
                        'zone4'
                    ),

                    getZonePeople(
                        result,
                        'acc'
                    ),

                ]
            }
        )


    autoTable(
        doc,
        {
            startY: currentY,

            head: [
                [
                    'DÍA',
                    'ZONA 1',
                    'ZONA 2',
                    'ZONA 3',
                    'ZONA 4',
                    'ACC. / ESPEJOS',
                ],
            ],

            body: zoneRows,

            theme: 'grid',

            margin: {
                left: 15,
                right: 15,
            },

            styles: {

                font: 'helvetica',

                fontSize: 6.2,

                cellPadding: 2.3,

                valign: 'middle',

                lineColor: [
                    220,
                    220,
                    220,
                ],

                lineWidth: 0.25,

                textColor: [
                    60,
                    60,
                    60,
                ],

                overflow: 'linebreak',
            },

            headStyles: {

                fillColor: [
                    20,
                    185,
                    155,
                ],

                textColor: [
                    255,
                    255,
                    255,
                ],

                fontStyle: 'bold',

                fontSize: 6.2,

                halign: 'center',

                valign: 'middle',

                cellPadding: 3,
            },

            alternateRowStyles: {
                fillColor: [
                    248,
                    250,
                    250,
                ],
            },

            columnStyles: {

                0: {
                    cellWidth: 25,
                    halign: 'center',
                    fontStyle: 'bold',
                },

                1: {
                    cellWidth: 51,
                },

                2: {
                    cellWidth: 51,
                },

                3: {
                    cellWidth: 51,
                },

                4: {
                    cellWidth: 51,
                },

                5: {
                    cellWidth: 57,
                },

            },
        }
    )


    /*
     * Pie
     */

    addFooter(
        doc,
        2
    )
}


/* ============================================================
   FUNCIÓN PRINCIPAL
============================================================ */

export function openPlanningPDF({

    a15Assignments = [],

    cleaningAssignments = [],

    lunchAssignments = {},

    zoneAssignments = {},

}) {

    try {

        /*
         * ====================================================
         * DOCUMENTO A4 HORIZONTAL
         * ====================================================
         *
         * Landscape nos permite tener suficiente ancho
         * para las tablas de almuerzos y zonas.
         */

        const doc =
            new jsPDF({

                orientation: 'landscape',

                unit: 'mm',

                format: 'a4',

            })


        /*
         * ====================================================
         * PÁGINA 1
         * A15 + LIMPIEZA
         * ====================================================
         */

        buildActivitiesPage(
            doc,
            a15Assignments,
            cleaningAssignments
        )


        /*
         * ====================================================
         * PÁGINA 2
         * ALMUERZOS + ZONAS
         * ====================================================
         */

        doc.addPage()


        buildLunchAndZonesPage(
            doc,
            lunchAssignments,
            zoneAssignments
        )


        /*
         * ====================================================
         * GENERAR BLOB
         * ====================================================
         */

        const pdfBlob =
            doc.output(
                'blob'
            )


        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            )


        /*
         * ====================================================
         * ABRIR PDF
         * ====================================================
         */

        const newWindow =
            window.open(
                pdfUrl,
                '_blank'
            )


        /*
         * Si el navegador bloquea
         * la ventana emergente.
         */

        if (!newWindow) {

            doc.save(
                'planificacion-semanal.pdf'
            )


            URL.revokeObjectURL(
                pdfUrl
            )


            return
        }


        /*
         * Liberar URL posteriormente.
         */

        setTimeout(
            () => {

                URL.revokeObjectURL(
                    pdfUrl
                )

            },
            60000
        )

    } catch (error) {

        console.error(
            'ERROR AL GENERAR PDF:',
            error
        )


        alert(
            'No se pudo generar el PDF de la planificación.'
        )
    }
}