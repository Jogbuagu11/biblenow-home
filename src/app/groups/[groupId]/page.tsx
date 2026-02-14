import { GroupDetailPage } from '@/components/pages/GroupDetailPage';

interface GroupDetailProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupDetail({ params }: GroupDetailProps) {
  const { groupId } = await params;
  return <GroupDetailPage groupId={groupId} />;
}

