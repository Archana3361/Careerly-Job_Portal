import React, { createContext, useContext, useState, useEffect } from "react";
import { initialApplications } from "../data/applications";
import { initialNotifications } from "../data/notifications";
import { createJwt, verifyJwt } from "../utils/jwt";

const AppContext = createContext();

const getStoredUser = async () => {
  try {
    const token = localStorage.getItem("careerly_token");
    if (!token) return null;

    const payload = await verifyJwt(token);
    if (!payload?.user) {
      localStorage.removeItem("careerly_token");
      localStorage.removeItem("careerly_user");
      return null;
    }

    return payload.user;
  } catch {
    localStorage.removeItem("careerly_token");
    localStorage.removeItem("careerly_user");
    return null;
  }
};

export const AppProvider = ({ children }) => {
  // Auth
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      const user = await getStoredUser();
      if (isMounted) {
        setCurrentUser(user);
      }
    };

    hydrateUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // Saved jobs
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("careerly_saved")) || [];
    } catch {
      return [];
    }
  });

  // Applications
  const [applications, setApplications] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("careerly_apps"));
      return stored && stored.length > 0 ? stored : initialApplications;
    } catch {
      return initialApplications;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("careerly_notifs"));
      return stored && stored.length > 0 ? stored : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  // Recently viewed jobs
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("careerly_recent")) || [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("careerly_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("careerly_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("careerly_saved", JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem("careerly_apps", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("careerly_notifs", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("careerly_recent", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Auth actions
  const login = async (user) => {
    if (!user) return null;
    const token = await createJwt({ user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 });
    localStorage.setItem("careerly_token", token);
    setCurrentUser(user);
    return token;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("careerly_user");
    localStorage.removeItem("careerly_token");
  };

  const register = async (userData) => {
    const user = { ...userData, id: Date.now() };
    const token = await createJwt({ user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 });
    localStorage.setItem("careerly_token", token);
    setCurrentUser(user);
    return token;
  };

  // Saved jobs actions
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  // Applications actions
  const applyToJob = (applicationData) => {
    const newApp = {
      ...applicationData,
      id: Date.now(),
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Applied",
      interview: null,
    };
    setApplications((prev) => [newApp, ...prev]);

    // Add notification
    addNotification({
      type: "submitted",
      title: "Application Submitted",
      message: `Your application for ${applicationData.jobTitle} at ${applicationData.company} has been submitted.`,
    });

    return newApp;
  };

  const hasApplied = (jobId) =>
    applications.some((app) => app.jobId === parseInt(jobId));

  const updateApplicationStatus = (appId, status, interviewData = null) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, status, interview: interviewData || app.interview }
          : app
      )
    );
  };

  // Notifications actions
  const addNotification = (notif) => {
    const newNotif = {
      ...notif,
      id: Date.now(),
      time: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Recently viewed
  const addToRecentlyViewed = (jobId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== jobId);
      return [jobId, ...filtered].slice(0, 5);
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        savedJobs,
        toggleSaveJob,
        isJobSaved,
        applications,
        applyToJob,
        hasApplied,
        updateApplicationStatus,
        notifications,
        addNotification,
        markNotificationRead,
        markAllRead,
        unreadCount,
        recentlyViewed,
        addToRecentlyViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
