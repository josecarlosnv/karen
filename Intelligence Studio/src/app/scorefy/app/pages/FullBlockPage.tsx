export function FullBlockPage() {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-200">
            <div className="bg-white shadow-lg p-10 rounded text-center max-w-xxl">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Acceso no autorizado
                </h1>

                <p className="text-gray-700">
                    El perfil con el que se intenta ingresar no cuenta con autorización para acceder a Scorefy.
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    En caso de requerir acceso, favor de gestionarlo a través del proceso establecido.
                </p>
            </div>
        </div>
    );
}