import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, pendingAbsencesCount, pendingExpensesCount, activeTimeEntriesCount }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Active Time Entries */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <h3 className="text-lg font-medium text-gray-900">Mitarbeiter aktiv</h3>
                            <p className="mt-2 text-3xl font-bold">{activeTimeEntriesCount}</p>
                        </div>

                        {/* Pending Absences */}
                        <Link href={route('admin.absences.index')} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center hover:bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Offene Abwesenheitsanträge</h3>
                            <p className="mt-2 text-3xl font-bold text-orange-500">{pendingAbsencesCount}</p>
                        </Link>

                        {/* Pending Expenses */}
                        <Link href={route('admin.expenses.index')} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center hover:bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Offene Spesenanträge</h3>
                            <p className="mt-2 text-3xl font-bold text-orange-500">{pendingExpensesCount}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
