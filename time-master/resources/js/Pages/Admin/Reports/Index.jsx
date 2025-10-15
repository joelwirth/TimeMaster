import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/Components/Button';

export default function Index({ auth, timeEntries, totalHours, users, projects, filters }) {
    const { data, setData } = useForm({
        user_id: filters.user_id || '',
        project_id: filters.project_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);

        // This is a simple way to refetch data on change.
        // A more advanced solution might use a "Apply Filters" button.
        const query = { ...data, [name]: value };
        router.get(route('admin.reports.index'), query, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Berichte</h2>}
        >
            <Head title="Admin: Berichte" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Filter Section */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Filter</h3>
                            <a href={route('admin.reports.export', data)} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150">
                                Export CSV
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* User Filter */}
                            <div>
                                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">Mitarbeiter</label>
                                <select name="user_id" value={data.user_id} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option value="">Alle</option>
                                    {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                                </select>
                            </div>
                            {/* Project Filter */}
                            <div>
                                <label htmlFor="project_id" className="block text-sm font-medium text-gray-700">Projekt</label>
                                <select name="project_id" value={data.project_id} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option value="">Alle</option>
                                    {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                                </select>
                            </div>
                            {/* Date From Filter */}
                            <div>
                                <label htmlFor="date_from" className="block text-sm font-medium text-gray-700">Von Datum</label>
                                <input type="date" name="date_from" value={data.date_from} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            {/* Date To Filter */}
                            <div>
                                <label htmlFor="date_to" className="block text-sm font-medium text-gray-700">Bis Datum</label>
                                <input type="date" name="date_to" value={data.date_to} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Gefilterte Zeiteinträge (Gesamtstunden: {totalHours})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mitarbeiter</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Projekt</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Start</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ende</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dauer (Stunden)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {timeEntries.map((entry) => (
                                            <tr key={entry.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{entry.user.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{entry.project?.name || '-'}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(entry.start_time).toLocaleString('de-DE')}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(entry.end_time).toLocaleString('de-DE')}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{((new Date(entry.end_time) - new Date(entry.start_time)) / 3600000).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
