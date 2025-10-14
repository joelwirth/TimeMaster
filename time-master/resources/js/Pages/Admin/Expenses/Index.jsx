import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, expenses }) {
    const { put, processing } = useForm();

    const updateStatus = (expenseId, status) => {
        put(route('admin.expenses.update', { expense: expenseId, status: status }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Spesenanträge verwalten</h2>}
        >
            <Head title="Admin: Spesen" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Mitarbeiter</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Datum</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategorie</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Betrag</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Aktionen</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {expenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{expense.user.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(expense.expense_date).toLocaleDateString('de-DE')}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{expense.category.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{expense.amount} €</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{expense.status}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    {expense.status === 'pending' && (
                                                        <div className="flex gap-x-4">
                                                            <button
                                                                onClick={() => updateStatus(expense.id, 'approved')}
                                                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                                disabled={processing}
                                                            >
                                                                Genehmigen
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(expense.id, 'rejected')}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                                disabled={processing}
                                                            >
                                                                Ablehnen
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
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
