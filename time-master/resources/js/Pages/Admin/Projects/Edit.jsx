import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ProjectForm from './Partials/ProjectForm';

export default function Edit({ auth, project }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Projekt bearbeiten</h2>}
        >
            <Head title="Projekt bearbeiten" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ProjectForm project={project} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
