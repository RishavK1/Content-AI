import DashboardLayout from '../../components/layout/DashboardLayout';
import ContentForm from '../../components/ui/ContentForm';

export default function Caption() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <ContentForm
          title="Generate Captions"
          description="Create engaging captions for your social media posts"
          type="caption"
          platforms={['instagram', 'twitter', 'linkedin', 'facebook']}
          promptPlaceholder="Enter the context or topic for your caption (e.g., 'New product launch for our eco-friendly water bottles')"
        />
      </div>
    </DashboardLayout>
  );
}