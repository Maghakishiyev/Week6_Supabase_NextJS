import { Auth, Typography, Button } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";

const Container = (props) => {
  const { user } = Auth.useUser();
  if (user)
    return (
      <>
        <Typography.Text>Signed in: {user.email}</Typography.Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  return props.children;
};

export default function AuthBasic() {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container supabaseClient={supabase}>
        <Button
          onClick={async () => {
            const { error } = await supabase.auth.signIn({
              provider: "google",
            });
            if (error) console.log(error);
          }}
        >
          <h1>Sign In With Google</h1>
        </Button>
        <h2>Or</h2>
        <Auth supabaseClient={supabase} />
      </Container>
    </Auth.UserContextProvider>
  );
}
