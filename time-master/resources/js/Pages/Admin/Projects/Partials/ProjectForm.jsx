import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/Button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function ProjectForm({ project = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: project?.name || '',
        description: project?.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (project) {
            put(route('admin.projects.update', project.id));
        } else {
            post(route('admin.projects.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Projektname" />
                <TextInput
                    id="name"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Beschreibung (optional)" />
                <TextInput
                    id="description"
                    className="mt-1 block w-full"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
                <Button disabled={processing}>{project ? 'Speichern' : 'Erstellen'}</Button>
            </div>
        </form>
    );
}
