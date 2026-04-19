// 1. 把 createBrowserRouter 改成 createHashRouter
import { createHashRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import AdoptionFormPage from "./pages/AdoptionFormPage";
import AdoptionAgreementPage from "./pages/AdoptionAgreementPage";
import MainLayout from "./pages/MainLayout";
import HomePage from "./pages/HomePage";
import ExercisePage from "./pages/ExercisePage";
import DietPage from "./pages/DietPage";
import SocialPage from "./pages/SocialPage";

// 2. 把 createBrowserRouter 改成 createHashRouter
export const router = createHashRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/onboarding",
    Component: OnboardingPage,
  },
  {
    path: "/adoption-form",
    Component: AdoptionFormPage,
  },
  {
    path: "/adoption-agreement",
    Component: AdoptionAgreementPage,
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "exercise", Component: ExercisePage },
      { path: "diet", Component: DietPage },
      { path: "social", Component: SocialPage },
    ],
  },
]);
