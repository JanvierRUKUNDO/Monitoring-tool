import React, { createContext, useContext, useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types";
import { mockApplications, getApplicationsByStatus } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";

interface ApplicationContextType {
  applications: Application[];
  applicationsByStatus: Record<ApplicationStatus, Application[]>;
  addApplication: (application: Omit<Application, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => void;
  updateApplication: (id: string, application: Partial<Application>) => void;
  getApplication: (id: string) => Application | undefined;
  isLoading: boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsByStatus, setApplicationsByStatus] = useState<Record<ApplicationStatus, Application[]>>({} as Record<ApplicationStatus, Application[]>);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load mock data
    setApplications(mockApplications);
    setApplicationsByStatus(getApplicationsByStatus());
    setIsLoading(false);
  }, []);

  const addApplication = (newApplication: Omit<Application, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => {
    if (!user || user.role !== "admin") {
      console.warn("Only admin users can add new applications");
      return;
    }

    const now = new Date().toISOString();
    const application: Application = {
      ...newApplication,
      id: `APP-${applications.length + 1}`,
      createdAt: now,
      updatedAt: now,
      createdBy: user.id,
      updatedBy: user.id,
    };

    setApplications(prev => [...prev, application]);
    
    // Update applications by status
    const status = application.applicationStatus.applicationStatus;
    setApplicationsByStatus(prev => ({
      ...prev,
      [status]: [...(prev[status] || []), application]
    }));
  };

  const updateApplication = (id: string, updatedFields: Partial<Application>) => {
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      console.warn("Only admin and staff users can update applications");
      return;
    }

    setApplications(prev => {
      const updatedApplications = prev.map(app => {
        if (app.id === id) {
          const updatedApp = {
            ...app,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
            updatedBy: user.id,
          };
          
          // If application status changed, update the applicationsByStatus state
          if (updatedFields.applicationStatus?.applicationStatus && 
              updatedFields.applicationStatus.applicationStatus !== app.applicationStatus.applicationStatus) {
            const oldStatus = app.applicationStatus.applicationStatus;
            const newStatus = updatedFields.applicationStatus.applicationStatus;
            
            setApplicationsByStatus(prev => {
              const oldStatusApps = prev[oldStatus].filter(a => a.id !== id);
              const newStatusApps = [...(prev[newStatus] || []), updatedApp];
              
              return {
                ...prev,
                [oldStatus]: oldStatusApps,
                [newStatus]: newStatusApps,
              };
            });
          }
          
          return updatedApp;
        }
        return app;
      });
      
      return updatedApplications;
    });
  };

  const getApplication = (id: string) => {
    return applications.find(app => app.id === id);
  };

  return (
    <ApplicationContext.Provider 
      value={{ 
        applications, 
        applicationsByStatus, 
        addApplication, 
        updateApplication, 
        getApplication, 
        isLoading 
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error("useApplications must be used within an ApplicationProvider");
  }
  return context;
};
