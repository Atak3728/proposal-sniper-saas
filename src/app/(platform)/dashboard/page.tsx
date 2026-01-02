import { getApplications } from '@/actions/application-actions';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams?.query || "";
  const result = await getApplications(query);
  const applications = result.success ? result.data || [] : [];

  return <DashboardClient initialApplications={applications} />;
}