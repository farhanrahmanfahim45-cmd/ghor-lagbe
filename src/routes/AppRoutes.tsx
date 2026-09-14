import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Intake from "@/pages/Intake";
import PropertyDetail from "@/pages/PropertyDetail";
import Compare from "@/pages/Compare";
import Saved from "@/pages/Saved";
import ListProperty from "@/pages/ListProperty";
import Owner from "@/pages/Owner";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/intake" element={<Intake />} />
      <Route path="/search" element={<Search />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/list-property" element={<ListProperty />} />
      <Route path="/owner" element={<Owner />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
