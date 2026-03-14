import { getProjects, type Project } from '@/lib/data';
import PortfolioGrid from '@/components/PortfolioGrid';

export const dynamic = 'force-dynamic';

export default function PortfolioPage() {
  const projects = getProjects();
  return <PortfolioGrid projects={projects} />;
}
