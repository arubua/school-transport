import { Outlet, useLocation } from "react-router-dom";
import Layout from "../features/Layout";
import { menus } from "../utils/constants";
import { useEffect, useState } from "react";
import Splash from "../features/Splash";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Define a Zod schema for user data
const UserSchema = z.object({
  account: z.string(),
  token: z.string(),
  accountVerified: z.boolean(),
});

type User = z.infer<typeof UserSchema>;

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const location = useLocation();
  const history = useNavigate();

  useEffect(() => {
    // init();
  }, []);

  // async function init() {
  //   try {
  //     const userData = UserSchema.parse(await getStorage());
      
  //     if (!userData.account || !userData.token || !userData.accountVerified) {
  //       history.push("/auth/signin");
  //       return;
  //     }

  //     const isTimedOut = await userLoggedInTimeout(userData);
  //     if (isTimedOut) {
  //       history.push("/auth/signin");
  //       return;
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //     // Handle schema validation errors or other errors
  //     console.error("Error:", error);
  //   }
  // }

  if (loading) {
    return <Splash />;
  }

  return (
    <Layout location={location} user={user} menus={menus}>
      <Outlet />
    </Layout>
  );
};

export default Home;
