import { ConversationThread } from '@/components/pages/ConversationThread';
import { Layout } from '@/components/layout/Layout';

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params;
  if (!conversationId) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <p className="text-gray-500 dark:text-gray-400">Invalid conversation.</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <ConversationThread conversationId={conversationId} />
    </Layout>
  );
}
