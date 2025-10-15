import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, users }) {
    const { data, setData, put, processing } = useForm({
        role: '',
        target_hours: '',
        vacation_days: '',
    });

    const updateRole = (user, newRole) => {
        put(route('admin.users.update', { user: user.id, role: newRole }), {
            preserveScroll: true,
        });
    };

    const handleFieldChange = (user, field, value) => {
        put(route('admin.users.update', { user: user.id, [field]: value }), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Benutzerverwaltung</h2>}
        >
            <Head title="Admin: Benutzer" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">E-Mail</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rolle</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Soll-Std./Monat</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Urlaubstage/Jahr</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{user.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => updateRole(user, e.target.value)}
                                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                        disabled={processing || user.id === auth.user.id}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <input
                                                        type="number"
                                                        defaultValue={user.target_hours}
                                                        onBlur={(e) => handleFieldChange(user, 'target_hours', e.target.value)}
                                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-24"
                                                        disabled={processing}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <input
                                                        type="number"
                                                        defaultValue={user.vacation_days}
                                                        onBlur={(e) => handleFieldChange(user, 'vacation_days', e.target.value)}
                                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-24"
                                                        disabled={processing}
                                                    />
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
