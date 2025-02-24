import DashboardLayout from '../../components/layout/DashboardLayout';
import ContentForm from '../../components/ui/ContentForm';

export default function Image() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <ContentForm
          title="Image Ideas"
          description="Get creative ideas for your visual content"
          type="image"
          platforms={['instagram', 'pinterest', 'linkedin']}
          promptPlaceholder="Enter the theme or concept for your images (e.g., 'Minimalist workspace setup', 'Nature photography')"
        />
      </div>
    </DashboardLayout>
  );
}