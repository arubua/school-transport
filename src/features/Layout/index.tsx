import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import  Sidebar  from "../Sidebar/Sidebar";
import  Navbar from "../Navbar";
import { getUser } from "../../utils/storage";
import { isUserTimedOut } from "../../utils/auth";
// import { clearStorage, getStorage } from "../../utils/storage";
// import appTitle from "../../utils/appTitle";
// import userLoggedInTimeout from "../../utils/userLoggedInTimeout";
// import { AUTH_END_POINT, NTSATEST_END_POINT } from "../../constants/strings";
// import axios from "axios";

interface LayoutProps {
  location: any; 
  menus: any[]; 
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
  const pathname = location.pathname;


  useEffect(() => {
    const lastPathSegment = pathname[pathname.length - 1];

    getAppTitle()
    setUserLoggedIn()
  }, [location]);

  const getAppTitle = () => {
    const pathSegments = pathname.split('/'); 
    const lastPathSegment = pathSegments[pathSegments.length - 1];

    let title =  lastPathSegment.charAt(0).toUpperCase() + lastPathSegment.slice(1);
    setTitle(title)

    return title
  };

  const setUserLoggedIn = async () => {
    let user = await getUser();
    if (!user.token && !user.username) return navigate("/login");
    const isSessionExpired = isUserTimedOut()
    if (isSessionExpired) {
      return navigate("/auth/signin");
    }
    setUser(user);
  };

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
      <div className="flex">
        <Sidebar
          onToggle={onToggle}
        //   app={props.app}
          menus={props.menus || []}
          pathname={location.pathname}
          hideSidebarOnMobile={hideSidebarOnMobile}
        />
        <div className="w-full" >
          <Navbar
            user={user || {}}
            onToggle={onToggle}
            // onSignMeOut={onSignMeOut}
            title={title}
            // notifications={alerts}
            // isLoadingViolationNotification={isLoadingViolationNotification}
          />
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
