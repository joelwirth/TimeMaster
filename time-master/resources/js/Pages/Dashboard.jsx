import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Dashboard({ auth, activeTimeEntry }) {
    const { post, processing } = useForm();

    const handleStart = (e) => {
        e.preventDefault();
        post(route('time-entries.start'));
    };

    const handleStop = (e) => {
        e.preventDefault();
        post(route('time-entries.stop'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900">Zeiterfassung</h3>
                            <div className="mt-4">
                                {activeTimeEntry ? (
                                    <div>
                                        <p>Arbeitszeit gestartet am: {new Date(activeTimeEntry.start_time).toLocaleString('de-DE')}</p>
                                        <form onSubmit={handleStop} className="mt-4">
                                            <button
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                                disabled={processing}
                                            >
                                                Stopp
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Keine aktive Zeiterfassung.</p>
                                        <form onSubmit={handleStart} className="mt-4">
                                            <button
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                                disabled={processing}
                                            >
                                                Start
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
