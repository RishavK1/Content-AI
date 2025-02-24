import DashboardLayout from '../../components/layout/DashboardLayout';
import ContentForm from '../../components/ui/ContentForm';

export default function Video() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <ContentForm
          title="Video Scripts"
          description="Create compelling scripts for your video content"
          type="video"
          platforms={['youtube shorts', 'instagram reels', 'tiktok']}
          promptPlaceholder="Enter the topic or concept for your video (e.g., 'How to make a perfect cup of coffee')"
        />
      </div>
    </DashboardLayout>
  );
}