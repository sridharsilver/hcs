import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Academics from "./pages/Academics.tsx";
import Admissions from "./pages/Admissions.tsx";
import Branches from "./pages/Branches.tsx";
import Gallery from "./pages/Gallery.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AdminLayout } from "./layouts/AdminLayout";
import { Dashboard } from "./pages/admin/dashboard/Dashboard";
import { Branches as AdminBranches } from "./pages/admin/branches/Branches";
import { AddBranch } from "./pages/admin/branches/AddBranch";
import { EditBranch } from "./pages/admin/branches/EditBranch";
import { ViewBranch } from "./pages/admin/branches/ViewBranch";
import { Students as AdminStudents } from "./pages/admin/students/Students";
import { AddStudent } from "./pages/admin/students/AddStudent";
import { EditStudent } from "./pages/admin/students/EditStudent";
import { StudentProfile } from "./pages/admin/students/StudentProfile";
import { Teachers as AdminTeachers } from "./pages/admin/teachers/Teachers";
import { AddTeacher } from "./pages/admin/teachers/AddTeacher";
import { EditTeacher } from "./pages/admin/teachers/EditTeacher";
import { TeacherProfile } from "./pages/admin/teachers/TeacherProfile";
import { Gallery as AdminGallery } from "./pages/admin/gallery/Gallery";
import { UploadGallery } from "./pages/admin/gallery/UploadGallery";
import { GalleryCategories } from "./pages/admin/gallery/Categories";
import { Settings as AdminSettings } from "./pages/admin/settings/Settings";
import { Enquiries as AdminEnquiries } from "./pages/admin/enquiries/Enquiries";


import { useTranslation } from "react-i18next";
import { SettingsProvider } from "./contexts/SettingsContext";

const queryClient = new QueryClient();

const pageTitles: Record<string, string> = {
  "/": "Hyderabad Central Schools",
  "/about": "About | Hyderabad Central Schools",
  "/academics": "Academics | Hyderabad Central Schools",
  "/admissions": "Admissions | Hyderabad Central Schools",
  "/branches": "Branches | Hyderabad Central Schools",
  "/gallery": "Gallery | Hyderabad Central Schools",
  "/contact": "Contact | Hyderabad Central Schools",
};

const DocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitles[pathname] ?? "Hyderabad Central Schools";
  }, [pathname]);

  return null;
};

const LanguageHandler = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const lang = i18n.language ? i18n.language.split('-')[0] : 'en';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <DocumentTitle />
          <LanguageHandler />
          <RoutesWithKey />
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

const RoutesWithKey = () => {
  const { i18n } = useTranslation();
  return (
    <Routes key={i18n.language}>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="branches" element={<AdminBranches />} />
        <Route path="branches/add" element={<AddBranch />} />
        <Route path="branches/edit/:id" element={<EditBranch />} />
        <Route path="branches/view/:id" element={<ViewBranch />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/edit/:id" element={<EditStudent />} />
        <Route path="students/profile/:id" element={<StudentProfile />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="teachers/add" element={<AddTeacher />} />
        <Route path="teachers/edit/:id" element={<EditTeacher />} />
        <Route path="teachers/profile/:id" element={<TeacherProfile />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="gallery/upload" element={<UploadGallery />} />
        <Route path="gallery/categories" element={<GalleryCategories />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
