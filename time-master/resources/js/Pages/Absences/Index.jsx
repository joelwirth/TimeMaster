import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, absences }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'Urlaub',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('absences.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Abwesenheiten verwalten</h2>}
        >
            <Head title="Abwesenheiten" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Neue Abwesenheit beantragen</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Füllen Sie das Formular aus, um eine neue Abwesenheit zu beantragen.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="type">Art der Abwesenheit</label>
                                    <select
                                        id="type"
                                        className="mt-1 block w-full"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        required
                                    >
                                        <option>Urlaub</option>
                                        <option>Krankheit</option>
                                        <option>Sonstiges</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="start_date">Startdatum</label>
                                    <input
                                        id="start_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="end_date">Enddatum</label>
                                    <input
                                        id="end_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="reason">Begründung (optional)</label>
                                    <textarea
                                        id="reason"
                                        className="mt-1 block w-full"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={processing}>Beantragen</button>
                                </div>
                            </form>
                        </section>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <h2 className="text-lg font-medium text-gray-900">Meine Anträge</h2>
                            <div className="mt-6 flow-root">
                                {absences.length > 0 ? (
                                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Art</th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Von</th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bis</th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {absences.map((absence) => (
                                                        <tr key={absence.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{absence.type}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(absence.start_date).toLocaleDateString('de-DE')}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(absence.end_date).toLocaleDateString('de-DE')}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{absence.status}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-600">Sie haben noch keine Anträge gestellt.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
