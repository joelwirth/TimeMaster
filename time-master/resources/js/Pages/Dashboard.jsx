import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/Button';

export default function Dashboard({ auth, activeTimeEntry, projects }) {
    const { data, setData, post, processing } = useForm({
        project_id: projects[0]?.id || '',
    });

    const handleStart = (e) => {
        e.preventDefault();
        post(route('time-entries.start'), {
            data: { project_id: data.project_id },
        });
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
                                            <Button variant="destructive" disabled={processing}>Stopp</Button>
                                        </form>
                                    </div>
                                ) : (
                                    <form onSubmit={handleStart} className="space-y-4">
                                        <div>
                                            <label htmlFor="project" className="block text-sm font-medium text-gray-700">Projekt auswählen</label>
                                            <select
                                                id="project"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={data.project_id}
                                                onChange={(e) => setData('project_id', e.target.value)}
                                            >
                                                <option value="">Kein Projekt</option>
                                                {projects.map((project) => (
                                                    <option key={project.id} value={project.id}>
                                                        {project.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <Button disabled={processing}>Start</Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
