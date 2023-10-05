import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import  Sidebar  from "../Sidebar/Sidebar";
// import { Navbar } from "../Navbar";
// import { clearStorage, getStorage } from "../../utils/storage";
// import appTitle from "../../utils/appTitle";
// import userLoggedInTimeout from "../../utils/userLoggedInTimeout";
// import { AUTH_END_POINT, NTSATEST_END_POINT } from "../../constants/strings";
// import axios from "axios";

interface LayoutProps {
  location: any; 
  menus: any[]; 
  user: any; 
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const [title, setTitle] = useState<string>("");
  const [user, setUser] = useState<any>();
  const [isSidebarFullVisible, setSideBarVisibility] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoadingViolationNotification, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let path = pathname.replaceAll("/", " ").trim();
    // document.title = appTitle(path);
    setTitle(path);
  }, [location]);

//   const setUserLoggedIn = async () => {
//     let user = await getStorage();
//     if (!user.token && !user.accountVerified) return navigate("/login");
//     const isSessionExpired = userLoggedInTimeout(user);
//     if (isSessionExpired) {
//       return navigate("/auth/signin");
//     }
//     setUser(user);
//   };

  function onToggle() {
    const sidebar_class = document.getElementById("sidebar")!.classList;
    if (sidebar_class.contains("show")) {
      sidebar_class.remove("show");
      sidebar_class.add("hide");
      return;
    }
    sidebar_class.add("show");
    sidebar_class.remove("hide");
  }

  function hideSidebarOnMobile() {
    const screenWidth = window.screen.availWidth;
    const sidebar_class = document.getElementById("sidebar")!.classList;
    if (screenWidth < 600 && sidebar_class.contains("show")) {
      sidebar_class.remove("show");
      sidebar_class.add("hide");
      return;
    }
  }

//   const onSignMeOut = async () => {
//     await clearStorage();
//     navigate("/auth/signin");
//   };

  return (
    <div>
      <div className="app-home-container">
        <Sidebar
          onToggle={onToggle}
        //   app={props.app}
          menus={props.menus || []}
          pathname={location.pathname}
          hideSidebarOnMobile={hideSidebarOnMobile}
        />
        <div className="app-main-container">
          {/* <Navbar
            user={props.user || {}}
            onToggle={onToggle}
            onSignMeOut={onSignMeOut}
            title={title}
            notifications={alerts}
            isLoadingViolationNotification={isLoadingViolationNotification}
          /> */}
          <div id="app-main-content" className="app-main-content">
            <div
              style={{
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            >
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
