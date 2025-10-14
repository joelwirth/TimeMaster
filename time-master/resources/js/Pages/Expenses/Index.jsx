import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, expenses, categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        expense_category_id: categories[0]?.id || '',
        amount: '',
        expense_date: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('expenses.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Spesen verwalten</h2>}
        >
            <Head title="Spesen" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Neue Spesenabrechnung</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Füllen Sie das Formular aus, um eine neue Spesenabrechnung einzureichen.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="category">Kategorie</label>
                                    <select
                                        id="category"
                                        className="mt-1 block w-full"
                                        value={data.expense_category_id}
                                        onChange={(e) => setData('expense_category_id', e.target.value)}
                                        required
                                    >
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="amount">Betrag (€)</label>
                                    <input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        className="mt-1 block w-full"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="expense_date">Datum der Ausgabe</label>
                                    <input
                                        id="expense_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={data.expense_date}
                                        onChange={(e) => setData('expense_date', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description">Beschreibung (optional)</label>
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={processing}>Einreichen</button>
                                </div>
                            </form>
                        </section>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <h2 className="text-lg font-medium text-gray-900">Meine Spesenabrechnungen</h2>
                            <div className="mt-6 flow-root">
                                {expenses.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Datum</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategorie</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Betrag</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {expenses.map((expense) => (
                                                <tr key={expense.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{new Date(expense.expense_date).toLocaleDateString('de-DE')}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{expense.category.name}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{expense.amount} €</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{expense.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-600">Sie haben noch keine Spesen eingereicht.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
