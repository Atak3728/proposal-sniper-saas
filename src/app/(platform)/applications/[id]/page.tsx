import { notFound } from 'next/navigation';
import { getApplication } from '@/actions/application-actions';
import ApplicationWorkspace from '@/components/applications/ApplicationWorkspace';

export default async function ApplicationDetailsPage({
    params
}: {
    params: { id: string }
}) {
    const result = await getApplication(params.id);

    if (!result.success || !result.data) {
        notFound();
    }

    return <ApplicationWorkspace application={result.data} />;
}
