import AuthForm from "@/components/auth/AuthForm";
import RecordingContainer from "@/components/recording/RecordingContainer";
import { useSupabase } from "@/providers/SupabaseProvider";

const Index = () => {
  const { user } = useSupabase();

  return (
    <div className="container mx-auto py-8">
      {user ? (
        <RecordingContainer />
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default Index;