import { GroupInfoPage } from '@/components/pages/GroupInfoPage';

interface GroupInfoProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupInfo({ params }: GroupInfoProps) {
  const { groupId } = await params;
  return <GroupInfoPage groupId={groupId} />;
}

