import { useState } from 'react'
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

import { readScheduleExcel } from '../services/excelParser'

function ExcelUploader({ onDataLoaded }) {

    const [fileName, setFileName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleFileChange = async (event) => {

        const file =
            event.target.files?.[0]

        if (!file) return

        setFileName(file.name)
        setError('')
        setLoading(true)

        try {

            const result =
                await readScheduleExcel(file)

            console.log(
                'Datos obtenidos de HORARIO:',
                result
            )

            onDataLoaded(result)

        } catch (err) {

            console.error(err)

            setError(
                err.message
            )

        } finally {

            setLoading(false)

        }
    }

    return (

        <div className="excel-uploader">

            <input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                hidden
            />

            <label
                htmlFor="excel-file"
                className="planning-action-button import"
            >

                <Upload size={19} />

                <span>
                    {loading
                        ? 'Leyendo archivo...'
                        : 'Importar horario Excel'}
                </span>

            </label>


            {fileName &&
                !error &&
                !loading && (

                    <div className="excel-status success">

                        <CheckCircle
                            size={17}
                        />

                        <span>
                            {fileName}
                        </span>

                    </div>

                )}


            {error && (

                <div className="excel-status error">

                    <AlertCircle
                        size={17}
                    />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {!fileName &&
                !error && (

                    <div className="excel-hint">

                        <FileSpreadsheet
                            size={16}
                        />

                        <span>
                            Selecciona el archivo
                            de horario (.xlsx)
                        </span>

                    </div>

                )}

        </div>

    )
}

export default ExcelUploader